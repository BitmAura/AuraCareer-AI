"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  SAMPLE_LEARNING_REPORT,
  SelfLearningReport,
  generateSelfLearningInsights,
} from "@/lib/learning/learning-engine";
import { KnowledgeBaseService } from "@/lib/agent/knowledge-base-store";
import {
  TrendingUp,
  FileCode,
  Mail,
  Globe,
  Database,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Plus,
  BarChart3,
  Bot,
} from "lucide-react";
import { toast } from "sonner";

export default function SelfLearningAnalyticsPage() {
  const { data: applications = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: () => api<any[]>("/applications"),
  });
  const [showBenchmark, setShowBenchmark] = useState<boolean>(false);

  const [report, setReport] = useState<SelfLearningReport>(SAMPLE_LEARNING_REPORT);
  const insights = generateSelfLearningInsights(report);

  const handleCommitQuestion = (key: string, question: string, answer: string) => {
    const kb = KnowledgeBaseService.getInstance();
    kb.addOrUpdateFact({
      category: "custom",
      questionKey: key,
      questionText: question,
      verifiedAnswer: answer,
      isSensitive: false,
    });

    setReport((prev) => ({
      ...prev,
      recurringQuestions: prev.recurringQuestions.map((q) =>
        q.questionKey === key ? { ...q, isCommittedToKnowledgeBase: true } : q
      ),
    }));

    toast.success(`Committed '${question}' to Candidate Knowledge Base!`);
  };

  const hasRealData = applications.length > 0;
  const isDisplaying = hasRealData || showBenchmark;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Continuous Self-Learning & AGI Optimization"
        description="Autonomous reinforcement loop analyzing conversion across resume formats, email subject lines, portal yields, and recurring screening questions."
        action={
          !isDisplaying ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-9"
              onClick={() => setShowBenchmark(true)}
            >
              <Bot className="h-4 w-4 text-purple-500" />
              Preview Benchmark Model
            </Button>
          ) : !hasRealData ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9"
              onClick={() => setShowBenchmark(false)}
            >
              Hide Benchmark
            </Button>
          ) : null
        }
      />

      {!isDisplaying ? (
        <Card className="border-dashed border-border/70 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Awaiting Application Pipeline Data</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-5 leading-relaxed">
            The self-learning reinforcement loop automatically tunes your pitch style, compares single-column LaTeX ATS vs standard markdown yield, and measures portal reply rates as you apply. Currently 0 applications logged.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button size="sm" className="gap-1.5 text-xs bg-primary hover:bg-primary/90" render={<Link href="/queue" />}>
              <Sparkles className="h-3.5 w-3.5" />
              Start Daily Job Hunt Loop
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setShowBenchmark(true)}
            >
              <Bot className="h-3.5 w-3.5 text-purple-500" />
              Preview Benchmark Intelligence Model
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Benchmark Banner if using simulated baseline */}
          {!hasRealData && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>
                  <strong>Benchmark Baseline Model Active:</strong> Displaying calibrated cross-candidate conversion metrics (LaTeX ATS vs Markdown yield, email hooks, portal response curves). Real personal data will dynamically take over once you log applications.
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-600 dark:text-amber-400" onClick={() => setShowBenchmark(false)}>
                Dismiss
              </Button>
            </div>
          )}

          {/* Autonomous Strategy Recommendations Banner */}
          <Card className="border-primary/30 bg-linear-to-r from-primary/5 via-purple-500/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <CardTitle className="text-base font-semibold">Active Agent Strategy Tuning</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Model parameters dynamically tuned from historical recruiter responses and interview conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs">
                {insights.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

      {/* Grid: 1. Resume A/B Performance, 2. Email Subject Line Yields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume Format A/B Yield */}
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-base">Resume Format A/B Performance</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Historical Conversion
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Interview conversion rate by synthesized resume layout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.resumePerformance.map((variant) => (
              <div
                key={variant.variantId}
                className="p-3.5 rounded-lg border border-border/50 bg-muted/20 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{variant.formatName}</span>
                  <Badge
                    variant={variant.conversionRatePercent >= 20 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {variant.conversionRatePercent}% Interview Rate
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span>{variant.applicationsSent} applications</span>
                  <span className="text-emerald-500 font-medium">{variant.interviewsReceived} interviews</span>
                  <span className="text-destructive">{variant.rejectionsReceived} rejections</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cold Email Subject Line & Hook Testing */}
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base">Cold Email Subject Line A/B Testing</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Recruiter Engagement
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Which subject lines and opening hooks generate the highest reply rate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.emailHookPerformance.map((hook) => (
              <div key={hook.hookType} className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize text-foreground">
                    {hook.hookType.replace("_", " ")} Hook
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    {hook.replyRatePercent}% Reply Rate
                  </Badge>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground truncate">{hook.subjectLinePattern}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span>{hook.sentCount} sent</span>
                  <span>{hook.openedCount} opened</span>
                  <span className="text-foreground font-medium">{hook.repliedCount} replies</span>
                  <span className="text-emerald-500 font-semibold">{hook.interviewCount} interviews</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Portal Yields & Allocation Matrix */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Job Portal Yield Matrix</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Response Efficiency
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Response and interview yields across monitored platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {report.portalYields.map((portal) => (
              <div
                key={portal.portal}
                className="p-3.5 rounded-lg border border-border/50 bg-card space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider">{portal.portal}</span>
                  <Badge
                    variant={portal.status === "high_yield" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {portal.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="space-y-1 text-muted-foreground text-[11px]">
                  <div className="flex justify-between">
                    <span>Applied:</span>
                    <span className="font-medium text-foreground">{portal.appliedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Replies:</span>
                    <span className="font-medium text-foreground">{portal.repliedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interviews:</span>
                    <span className="font-semibold text-emerald-500">{portal.interviewCount}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-border/40 font-semibold">
                    <span>Conversion:</span>
                    <span className="text-foreground">{portal.conversionRatePercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recurring Question Learner & Knowledge Base Expansion */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Recurring Screening Questions (Knowledge Base Learner)</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Continuous Self-Learning
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Application questions that frequently appear across portals. Verified answers are safely reused for future autofill.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.recurringQuestions.map((q) => (
            <div
              key={q.questionKey}
              className="p-3 rounded-lg border border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{q.normalizedQuestion}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    Appeared {q.frequency} times
                  </Badge>
                </div>
                <p className="text-muted-foreground font-mono text-[11px]">{q.suggestedAnswer}</p>
              </div>

              <div>
                {q.isCommittedToKnowledgeBase ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified in KB
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => handleCommitQuestion(q.questionKey, q.normalizedQuestion, q.suggestedAnswer)}
                  >
                    <Plus className="h-3.5 w-3.5" /> Commit to Knowledge Base
                  </Button>
                )}
              </div>
            </div>
          ))}
          </CardContent>
        </Card>
      </>
      )}
    </div>
  );
}
