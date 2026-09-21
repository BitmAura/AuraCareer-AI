"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AuthBackHome } from "@/components/marketing/auth-back-home";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { isSupabaseAuthReady } from "@/lib/supabase/env";
import { PRODUCT_STANCE } from "@/lib/product/stance";

export default function RegisterPage() {
  const configured = isSupabaseAuthReady();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <AuthBackHome />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Link
            href="/"
            className="mx-auto text-lg font-bold tracking-tight text-foreground hover:opacity-80 flex items-center gap-1"
          >
            <span>AuraCareer</span>
            <span className="text-xs text-primary font-mono px-1 py-0.5 rounded bg-primary/10">AI</span>
          </Link>
          <CardTitle className="text-2xl">Join AuraCareer AI</CardTitle>
          <CardDescription>
            Enter your email to receive your secure sign-in code and kickstart your autonomous career search.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {configured ? (
            <>
              <MagicLinkForm next="/profile?onboarding=1" />
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wide text-muted-foreground">
                  <span className="bg-card px-2">or</span>
                </div>
              </div>
              <GoogleSignInButton next="/profile?onboarding=1" />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
               Signup needs Supabase URL and anon key configured.
            </p>
          )}

          <div className="space-y-1 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">What you get with AuraCareer AI</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Real-time automated portal scanning across top corporate and ATS boards</li>
              <li>Precision tailored resumes and personalized outreach dossiers</li>
              <li>Daily curated interview queues with 100% candidate sovereignty</li>
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center text-xs text-muted-foreground">
            Evaluating or testing without creating accounts?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Use 1-Click Demo Login
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already hunting?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
