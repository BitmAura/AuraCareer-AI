/**
 * OpenOutreach Contact Enrichment & Verification Engine
 * Incorporated from p:\crazy-ai-stack\08-saas-enterprise-apps\OpenOutreach
 *
 * Provides recruiter contact pattern generation, company domain validation,
 * seniority tiering, and sender reputation throttling.
 */

import { RecruiterContact, RecruiterSeniority } from "./outreach.types";

export interface DomainEnrichmentResult {
  companyDomain: string;
  isCustomDomain: boolean;
  corporateParent?: string;
  predictedEmailPatterns: string[];
}

/**
 * Normalizes company names to primary web domains.
 */
export function resolveCompanyDomain(companyName: string): string {
  const sanitized = companyName
    .toLowerCase()
    .replace(/\b(inc|corp|ltd|llc|technologies|solutions|labs|pvt|co)\b\.?/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();

  return `${sanitized || "company"}.com`;
}

/**
 * Predicts corporate work email patterns based on recruiter name and company domain.
 * Employs OpenOutreach heuristics.
 */
export function generateProbableEmailPatterns(
  fullName: string,
  companyDomain: string
): string[] {
  const parts = fullName.toLowerCase().trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return [`talent@${companyDomain}`];

  const first = parts[0].replace(/[^a-z0-9]/g, "");
  const last = parts.length > 1 ? parts[parts.length - 1].replace(/[^a-z0-9]/g, "") : "";

  const patterns: string[] = [];

  if (first && last) {
    patterns.push(`${first}.${last}@${companyDomain}`);     // arjun.mehta@company.com
    patterns.push(`${first}@${companyDomain}`);              // arjun@company.com
    patterns.push(`${first[0]}${last}@${companyDomain}`);    // amehta@company.com
    patterns.push(`${first}_${last}@${companyDomain}`);     // arjun_mehta@company.com
  } else {
    patterns.push(`${first}@${companyDomain}`);
  }

  return patterns;
}

/**
 * Classifies recruiter seniority from job title string.
 */
export function classifyRecruiterSeniority(title: string): RecruiterSeniority {
  const t = title.toLowerCase();

  if (/\b(head|director|vp|vice president|chief|founder|co-founder)\b/i.test(t)) {
    return "department_head";
  }
  if (/\b(lead|principal|staff|senior lead|talent partner)\b/i.test(t)) {
    return "lead_recruiter";
  }
  if (/\b(sourcer|sourcing)\b/i.test(t)) {
    return "sourcer";
  }

  return "recruiter";
}

/**
 * Creates an enriched RecruiterContact object from raw discovery inputs.
 */
export function enrichRecruiterContact(
  fullName: string,
  roleTitle: string,
  companyName: string,
  providedEmail?: string,
  linkedinUrl?: string
): RecruiterContact {
  const domain = resolveCompanyDomain(companyName);
  const patterns = generateProbableEmailPatterns(fullName, domain);
  const verifiedEmail = providedEmail || patterns[0];

  return {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fullName,
    roleTitle,
    seniority: classifyRecruiterSeniority(roleTitle),
    company: companyName,
    companyDomain: domain,
    email: verifiedEmail,
    emailStatus: providedEmail ? "verified" : "probable",
    linkedinUrl,
  };
}

/**
 * Sender Reputation Throttling Rules (OpenOutreach Standard)
 * Protects candidate email deliverability.
 */
export const OUTREACH_THROTTLE_LIMITS = {
  maxEmailsPerDayNewAccount: 15,
  maxEmailsPerDayWarmedAccount: 45,
  minJitterBetweenSendsSeconds: 180, // 3 minutes randomized spacing
  maxActiveThreadsPerDomain: 2,      // Avoid emailing more than 2 people at the same company simultaneously
};
