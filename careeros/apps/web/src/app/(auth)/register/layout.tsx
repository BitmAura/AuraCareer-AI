import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Create account",
  description: "Start AuraCareer AI free: resume + ATS-style score, multi-portal discovery, and recruiter outreach.",
  path: "/register",
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
