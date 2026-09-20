"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PRODUCT_STANCE } from "@/lib/product/stance";
import { Sparkles, FileText, Mail, MessageSquare, Handshake, ListChecks, FileCode, Users, Shield } from "lucide-react";

const aiTools = [
  {
    title: "Overleaf & LaTeX ATS Synthesizer",
    description: "Compile-ready, single-column ATS LaTeX resume generation with 1-click Overleaf cloud import and JD keyword alignment.",
    icon: FileCode,
    href: "/resume",
    cta: "Synthesize LaTeX Resume",
  },
  {
    title: "Recruiter Cold Email & Sentiment AI",
    description: "Autonomous HR discovery, Problem-Proof-Proposal cold pitch generation, and incoming reply sentiment analysis with calendar detection.",
    icon: Mail,
    href: "/outreach",
    cta: "Launch Outreach Hub",
  },
  {
    title: "Multi-Domain Autonomous Job Hunter",
    description: "Real-time scraper polling Greenhouse, Lever, Ashby, and global ATS boards across Tech, Healthcare, Finance, and Marketing.",
    icon: Sparkles,
    href: "/queue",
    cta: "Open Daily Queue",
  },
  {
    title: "Closed-Loop Self-Learning AGI",
    description: "Continuous reinforcement engine analyzing historical conversion rates across resume formats, email subject lines, and recurring questions.",
    icon: Shield,
    href: "/analytics/learning",
    cta: "View Learning Analytics",
  },
];

export default function AiToolsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Tools"
        description={`${PRODUCT_STANCE.brandName} — ${PRODUCT_STANCE.brandTagline}. Resume recreate, portal job hunt, packets, and win-kit drafts (LLM when keyed).`}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {aiTools.map((tool) => (
          <Card key={tool.title} className="transition-colors hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" render={<Link href={tool.href} />}>
                {tool.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
