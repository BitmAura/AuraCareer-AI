/**
 * Candidate Knowledge Base & Operational Governance Types
 * Defines preferences, operating modes, portal permissions, and verified screening Q&A.
 */

export type OperatingMode = "autonomous" | "approval" | "assisted";

export type WorkModePreference = "remote" | "hybrid" | "onsite" | "any";

export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "director" | "executive";

export interface TargetPreferences {
  /** Up to 3 target job titles (e.g., 'Senior Software Engineer', 'Engineering Manager') */
  targetTitles: string[];
  /** Preferred locations (e.g., ['Bengaluru', 'Pune', 'Remote']) */
  preferredLocations: string[];
  /** Experience level classification */
  experienceLevel: ExperienceLevel;
  /** Total years of professional experience */
  totalExperienceYears: number;
  /** Minimum acceptable CTC (in INR LPA or USD) */
  minCtcLpa: number;
  /** Target / Ideal CTC (in INR LPA or USD) */
  targetCtcLpa: number;
  /** Work mode preferences */
  workModes: WorkModePreference[];
  /** Notice period in days (e.g. 15, 30, 60, 90, 0 for immediate) */
  noticePeriodDays: number;
  /** Willingness to relocate */
  willingToRelocate: boolean;
  /** Visa / Work authorization countries (e.g. ['India', 'USA', 'EU']) */
  workAuthorization: string[];
}

export type SupportedPortal =
  | "linkedin"
  | "naukri"
  | "indeed"
  | "glassdoor"
  | "foundit"
  | "wellfound"
  | "internshala"
  | "cutshort"
  | "instahyre"
  | "hirist"
  | "shine"
  | "timesjobs"
  | "direct_ats"; // Workday, Greenhouse, Lever, Ashby, etc.

export interface PortalPermissionConfig {
  portal: SupportedPortal;
  enabled: boolean;
  dailyCap: number;
  autoApplyAllowed: boolean;
}

export interface ApplicationLimits {
  /** Hard maximum applications allowed across all portals per day */
  maxDailyApplications: number;
  /** Maximum cold email outreach messages per day */
  maxDailyOutreach: number;
  /** Minimum ATS match score (0-100) required before queuing/applying */
  minMatchScoreThreshold: number;
}

export interface VerifiedFact {
  id: string;
  category: "personal" | "employment" | "education" | "compensation" | "legal" | "custom";
  questionKey: string;
  questionText: string;
  verifiedAnswer: string;
  lastConfirmedAt: string;
  isSensitive: boolean;
}

export interface CandidateKnowledgeBase {
  id: string;
  userId: string;
  masterResumeText: string;
  preferences: TargetPreferences;
  operatingMode: OperatingMode;
  portalPermissions: Record<SupportedPortal, PortalPermissionConfig>;
  limits: ApplicationLimits;
  verifiedFacts: VerifiedFact[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PORTAL_PERMISSIONS: Record<SupportedPortal, PortalPermissionConfig> = {
  linkedin: { portal: "linkedin", enabled: true, dailyCap: 10, autoApplyAllowed: false },
  naukri: { portal: "naukri", enabled: true, dailyCap: 15, autoApplyAllowed: true },
  indeed: { portal: "indeed", enabled: true, dailyCap: 10, autoApplyAllowed: true },
  glassdoor: { portal: "glassdoor", enabled: true, dailyCap: 5, autoApplyAllowed: false },
  foundit: { portal: "foundit", enabled: true, dailyCap: 8, autoApplyAllowed: true },
  wellfound: { portal: "wellfound", enabled: true, dailyCap: 8, autoApplyAllowed: true },
  internshala: { portal: "internshala", enabled: false, dailyCap: 5, autoApplyAllowed: false },
  cutshort: { portal: "cutshort", enabled: true, dailyCap: 10, autoApplyAllowed: true },
  instahyre: { portal: "instahyre", enabled: true, dailyCap: 10, autoApplyAllowed: true },
  hirist: { portal: "hirist", enabled: true, dailyCap: 10, autoApplyAllowed: true },
  shine: { portal: "shine", enabled: false, dailyCap: 5, autoApplyAllowed: false },
  timesjobs: { portal: "timesjobs", enabled: false, dailyCap: 5, autoApplyAllowed: false },
  direct_ats: { portal: "direct_ats", enabled: true, dailyCap: 20, autoApplyAllowed: true },
};

export const DEFAULT_KNOWLEDGE_BASE: CandidateKnowledgeBase = {
  id: "default-kb",
  userId: "default-user",
  masterResumeText: "",
  preferences: {
    targetTitles: ["Senior Full Stack Engineer", "Staff Software Architect", "AI Engineering Lead"],
    preferredLocations: ["Bengaluru", "Pune", "Hyderabad", "Remote"],
    experienceLevel: "senior",
    totalExperienceYears: 6,
    minCtcLpa: 28,
    targetCtcLpa: 42,
    workModes: ["remote", "hybrid"],
    noticePeriodDays: 30,
    willingToRelocate: false,
    workAuthorization: ["India"],
  },
  operatingMode: "approval", // Default is Sovereign Candidate Governance (1-click confirm)
  portalPermissions: DEFAULT_PORTAL_PERMISSIONS,
  limits: {
    maxDailyApplications: 20,
    maxDailyOutreach: 15,
    minMatchScoreThreshold: 75,
  },
  verifiedFacts: [
    {
      id: "fact-1",
      category: "compensation",
      questionKey: "current_ctc",
      questionText: "What is your current CTC?",
      verifiedAnswer: "Confidential / Competitive with current market standards",
      lastConfirmedAt: new Date().toISOString(),
      isSensitive: true,
    },
    {
      id: "fact-2",
      category: "compensation",
      questionKey: "expected_ctc",
      questionText: "What is your expected CTC?",
      verifiedAnswer: "Open to discussion based on role seniority and total compensation package",
      lastConfirmedAt: new Date().toISOString(),
      isSensitive: true,
    },
    {
      id: "fact-3",
      category: "employment",
      questionKey: "notice_period",
      questionText: "What is your official notice period?",
      verifiedAnswer: "30 Days (Negotiable for immediate/early buyout)",
      lastConfirmedAt: new Date().toISOString(),
      isSensitive: false,
    },
    {
      id: "fact-4",
      category: "legal",
      questionKey: "work_authorization",
      questionText: "Are you legally authorized to work in India?",
      verifiedAnswer: "Yes, citizen of India with full legal work authorization",
      lastConfirmedAt: new Date().toISOString(),
      isSensitive: false,
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
