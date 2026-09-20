/**
 * Recruiter Discovery & Cold Email Outreach Types
 * Autonomous candidate outreach, response sentiment analysis, and follow-up loops.
 */

export type RecruiterSeniority = "sourcer" | "recruiter" | "lead_recruiter" | "hiring_manager" | "department_head" | "founder";

export type EmailVerificationStatus = "verified" | "extrapolated" | "probable" | "unverified" | "bounced";

export interface RecruiterContact {
  id: string;
  fullName: string;
  roleTitle: string;
  seniority: RecruiterSeniority;
  company: string;
  companyDomain: string;
  email: string;
  emailStatus: EmailVerificationStatus;
  linkedinUrl?: string;
  location?: string;
  associatedJobId?: string;
}

export type OutreachStatus =
  | "draft"
  | "queued_for_approval"
  | "approved"
  | "sent"
  | "delivered"
  | "opened"
  | "replied"
  | "follow_up_due"
  | "closed";

export type ResponseSentiment =
  | "interview_opportunity"
  | "positive"
  | "action_required"
  | "neutral"
  | "rejection"
  | "negative";

export interface FollowUpConfig {
  maxFollowUps: number; // default 2
  intervalDays: number; // default 3 to 5 business days
  enabled: boolean;
}

export interface ColdEmailDraft {
  id: string;
  candidateName: string;
  recruiter: RecruiterContact;
  targetRoleTitle: string;
  subject: string;
  body: string;
  latexResumeAttached: boolean;
  status: OutreachStatus;
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
  sentiment?: ResponseSentiment;
  sentimentReason?: string;
  followUpCount: number;
  lastFollowUpAt?: string;
  nextFollowUpDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutreachCampaignStats {
  contactsDiscovered: number;
  emailsSent: number;
  emailsOpened: number;
  repliesReceived: number;
  interviewOpportunities: number;
  rejections: number;
  pendingFollowUps: number;
  replyRatePercent: number;
}
