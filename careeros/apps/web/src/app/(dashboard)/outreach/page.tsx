"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ColdEmailDraft } from "@/lib/outreach/outreach.types";
import { generateColdEmailCampaign } from "@/lib/outreach/cold-email-generator";
import { analyzeRecruiterResponse, SentimentAnalysisResult } from "@/lib/outreach/sentiment-analyzer";
import {
  Mail,
  Send,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Users,
  TrendingUp,
  Sparkles,
  Plus,
  Bot,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const SAMPLE_OUTREACH_CAMPAIGNS: ColdEmailDraft[] = [
  {
    id: "outreach-1",
    candidateName: "Arjun Mehta",
    recruiter: {
      id: "rec-1",
      fullName: "Ananya Iyer",
      roleTitle: "Lead Talent Acquisition Partner",
      seniority: "lead_recruiter",
      company: "Razorpay",
      companyDomain: "razorpay.com",
      email: "ananya.iyer@razorpay.com",
      emailStatus: "verified",
      linkedinUrl: "https://linkedin.com/in/ananyaiyer",
    },
    targetRoleTitle: "Staff Backend Engineer",
    subject: "Regarding Staff Backend Engineer role at Razorpay — Arjun Mehta",
    body: "Hi Ananya,\n\nI noticed Razorpay is scaling its core checkout payments infrastructure, and given my background in high-throughput transactional systems, I wanted to reach out directly.\n\nOver the past 6+ years, a couple of relevant initiatives I have led:\n• Scaled payment processing engine to handle 45,000 requests/sec with 99.99% uptime.\n• Architected distributed Kafka event streaming pipeline reducing transaction settlement latency by 42%.\n\nI have attached my tailored ATS resume for your review. Would you be open to a quick 10-minute conversation this week?\n\nBest regards,\nArjun Mehta\n+91 9876543210",
    latexResumeAttached: true,
    status: "replied",
    sentAt: "Yesterday at 11:30 AM",
    repliedAt: "Today at 09:15 AM",
    sentiment: "interview_opportunity",
    sentimentReason: "Recruiter requested a 30-min intro screen and shared a Calendly link.",
    followUpCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "outreach-2",
    candidateName: "Arjun Mehta",
    recruiter: {
      id: "rec-2",
      fullName: "Rohan Varma",
      roleTitle: "Engineering Director - Consumer Tech",
      seniority: "department_head",
      company: "Swiggy",
      companyDomain: "swiggy.com",
      email: "rohan.varma@swiggy.com",
      emailStatus: "verified",
      linkedinUrl: "https://linkedin.com/in/rohanvarma",
    },
    targetRoleTitle: "Principal Systems Architect",
    subject: "Regarding Principal Systems Architect role at Swiggy — Arjun Mehta",
    body: "Hi Rohan,\n\nI saw Swiggy's recent architectural shift to event-driven logistics routing. Reaching out with my background in distributed systems.\n\nKey highlights:\n• Reduced p99 delivery dispatch calculation latency by 35% through micro-sharding.\n• Migrated monolith core to Go/gRPC services with zero downtime.\n\nAttached is my tailored ATS resume.\n\nBest,\nArjun Mehta",
    latexResumeAttached: true,
    status: "sent",
    sentAt: "2 days ago",
    followUpCount: 0,
    nextFollowUpDue: "Tomorrow (Follow-up #1 scheduled)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "outreach-3",
    candidateName: "Arjun Mehta",
    recruiter: {
      id: "rec-3",
      fullName: "Kavita Rao",
      roleTitle: "Senior Tech Recruiter",
      seniority: "recruiter",
      company: "CRED",
      companyDomain: "cred.club",
      email: "kavita.rao@cred.club",
      emailStatus: "verified",
    },
    targetRoleTitle: "Senior Backend Engineer",
    subject: "Regarding Senior Backend Engineer role at CRED — Arjun Mehta",
    body: "Hi Kavita,\n\nReaching out regarding backend scale at CRED. Over the last 5 years, I have architected low-latency microservices handling millions of financial events daily.\n\nTailored ATS resume attached.\n\nBest,\nArjun",
    latexResumeAttached: true,
    status: "queued_for_approval",
    followUpCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function OutreachPage() {
  const [campaigns, setCampaigns] = useState<ColdEmailDraft[]>(SAMPLE_OUTREACH_CAMPAIGNS);
  const [tab, setTab] = useState<"all" | "interview" | "queued">("all");

  // New Outreach Composer State
  const [showComposer, setShowComposer] = useState(false);
  const [recruiterName, setRecruiterName] = useState("Priya Sharma");
  const [recruiterEmail, setRecruiterEmail] = useState("priya.sharma@stripe.com");
  const [companyName, setCompanyName] = useState("Stripe");
  const [roleTitle, setRoleTitle] = useState("Staff Software Engineer - Infrastructure");
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Recruiter Reply Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedReplyText, setSimulatedReplyText] = useState(
    "Hi Arjun,\n\nThanks for your note! Your background scaling high-throughput payment architectures is very relevant to our core payments team. We would love to chat with you.\n\nPlease pick a time on my calendar here for a 30-minute intro screen: https://calendly.com/priya-stripe/intro-screen\n\nLooking forward to speaking,\nPriya"
  );
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysisResult | null>(null);

  const handleGeneratePitch = () => {
    const mockResume = {
      fullName: "Arjun Mehta",
      email: "arjun.mehta@example.com",
      phone: "+91 9876543210",
      location: "Bengaluru, India",
      summary: "Lead Systems Architect with 6+ years scaling distributed systems and cloud infrastructure.",
      skills: [{ category: "Core", items: ["Distributed Systems", "PostgreSQL", "Kafka", "Go", "TypeScript"] }],
      experience: [
        {
          roleTitle: "Lead Systems Architect",
          company: "Enterprise FinTech",
          location: "Bengaluru",
          startDate: "2021",
          endDate: "Present",
          highlights: [
            "Architected high-throughput ledger processing 50,000 tx/sec with 99.99% availability.",
            "Reduced AWS cloud infrastructure spend by 38% via Kubernetes auto-scaling optimizations.",
          ],
        },
      ],
      education: [
        {
          degree: "B.Tech in Computer Science",
          institution: "NIT Trichy",
          location: "India",
          year: "2019",
        },
      ],
    };

    const campaign = generateColdEmailCampaign({
      recruiter: {
        id: `rec-${Date.now()}`,
        fullName: recruiterName,
        email: recruiterEmail,
        roleTitle: "Lead Talent Partner",
        seniority: "lead_recruiter",
        company: companyName,
        companyDomain: `${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
        emailStatus: "verified",
      },
      targetRoleTitle: roleTitle,
      candidateResume: mockResume,
      senderName: "Arjun Mehta",
      senderEmail: "arjun.mehta@example.com",
    });

    setDraftSubject(campaign.initialDraft.subject);
    setDraftBody(campaign.initialDraft.body);
    toast.success("Human-grade Problem-Proof-Proposal cold email generated!");
  };

  const handleSendOutreach = async () => {
    if (!draftSubject || !draftBody) {
      toast.error("Please generate or compose the email subject and body first.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterEmail,
          recruiterName,
          companyName,
          roleTitle,
          subject: draftSubject,
          body: draftBody,
          candidateName: "Arjun Mehta",
          candidateEmail: "arjun.mehta@example.com",
          overleafUrl: "https://www.overleaf.com/docs?snip_uri=data:application/x-tex;base64,XA==",
          latexResumeAttached: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");

      const newCampaign: ColdEmailDraft = {
        id: data.messageId || `outreach-${Date.now()}`,
        candidateName: "Arjun Mehta",
        recruiter: {
          id: `rec-${Date.now()}`,
          fullName: recruiterName,
          roleTitle: "Talent Partner",
          seniority: "recruiter",
          company: companyName,
          companyDomain: `${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
          email: recruiterEmail,
          emailStatus: "verified",
        },
        targetRoleTitle: roleTitle,
        subject: draftSubject,
        body: draftBody,
        latexResumeAttached: true,
        status: "sent",
        sentAt: "Just now",
        followUpCount: 0,
        nextFollowUpDue: "3 days from now (Follow-up #1 scheduled)",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCampaigns((prev) => [newCampaign, ...prev]);
      setShowComposer(false);
      toast.success(data.message || "Cold email dispatched to HR!");
    } catch (err: any) {
      toast.error(err.message || "Error sending email");
    } finally {
      setIsSending(false);
    }
  };

  const handleApproveAndSend = async (id: string) => {
    const target = campaigns.find((c) => c.id === id);
    if (!target) return;

    try {
      await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterEmail: target.recruiter.email,
          recruiterName: target.recruiter.fullName,
          companyName: target.recruiter.company,
          roleTitle: target.targetRoleTitle,
          subject: target.subject,
          body: target.body,
          candidateName: target.candidateName,
          latexResumeAttached: true,
        }),
      });

      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "sent" as const, sentAt: "Just now" } : c))
      );
      toast.success(`Outreach to ${target.recruiter.fullName} (${target.recruiter.company}) sent with ATS LaTeX resume!`);
    } catch (e: any) {
      toast.error(e.message || "Failed to approve and send");
    }
  };

  const handleRunSimulator = async () => {
    try {
      const res = await fetch("/api/outreach/simulate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText: simulatedReplyText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAnalysisResult(data.analysis);
      toast.success(`Classified response as: ${data.analysis.sentiment.toUpperCase()}`);
    } catch (e: any) {
      toast.error(e.message || "Simulation error");
    }
  };

  const filtered = campaigns.filter((c) => {
    if (tab === "interview") return c.sentiment === "interview_opportunity";
    if (tab === "queued") return c.status === "queued_for_approval";
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiter Discovery & Cold Email Outreach"
        description="Automated HR contact discovery, personalized human-grade cold emails, response sentiment tracking, and automated follow-ups."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-9"
              onClick={() => setShowSimulator(!showSimulator)}
            >
              <Bot className="h-4 w-4 text-purple-500" />
              {showSimulator ? "Hide Response Tester" : "Test HR Reply Analyzer"}
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-xs h-9 bg-primary hover:bg-primary/90"
              onClick={() => {
                setShowComposer(true);
                if (!draftSubject) handleGeneratePitch();
              }}
            >
              <Plus className="h-4 w-4" />
              Compose HR Outreach
            </Button>
          </div>
        }
      />

      {/* Recruiter Reply Simulator Panel */}
      {showSimulator && (
        <Card className="border-purple-500/40 bg-purple-950/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-base font-semibold">Inbound Recruiter Response & Sentiment Simulator</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/30">
                Closed-Loop Learning
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Test how the agent parses incoming recruiter replies, detects calendar booking links, and updates application state.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] h-7"
                onClick={() => {
                  setSimulatedReplyText(
                    "Hi Arjun,\n\nWe loved your profile and experience scaling payment infrastructure. Let's set up a 30-min call this week.\n\nPlease pick a slot on my Calendly: https://calendly.com/priya-stripe/intro-screen"
                  );
                }}
              >
                Preset 1: Interview + Calendly
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] h-7"
                onClick={() => {
                  setSimulatedReplyText(
                    "Hi Arjun,\n\nCould you share your current CTC, expected CTC, and official notice period? We would like to process your profile."
                  );
                }}
              >
                Preset 2: Screening Questions
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] h-7"
                onClick={() => {
                  setSimulatedReplyText(
                    "Hi Arjun,\n\nThank you for reaching out. We have currently frozen hiring for this specific team, but will keep your resume for future openings."
                  );
                }}
              >
                Preset 3: Polite Rejection
              </Button>
            </div>

            <Textarea
              rows={4}
              value={simulatedReplyText}
              onChange={(e) => setSimulatedReplyText(e.target.value)}
              placeholder="Paste or type an incoming recruiter email to test analysis..."
              className="text-xs font-mono"
            />

            <div className="flex items-center justify-between">
              <Button size="sm" className="gap-1 text-xs" onClick={handleRunSimulator}>
                <Sparkles className="h-3.5 w-3.5" /> Analyze Inbound Reply
              </Button>

              {analysisResult && (
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs capitalize ${
                      analysisResult.sentiment === "interview_opportunity"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : analysisResult.sentiment === "action_required"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {analysisResult.sentiment.replace("_", " ")} ({Math.round(analysisResult.confidence * 100)}%)
                  </Badge>
                  {analysisResult.bookingLink && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 gap-1"
                      onClick={() => window.open(analysisResult.bookingLink!, "_blank")}
                    >
                      <Calendar className="h-3 w-3" /> Book Interview <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Outreach Composer Modal / Card */}
      {showComposer && (
        <Card className="border-primary/50 bg-card shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Compose & Dispatch HR Cold Outreach
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowComposer(false)}>
                Cancel
              </Button>
            </div>
            <CardDescription className="text-xs">
              Uses the Problem-Proof-Proposal architecture to craft high-conversion, non-templated cold emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Recruiter Full Name</label>
                <Input
                  size={1}
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="text-xs h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Recruiter Email Address</label>
                <Input
                  size={1}
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="e.g. priya.sharma@company.com"
                  className="text-xs h-8 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Company Name</label>
                <Input
                  size={1}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe"
                  className="text-xs h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Target Role Title</label>
                <Input
                  size={1}
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Staff Software Engineer"
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5" onClick={handleGeneratePitch}>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Regenerate Problem-Proof-Proposal Pitch
              </Button>
              <span className="text-[11px] text-muted-foreground">Attached: Single-column ATS LaTeX Resume</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email Subject Line</label>
                <Input
                  value={draftSubject}
                  onChange={(e) => setDraftSubject(e.target.value)}
                  className="text-xs h-8 font-medium"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email Body (Concise, verified metrics)</label>
                <Textarea
                  rows={6}
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  className="text-xs font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => {
                  const mailto = `mailto:${encodeURIComponent(recruiterEmail)}?subject=${encodeURIComponent(
                    draftSubject
                  )}&body=${encodeURIComponent(draftBody)}`;
                  window.open(mailto, "_blank");
                }}
              >
                Open in Email Client (Mailto)
              </Button>
              <Button
                size="sm"
                className="text-xs h-8 gap-1.5 bg-primary hover:bg-primary/90"
                disabled={isSending}
                onClick={handleSendOutreach}
              >
                <Send className="h-3.5 w-3.5" />
                {isSending ? "Dispatching..." : "Send Cold Email to HR"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">HR Contacts Found</p>
              <p className="text-xl font-bold">48</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cold Emails Sent</p>
              <p className="text-xl font-bold">{campaigns.filter((c) => c.status === "sent" || c.status === "replied").length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Responses Received</p>
              <p className="text-xl font-bold">9 <span className="text-xs text-emerald-500 font-normal">(31% reply)</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Interviews Secured</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60 pb-2">
        <Button
          variant={tab === "all" ? "default" : "ghost"}
          size="sm"
          className="text-xs h-8"
          onClick={() => setTab("all")}
        >
          All Outreach ({campaigns.length})
        </Button>
        <Button
          variant={tab === "interview" ? "default" : "ghost"}
          size="sm"
          className="text-xs h-8 gap-1.5"
          onClick={() => setTab("interview")}
        >
          <Calendar className="h-3.5 w-3.5 text-emerald-500" />
          Interview Invites ({campaigns.filter((c) => c.sentiment === "interview_opportunity").length})
        </Button>
        <Button
          variant={tab === "queued" ? "default" : "ghost"}
          size="sm"
          className="text-xs h-8 gap-1.5"
          onClick={() => setTab("queued")}
        >
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          Pending Approval ({campaigns.filter((c) => c.status === "queued_for_approval").length})
        </Button>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="border-border/60 transition-colors hover:border-border">
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-bold text-sm text-primary">
                    {item.recruiter.company[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{item.recruiter.fullName}</span>
                      <span className="text-xs text-muted-foreground">({item.recruiter.roleTitle})</span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.recruiter.company}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{item.recruiter.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.sentiment === "interview_opportunity" && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs gap-1">
                      <Calendar className="h-3 w-3" /> Interview Opportunity
                    </Badge>
                  )}
                  {item.status === "queued_for_approval" && (
                    <Badge variant="secondary" className="text-xs text-amber-500 bg-amber-500/10">
                      Action Required: Review & Send
                    </Badge>
                  )}
                  {item.status === "sent" && (
                    <Badge variant="secondary" className="text-xs">
                      Sent {item.sentAt}
                    </Badge>
                  )}
                  {item.status === "replied" && (
                    <Badge variant="secondary" className="text-xs text-emerald-500 bg-emerald-500/10">
                      Replied {item.repliedAt}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Subject & snippet */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border/40 space-y-1 text-xs">
                <span className="font-medium text-foreground block">Subject: {item.subject}</span>
                <p className="text-muted-foreground line-clamp-2">{item.body}</p>
              </div>

              {/* Sentiment Alert or Follow-up banner */}
              {item.sentimentReason && (
                <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    ⚡ {item.sentimentReason}
                  </span>
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                    onClick={() => window.open("https://calendly.com", "_blank")}
                  >
                    Open Calendar Link <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {item.nextFollowUpDue && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>Next autonomous action: {item.nextFollowUpDue}</span>
                </div>
              )}

              {item.status === "queued_for_approval" && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    className="text-xs h-8 gap-1.5 bg-primary hover:bg-primary/90"
                    onClick={() => handleApproveAndSend(item.id)}
                  >
                    <Send className="h-3.5 w-3.5" /> Confirm & Send Email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
