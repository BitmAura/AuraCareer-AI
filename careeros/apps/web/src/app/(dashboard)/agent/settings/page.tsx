"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { KnowledgeBaseService } from "@/lib/agent/knowledge-base-store";
import {
  CandidateKnowledgeBase,
  OperatingMode,
  SupportedPortal,
  VerifiedFact,
} from "@/lib/agent/knowledge-base.types";
import {
  Shield,
  Zap,
  SlidersHorizontal,
  Globe,
  Database,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function AgentSettingsPage() {
  const [kb, setKb] = useState<CandidateKnowledgeBase | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newFactKey, setNewFactKey] = useState("");
  const [newFactQuestion, setNewFactQuestion] = useState("");
  const [newFactAnswer, setNewFactAnswer] = useState("");

  useEffect(() => {
    const service = KnowledgeBaseService.getInstance();
    setKb(service.getKnowledgeBase());
  }, []);

  if (!kb) return null;

  const handleModeChange = (mode: OperatingMode) => {
    const service = KnowledgeBaseService.getInstance();
    service.setOperatingMode(mode);
    setKb(service.getKnowledgeBase());
    toast.success(`Switched operating mode to ${mode.toUpperCase()}`);
  };

  const handleTogglePortal = (portal: SupportedPortal) => {
    const current = kb.portalPermissions[portal];
    const service = KnowledgeBaseService.getInstance();
    service.updatePortalPermission(portal, { enabled: !current.enabled });
    setKb(service.getKnowledgeBase());
  };

  const handleUpdateLimit = (field: keyof CandidateKnowledgeBase["limits"], val: number) => {
    const service = KnowledgeBaseService.getInstance();
    service.updateLimits({ [field]: val });
    setKb(service.getKnowledgeBase());
  };

  const handleAddTitle = () => {
    if (!newTitle.trim()) return;
    if (kb.preferences.targetTitles.length >= 3) {
      toast.error("Maximum 3 target titles allowed.");
      return;
    }
    const service = KnowledgeBaseService.getInstance();
    service.updatePreferences({
      targetTitles: [...kb.preferences.targetTitles, newTitle.trim()],
    });
    setKb(service.getKnowledgeBase());
    setNewTitle("");
    toast.success("Target title added.");
  };

  const handleRemoveTitle = (title: string) => {
    const service = KnowledgeBaseService.getInstance();
    service.updatePreferences({
      targetTitles: kb.preferences.targetTitles.filter((t) => t !== title),
    });
    setKb(service.getKnowledgeBase());
  };

  const handleAddFact = () => {
    if (!newFactKey.trim() || !newFactAnswer.trim()) {
      toast.error("Please enter a question key and verified answer.");
      return;
    }
    const service = KnowledgeBaseService.getInstance();
    service.addOrUpdateFact({
      category: "custom",
      questionKey: newFactKey.trim(),
      questionText: newFactQuestion.trim() || newFactKey.trim(),
      verifiedAnswer: newFactAnswer.trim(),
      isSensitive: false,
    });
    setKb(service.getKnowledgeBase());
    setNewFactKey("");
    setNewFactQuestion("");
    setNewFactAnswer("");
    toast.success("Verified knowledge base fact saved.");
  };

  const handleRemoveFact = (id: string) => {
    const service = KnowledgeBaseService.getInstance();
    service.removeFact(id);
    setKb(service.getKnowledgeBase());
    toast.success("Fact removed.");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Autonomous Agent Governance & Settings"
        description="Configure operating modes, portal access permissions, application caps, and verified knowledge base facts."
      />

      {/* 1. Operating Mode Selection */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Sovereign Operating Mode</CardTitle>
          </div>
          <CardDescription>
            Choose how much autonomy you grant the agent. You can switch modes at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => handleModeChange("approval")}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              kb.operatingMode === "approval"
                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                : "border-border/60 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Approval Mode</span>
              {kb.operatingMode === "approval" && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent researches jobs, tailors LaTeX resumes, and prepares outreach drafts. Holds them in queue until you 1-click confirm.
            </p>
            <Badge variant="outline" className="mt-3 text-[10px]">
              Recommended Default
            </Badge>
          </div>

          <div
            onClick={() => handleModeChange("autonomous")}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              kb.operatingMode === "autonomous"
                ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500 shadow-sm"
                : "border-border/60 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Fully Autonomous</span>
              {kb.operatingMode === "autonomous" && <Zap className="h-4 w-4 text-amber-500" />}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent autonomously submits applications and sends verified cold emails within your configured daily rate limits.
            </p>
            <Badge variant="outline" className="mt-3 text-[10px] text-amber-500 border-amber-500/30">
              High Velocity
            </Badge>
          </div>

          <div
            onClick={() => handleModeChange("assisted")}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              kb.operatingMode === "assisted"
                ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500 shadow-sm"
                : "border-border/60 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Assisted Mode</span>
              {kb.operatingMode === "assisted" && <SlidersHorizontal className="h-4 w-4 text-blue-500" />}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent prepares tailored Overleaf LaTeX packets and outreach scripts. You perform all submissions manually.
            </p>
            <Badge variant="outline" className="mt-3 text-[10px] text-blue-500 border-blue-500/30">
              Zero Auto-Actions
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 2. Target Preferences & Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Target Roles (Max 3)</CardTitle>
            <CardDescription className="text-xs">
              Agent will search and match jobs strictly against these target titles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {kb.preferences.targetTitles.map((title) => (
                <Badge key={title} variant="secondary" className="text-xs py-1 px-2.5 gap-1.5">
                  {title}
                  <button type="button" onClick={() => handleRemoveTitle(title)} className="hover:text-destructive">
                    ×
                  </button>
                </Badge>
              ))}
            </div>

            {kb.preferences.targetTitles.length < 3 && (
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="e.g. Staff Backend Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 text-xs"
                />
                <Button size="sm" className="h-9 px-3 text-xs" onClick={handleAddTitle}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Application Limits & Thresholds</CardTitle>
            <CardDescription className="text-xs">
              Hard constraints to prevent portal account flagging and rate limiting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <Label className="text-xs text-muted-foreground">Max Daily Applications</Label>
                <Input
                  type="number"
                  value={kb.limits.maxDailyApplications}
                  onChange={(e) => handleUpdateLimit("maxDailyApplications", Number(e.target.value))}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max Daily Cold Emails</Label>
                <Input
                  type="number"
                  value={kb.limits.maxDailyOutreach}
                  onChange={(e) => handleUpdateLimit("maxDailyOutreach", Number(e.target.value))}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Min Match Score (%)</Label>
                <Input
                  type="number"
                  value={kb.limits.minMatchScoreThreshold}
                  onChange={(e) => handleUpdateLimit("minMatchScoreThreshold", Number(e.target.value))}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Notice Period (Days)</Label>
                <Input
                  type="number"
                  value={kb.preferences.noticePeriodDays}
                  onChange={(e) => {
                    const service = KnowledgeBaseService.getInstance();
                    service.updatePreferences({ noticePeriodDays: Number(e.target.value) });
                    setKb(service.getKnowledgeBase());
                  }}
                  className="h-8 mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Global Job Portal Network (Active by Default) */}
      <Card className="border-border/60 bg-muted/20">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Global Job Portals &amp; Verified ATS Boards Active</p>
              <p className="text-[11px] text-muted-foreground">
                Multi-domain scrapers actively poll Greenhouse, Lever, Ashby, LinkedIn, and direct employer portals by default.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 w-fit">
            All 12+ Networks Enabled
          </Badge>
        </CardContent>
      </Card>

      {/* 4. Candidate Knowledge Base */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Candidate Knowledge Base (Fact Preservation)</CardTitle>
                <CardDescription className="text-xs">
                  Verified facts used by the agent to answer screening questions without hallucination.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {kb.verifiedFacts.map((fact) => (
              <div
                key={fact.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{fact.questionText}</span>
                    {fact.isSensitive && (
                      <Badge variant="secondary" className="text-[9px] bg-amber-500/10 text-amber-600">
                        Sensitive (Requires Confirm)
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground font-mono text-[11px]">{fact.verifiedAnswer}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveFact(fact.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add new fact */}
          <div className="p-3 rounded-lg border border-dashed border-border/70 space-y-2.5 bg-muted/10">
            <span className="text-xs font-semibold block">Add Verified Answer to Knowledge Base</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                placeholder="Question key (e.g. years_in_python)"
                value={newFactKey}
                onChange={(e) => setNewFactKey(e.target.value)}
                className="h-8 text-xs"
              />
              <Input
                placeholder="Question text (e.g. How many years have you used Python?)"
                value={newFactQuestion}
                onChange={(e) => setNewFactQuestion(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Verified factual answer (e.g. 6+ years in production backend environments)"
                value={newFactAnswer}
                onChange={(e) => setNewFactAnswer(e.target.value)}
                className="h-8 text-xs"
              />
              <Button size="sm" className="h-8 px-3 text-xs gap-1.5" onClick={handleAddFact}>
                <Plus className="h-3.5 w-3.5" /> Save Fact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
