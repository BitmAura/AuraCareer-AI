"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, type AuthUser } from "@/store/use-auth";
import { api, ApiError } from "@/lib/api";

function SessionShell({ label }: { label: string }) {
  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden w-56 border-r bg-sidebar md:block" />
      <div className="flex flex-1 flex-col">
        <div className="h-14 border-b" />
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

const PUBLIC_DASHBOARD_ROUTES = ["/jobs"];

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hydrated, hydrate, logout, setSession, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sessionChecked, setSessionChecked] = useState(false);
  const isPublicRoute = PUBLIC_DASHBOARD_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

  useLayoutEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      try {
        const me = await api<{ user: AuthUser; access_token?: string }>("/auth/me");
        if (cancelled) return;
        if (me?.user) {
          setSession(me.user, me.access_token || token || "supabase");
          setSessionChecked(true);
          return;
        }
        await logout();
        setSessionChecked(true);
        if (!isPublicRoute) router.replace("/login");
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
          await logout();
          setSessionChecked(true);
          if (!isPublicRoute) router.replace("/login");
          return;
        }
        // Network blip: keep current client session if we already have one
        setSessionChecked(true);
        if (!isAuthenticated && !isPublicRoute) router.replace("/login");
      }
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally omit isAuthenticated — only re-check when hydrate completes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isPublicRoute, logout, router, setSession, token]);

  if (!hydrated || !sessionChecked) {
    return <SessionShell label="Checking session…" />;
  }
  if (!isAuthenticated && !isPublicRoute) {
    return <SessionShell label="Redirecting to sign in…" />;
  }

  return <>{children}</>;
}
