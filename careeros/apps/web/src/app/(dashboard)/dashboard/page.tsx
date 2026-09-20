"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/store/use-auth";
import { PRODUCT_STANCE } from "@/lib/product/stance";
import { api } from "@/lib/api";
import { OperatingModeCard } from "@/components/agent/operating-mode-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { Mail, Sparkles, Send, Calendar, ArrowRight } from "lucide-react";

const buyBar = PRODUCT_STANCE.candidateBuyBar;

type Application = {
  id: string;
  status: string;
  appliedAt: string;
  job?: { company: string; title: string };
};

type ValueStats = {
  packetsPrepared: number;
  confirmedApplies: number;
  interviews: number;
  jobsIWouldHaveMissed: number;
  interviewRate: number | null;
  pilot?: {
    readyToPay: boolean;
    checks: Array<{ id: string; label: string; ok: boolean; value: number }>;
  };
};

type Hunt = {
  ritual: string;
  actions: Array<{ id: string; label: string; href: string; why: string; cta: string }>;
  followUps: Array<{ applicationId: string; company: string; title: string; hint: string }>;
};

type TargetsInfo = { ready?: boolean };

export default function DashboardPage() {
  const user = useAuth((s) => s.user);

  const { data: applications = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: () => api<Application[]>("/applications"),
  });

  const { data: resumes = [] } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => api<{ id: string }[]>("/resume"),
  });

  const { data: value } = useQuery({
    queryKey: ["value-stats"],
    queryFn: () => api<ValueStats>("/value-stats"),
  });

  const { data: targets } = useQuery({
    queryKey: ["profile-targets"],
    queryFn: () => api<TargetsInfo>("/profile/targets"),
  });

  const { data: hunt } = useQuery({
    queryKey: ["hunt-today"],
    queryFn: () => api<Hunt>("/hunt-today"),
  });

  const recent = applications.slice(0, 4);
  const needsOnboarding = !targets?.ready || resumes.length === 0;

  const realEvents: Array<import("@/lib/agent/activity.types").ActivityEvent> = applications.map((app) => ({
    id: app.id,
    timestamp: new Date(app.appliedAt).toLocaleDateString(),
    type: "APPLICATION_SUBMITTED",
    title: `Application: ${app.job?.title || "Target Role"}`,
    description: `Company: ${app.job?.company || "Company"} • Status: ${app.status}`,
    badgeText: app.status,
    badgeVariant: app.status === "interview" ? "success" : app.status === "rejected" ? "destructive" : "blue",
    metadata: {
      company: app.job?.company,
      roleTitle: app.job?.title,
    },
    actionLabel: "View Applications",
    actionUrl: "/applications",
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`Command Center${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Autonomous Job Automation & Recruiter Intelligence Agent • Sovereign Candidate Control"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" render={<Link href="/outreach" />}>
              <Mail className="h-4 w-4 mr-1.5 text-blue-500" />
              Recruiter Outreach
            </Button>
            <Button size="sm" render={<Link href="/queue" />}>
              <Sparkles className="h-4 w-4 mr-1.5" />
              Daily Apply Queue
            </Button>
          </div>
        }
      />

      {/* Onboarding Quick Start Banner for New Users */}
      {needsOnboarding && (
        <Card className="border-primary/40 bg-linear-to-r from-primary/10 via-primary/5 to-background shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-xs font-semibold">Get Started</Badge>
                <h3 className="text-sm sm:text-base font-bold text-foreground">Welcome to AuraCareer AI! Let&apos;s get your agent ready.</h3>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Your autonomous agent is ready on standby. Complete your 2-step setup to activate live job hunting:
              </p>
              <div className="flex flex-wrap gap-3 pt-1 text-xs text-foreground font-medium">
                <span className={targets?.ready ? "text-emerald-600 dark:text-emerald-400 flex items-center gap-1" : "text-amber-600 dark:text-amber-400 flex items-center gap-1"}>
                  {targets?.ready ? "✓" : "○"} 1. Target Role &amp; Location
                </span>
                <span className={resumes.length > 0 ? "text-emerald-600 dark:text-emerald-400 flex items-center gap-1" : "text-amber-600 dark:text-amber-400 flex items-center gap-1"}>
                  {resumes.length > 0 ? "✓" : "○"} 2. Master Resume
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  ○ 3. Start Apply Queue
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              {!targets?.ready ? (
                <Button size="sm" render={<Link href="/profile" />}>
                  Setup Target Profile
                </Button>
              ) : resumes.length === 0 ? (
                <Button size="sm" render={<Link href="/resume" />}>
                  Upload Resume
                </Button>
              ) : (
                <Button size="sm" render={<Link href="/queue" />}>
                  Start Daily Queue
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 1. Autonomous Operating Mode Card */}
      <OperatingModeCard appliedCount={value?.confirmedApplies ?? 0} />

      {/* 2. Key Metrics Bar (Authentic Live Data) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Jobs Discovered", value: value?.jobsIWouldHaveMissed ?? 0, icon: Sparkles, color: "text-blue-500" },
          { label: "LaTeX Packets Prepared", value: value?.packetsPrepared ?? 0, icon: Send, color: "text-purple-500" },
          { label: "Applications Submitted", value: value?.confirmedApplies ?? 0, icon: Send, color: "text-primary" },
          {
            label: "Interview Conversions",
            value:
              value?.interviewRate != null
                ? `${value.interviews} · ${value.interviewRate}%`
                : `${value?.interviews ?? 0} · 0%`,
            icon: Calendar,
            color: "text-emerald-500",
          },
        ].map((t) => (
          <div key={t.label} className="rounded-xl border border-border/60 bg-card p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t.label}</p>
              <p className="text-2xl font-bold tracking-tight tabular-nums mt-0.5">{t.value}</p>
            </div>
            <div className={`p-2 rounded-lg bg-muted/60 ${t.color}`}>
              <t.icon className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Today's Action Focus */}
      <Card className="border-primary/20 bg-linear-to-br from-primary/5 via-background to-card shadow-sm">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-foreground">Today&apos;s High-Yield Action Focus</h3>
          </div>
          <Badge variant="outline" className="text-[11px] font-mono border-primary/30 text-primary">
            {hunt?.ritual ? "Active Routine" : "Automated Loop"}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-3">
          {hunt?.ritual && (
            <p className="text-xs text-muted-foreground font-medium bg-muted/40 p-2.5 rounded-lg border border-border/40">
              💡 <span className="text-foreground">Daily Agent Focus:</span> {hunt.ritual}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(hunt?.actions && hunt.actions.length > 0
              ? hunt.actions
              : [
                  {
                    id: "setup-profile",
                    label: "1. Configure Career Targets",
                    why: targets?.ready ? "Target preferences active." : "Define target titles, preferred locations, and compensation.",
                    href: "/profile",
                    cta: targets?.ready ? "Edit Profile" : "Setup Profile",
                  },
                  {
                    id: "upload-resume",
                    label: "2. Master ATS Resume",
                    why: resumes.length > 0 ? `${resumes.length} master resume(s) uploaded.` : "Upload your resume for AI-tailored Overleaf LaTeX synthesis.",
                    href: "/resume",
                    cta: resumes.length > 0 ? "Manage Resumes" : "Upload Resume",
                  },
                  {
                    id: "start-hunt",
                    label: "3. Run Daily Apply Queue",
                    why: "Discover and queue verified openings from corporate ATS boards.",
                    href: "/queue",
                    cta: "Open Daily Queue",
                  },
                ]
            ).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-lg border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <p className="text-xs font-semibold text-foreground">{act.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{act.why}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs w-full justify-between mt-1 hover:bg-primary hover:text-primary-foreground"
                  render={<Link href={act.href} />}
                >
                  <span>{act.cta}</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Live Agent Activity Stream (Real events or clean Standby State) */}
      <ActivityTimeline events={realEvents} />

      {/* 5. Recent Applications & Next Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="border-border/60 shadow-sm">
          <div className="p-4 border-b border-border/60 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Recent Applications Tracked</h3>
            <Link href="/applications" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No applications submitted yet. Configure your targets and launch the apply queue to begin.
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {recent.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {item.job?.title || "Role"} · {item.job?.company || "Company"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(item.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={item.status === "rejected" ? "rejected" : "pending"}>
                      {item.status}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recruiter & Outreach Radar */}
        <Card className="border-border/60 shadow-sm">
          <div className="p-4 border-b border-border/60 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Recruiter &amp; Outreach Radar</h3>
            <Link href="/outreach" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              Outreach Hub <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="p-4 rounded-lg border border-dashed border-border/70 bg-muted/20 text-center space-y-2">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">No Active Recruiter Threads Yet</p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-0.5 leading-relaxed">
                  Identify key hiring decision-makers and launch personalized cold outreach campaigns in the Outreach Hub.
                </p>
              </div>
              <div className="pt-1">
                <Button size="sm" variant="outline" className="h-7 text-xs" render={<Link href="/outreach" />}>
                  Open Outreach Hub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
