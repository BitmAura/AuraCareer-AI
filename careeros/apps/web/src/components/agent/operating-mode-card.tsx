"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OperatingMode } from "@/lib/agent/knowledge-base.types";
import { KnowledgeBaseService } from "@/lib/agent/knowledge-base-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, CheckCircle2, SlidersHorizontal, Settings2 } from "lucide-react";

export function OperatingModeCard({ appliedCount = 0 }: { appliedCount?: number }) {
  const [mode, setMode] = useState<OperatingMode>("approval");
  const [dailyCap, setDailyCap] = useState<number>(20);

  useEffect(() => {
    const kbService = KnowledgeBaseService.getInstance();
    const kb = kbService.getKnowledgeBase();
    setMode(kb.operatingMode);
    setDailyCap(kb.limits.maxDailyApplications);
  }, []);

  const handleModeChange = (newMode: OperatingMode) => {
    setMode(newMode);
    const kbService = KnowledgeBaseService.getInstance();
    kbService.setOperatingMode(newMode);
  };

  return (
    <Card className="border-border/60 shadow-sm bg-linear-to-br from-card to-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Autonomous Operating Mode</CardTitle>
              <CardDescription className="text-xs">
                Sovereign Candidate Governance (Human-in-the-Loop Invariant)
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" render={<Link href="/agent/settings" />}>
            <Settings2 className="h-3.5 w-3.5" />
            Configure Rules
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted/60 rounded-lg">
          <button
            type="button"
            onClick={() => handleModeChange("approval")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-md text-xs font-medium transition-all ${
              mode === "approval"
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span>Approval Mode</span>
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">1-Click Confirm (Default)</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("autonomous")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-md text-xs font-medium transition-all ${
              mode === "autonomous"
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Autonomous</span>
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Auto-Submit (Capped)</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("assisted")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-md text-xs font-medium transition-all ${
              mode === "assisted"
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
              <span>Assisted Mode</span>
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Packets for Manual Apply</span>
          </button>
        </div>

        {/* Status explanation & daily quota */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-xs">
          <div className="text-muted-foreground leading-snug">
            {mode === "approval" && (
              <span>
                <strong className="text-foreground">Approval Mode active:</strong> Agent researches JDs, tailors LaTeX
                resumes, and prepares screening answers. Applications are submitted only when you click Confirm.
              </span>
            )}
            {mode === "autonomous" && (
              <span>
                <strong className="text-amber-500">Autonomous Mode active:</strong> Agent automatically applies and
                outreaches to high-match opportunities (≥75% ATS match) within your daily cap.
              </span>
            )}
            {mode === "assisted" && (
              <span>
                <strong className="text-blue-500">Assisted Mode active:</strong> Agent generates tailored Overleaf
                LaTeX packets and outreach scripts for you to apply manually.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap bg-background/80 px-3 py-1.5 rounded-md border border-border/40">
            <span className="text-[11px] text-muted-foreground">Daily Quota:</span>
            <span className="text-xs font-semibold text-foreground">
              {appliedCount} / {dailyCap} applied
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
