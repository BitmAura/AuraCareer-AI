/**
 * Closed-Loop Self-Learning & Continuous Improvement Engine (Pillar 3)
 * Analyzes historical application & outreach conversion to continuously
 * optimize future resumes, email subject lines, and targeting without hallucinating.
 */

import { SupportedPortal } from "../agent/knowledge-base.types";

export interface ResumeVariantPerformance {
  variantId: string;
  formatName: string; // e.g. "Overleaf ATS LaTeX (Single-Column)" vs "Standard Markdown"
  applicationsSent: number;
  interviewsReceived: number;
  rejectionsReceived: number;
  conversionRatePercent: number;
}

export interface EmailHookPerformance {
  hookType: "metrics_first" | "problem_solver" | "mutual_stack" | "direct_brief";
  subjectLinePattern: string;
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  interviewCount: number;
  replyRatePercent: number;
}

export interface PortalYieldMetric {
  portal: SupportedPortal;
  discoveredCount: number;
  appliedCount: number;
  repliedCount: number;
  interviewCount: number;
  conversionRatePercent: number;
  status: "high_yield" | "average" | "low_yield";
}

export interface RecurringQuestionPattern {
  questionKey: string;
  normalizedQuestion: string;
  frequency: number;
  suggestedAnswer: string;
  isCommittedToKnowledgeBase: boolean;
}

export interface SelfLearningReport {
  totalHistoricalApplications: number;
  totalOutreachSent: number;
  overallInterviewRatePercent: number;
  bestResumeVariant: ResumeVariantPerformance;
  resumePerformance: ResumeVariantPerformance[];
  emailHookPerformance: EmailHookPerformance[];
  portalYields: PortalYieldMetric[];
  recurringQuestions: RecurringQuestionPattern[];
  automatedTuningRecommendations: string[];
}

export const SAMPLE_LEARNING_REPORT: SelfLearningReport = {
  totalHistoricalApplications: 48,
  totalOutreachSent: 34,
  overallInterviewRatePercent: 18.7,
  bestResumeVariant: {
    variantId: "var-latex-ats",
    formatName: "Overleaf ATS LaTeX (Single-Column)",
    applicationsSent: 28,
    interviewsReceived: 7,
    rejectionsReceived: 3,
    conversionRatePercent: 25.0,
  },
  resumePerformance: [
    {
      variantId: "var-latex-ats",
      formatName: "Overleaf ATS LaTeX (Single-Column)",
      applicationsSent: 28,
      interviewsReceived: 7,
      rejectionsReceived: 3,
      conversionRatePercent: 25.0,
    },
    {
      variantId: "var-markdown-basic",
      formatName: "Standard Markdown Resume",
      applicationsSent: 20,
      interviewsReceived: 2,
      rejectionsReceived: 8,
      conversionRatePercent: 10.0,
    },
  ],
  emailHookPerformance: [
    {
      hookType: "metrics_first",
      subjectLinePattern: "Regarding [Role] at [Company] — [Candidate] (Scaled to [Metric])",
      sentCount: 16,
      openedCount: 14,
      repliedCount: 6,
      interviewCount: 4,
      replyRatePercent: 37.5,
    },
    {
      hookType: "direct_brief",
      subjectLinePattern: "Regarding [Role] at [Company] — [Candidate]",
      sentCount: 12,
      openedCount: 9,
      repliedCount: 3,
      interviewCount: 1,
      replyRatePercent: 25.0,
    },
    {
      hookType: "problem_solver",
      subjectLinePattern: "Quick thought on [Target Team] architecture / [Candidate]",
      sentCount: 6,
      openedCount: 5,
      repliedCount: 1,
      interviewCount: 0,
      replyRatePercent: 16.7,
    },
  ],
  portalYields: [
    {
      portal: "direct_ats",
      discoveredCount: 22,
      appliedCount: 18,
      repliedCount: 7,
      interviewCount: 5,
      conversionRatePercent: 27.8,
      status: "high_yield",
    },
    {
      portal: "cutshort",
      discoveredCount: 15,
      appliedCount: 12,
      repliedCount: 4,
      interviewCount: 2,
      conversionRatePercent: 16.7,
      status: "high_yield",
    },
    {
      portal: "naukri",
      discoveredCount: 30,
      appliedCount: 10,
      repliedCount: 2,
      interviewCount: 1,
      conversionRatePercent: 10.0,
      status: "average",
    },
    {
      portal: "linkedin",
      discoveredCount: 45,
      appliedCount: 8,
      repliedCount: 1,
      interviewCount: 0,
      conversionRatePercent: 0.0,
      status: "low_yield",
    },
  ],
  recurringQuestions: [
    {
      questionKey: "notice_period",
      normalizedQuestion: "What is your official notice period?",
      frequency: 14,
      suggestedAnswer: "30 Days (Negotiable for immediate buyout)",
      isCommittedToKnowledgeBase: true,
    },
    {
      questionKey: "current_ctc",
      normalizedQuestion: "What is your current fixed and variable CTC breakdown?",
      frequency: 11,
      suggestedAnswer: "Competitive with current market standards (Confidential)",
      isCommittedToKnowledgeBase: true,
    },
    {
      questionKey: "experience_kubernetes",
      normalizedQuestion: "How many years of experience do you have with container orchestration (Docker/Kubernetes)?",
      frequency: 5,
      suggestedAnswer: "4+ years deploying and managing containerized services in AWS EKS.",
      isCommittedToKnowledgeBase: false,
    },
  ],
  automatedTuningRecommendations: [
    "Overleaf ATS LaTeX resumes generate 2.5x higher interview conversions than plain Markdown. System has set LaTeX as default format for all applications.",
    "Direct ATS (Greenhouse/Workday) yields 27.8% conversion vs LinkedIn Easy Apply (0.0%). Prioritizing Direct ATS links across daily discovery queue.",
    "Metric-first cold email subject lines improved recruiter reply rate from 25% to 37.5%.",
  ],
};

/**
 * Computes recommendation tuning updates from historical data.
 */
export function generateSelfLearningInsights(report: SelfLearningReport = SAMPLE_LEARNING_REPORT): string[] {
  const recommendations: string[] = [];

  // Resume format comparison
  const sortedResumes = [...report.resumePerformance].sort(
    (a, b) => b.conversionRatePercent - a.conversionRatePercent
  );
  if (sortedResumes.length >= 2 && sortedResumes[0].conversionRatePercent > sortedResumes[1].conversionRatePercent) {
    recommendations.push(
      `${sortedResumes[0].formatName} outperforms alternative formats with a ${sortedResumes[0].conversionRatePercent}% interview rate. Enforcing as primary synthesizer format.`
    );
  }

  // Portal yield tuning
  const highYieldPortals = report.portalYields.filter((p) => p.status === "high_yield").map((p) => p.portal);
  if (highYieldPortals.length > 0) {
    recommendations.push(
      `Portals [${highYieldPortals.join(", ")}] have the highest response velocity. Allocating 70% of daily quota to these platforms.`
    );
  }

  // Knowledge base expansion candidates
  const uncommitted = report.recurringQuestions.filter((q) => !q.isCommittedToKnowledgeBase && q.frequency >= 3);
  if (uncommitted.length > 0) {
    recommendations.push(
      `${uncommitted.length} recurring question(s) (e.g. '${uncommitted[0].normalizedQuestion}') appeared frequently. Recommended for addition to Candidate Knowledge Base.`
    );
  }

  return recommendations;
}
