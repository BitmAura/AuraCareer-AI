/**
 * Real-Time Agent Activity & Audit Trail Types
 * Powers the live timeline and observability ledger (USAF Layer 7).
 */

export type ActivityEventType =
  | "JOB_DISCOVERED"
  | "JOB_ANALYZED"
  | "RESUME_TAILORED"
  | "APPLICATION_SUBMITTED"
  | "APPROVAL_REQUESTED"
  | "RECRUITER_FOUND"
  | "COLD_EMAIL_SENT"
  | "REPLY_RECEIVED"
  | "INTERVIEW_SCHEDULED"
  | "REJECTION_LOGGED"
  | "LEARNING_LOOP_UPDATED";

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: ActivityEventType;
  title: string;
  description: string;
  badgeText: string;
  badgeVariant: "default" | "success" | "warning" | "destructive" | "purple" | "blue";
  metadata?: {
    company?: string;
    roleTitle?: string;
    portal?: string;
    score?: number;
    recruiterName?: string;
    sentiment?: string;
    applyUrl?: string;
    overleafUrl?: string;
  };
  actionLabel?: string;
  actionUrl?: string;
}

export const SAMPLE_ACTIVITY_FEED: ActivityEvent[] = [
  {
    id: "act-1",
    timestamp: "Just now",
    type: "REPLY_RECEIVED",
    title: "Interview Invitation Received",
    description: "Recruiter Ananya Iyer at Razorpay proposed an intro screen and shared a calendar booking link.",
    badgeText: "Interview Screen",
    badgeVariant: "success",
    metadata: {
      company: "Razorpay",
      roleTitle: "Staff Backend Engineer",
      sentiment: "interview_opportunity",
    },
    actionLabel: "View Booking Link",
    actionUrl: "/outreach",
  },
  {
    id: "act-2",
    timestamp: "18 minutes ago",
    type: "COLD_EMAIL_SENT",
    title: "Personalized Outreach Delivered",
    description: "Delivered human-grade cold email referencing payment scale metrics and attached ATS LaTeX resume.",
    badgeText: "Outreach Sent",
    badgeVariant: "blue",
    metadata: {
      company: "Razorpay",
      recruiterName: "Ananya Iyer",
    },
  },
  {
    id: "act-3",
    timestamp: "32 minutes ago",
    type: "APPLICATION_SUBMITTED",
    title: "Application Submitted via Direct ATS",
    description: "Submitted application on Greenhouse. Answered 4 screening questions via Candidate Knowledge Base.",
    badgeText: "Submitted",
    badgeVariant: "success",
    metadata: {
      company: "Swiggy",
      roleTitle: "Senior Full Stack Engineer",
      portal: "direct_ats",
      score: 94,
    },
    actionLabel: "View Application Snapshot",
    actionUrl: "/applications",
  },
  {
    id: "act-4",
    timestamp: "45 minutes ago",
    type: "RESUME_TAILORED",
    title: "LaTeX Resume Synthesized (Overleaf Ready)",
    description: "Customized technical keywords for Next.js, Node.js, and Postgres without fabricating facts. Compiled single-column ATS format.",
    badgeText: "LaTeX Compiled",
    badgeVariant: "purple",
    metadata: {
      company: "Swiggy",
      roleTitle: "Senior Full Stack Engineer",
    },
    actionLabel: "Open in Overleaf",
    actionUrl: "/resume",
  },
  {
    id: "act-5",
    timestamp: "1 hour ago",
    type: "JOB_ANALYZED",
    title: "JD Match Score: 94% Alignment",
    description: "Exceeded 85% mathematical threshold across technical stack, tenure, and location requirements.",
    badgeText: "94% Match",
    badgeVariant: "default",
    metadata: {
      company: "Swiggy",
      score: 94,
    },
  },
  {
    id: "act-6",
    timestamp: "1 hour ago",
    type: "JOB_DISCOVERED",
    title: "Opportunity Discovered via Greenhouse",
    description: "Direct company career portal feed returned new senior engineering opening in Bengaluru.",
    badgeText: "Discovered",
    badgeVariant: "blue",
    metadata: {
      company: "Swiggy",
      portal: "direct_ats",
    },
  },
  {
    id: "act-7",
    timestamp: "3 hours ago",
    type: "LEARNING_LOOP_UPDATED",
    title: "Closed-Loop Learning Optimization",
    description: "Updated keyword density model: 'Distributed Systems' and 'Event-Driven Architecture' yielded a 3.4x higher recruiter reply rate.",
    badgeText: "Model Tuned",
    badgeVariant: "warning",
  },
];
