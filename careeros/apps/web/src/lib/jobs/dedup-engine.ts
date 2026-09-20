import { SupportedPortal } from "../agent/knowledge-base.types";

export interface NormalizedJobListing {
  id: string;
  company: string;
  normalizedCompany: string;
  title: string;
  normalizedTitle: string;
  location: string;
  portal: SupportedPortal;
  applyUrl: string;
  isDirectAts: boolean;
  description: string;
  semanticSignature: string;
  discoveredAt: string;
}

export interface ApplicationHistoryRecord {
  id: string;
  signature: string;
  company: string;
  title: string;
  appliedPortal: SupportedPortal;
  applyUrl: string;
  appliedAt: string;
  resumeVersion: string;
  status: "submitted" | "in_review" | "interview" | "rejected" | "offer";
  answersSnapshot: Record<string, string>;
}

/**
 * Normalizes company name for entity resolution.
 * Strips common corporate suffixes (Inc, LLC, Pvt Ltd, Technologies, Solutions, etc.)
 */
export function normalizeCompanyName(company: string): string {
  if (!company) return "";
  return company
    .toLowerCase()
    .replace(/\b(pvt|ltd|private|limited|inc|corp|corporation|llc|technologies|technology|tech|solutions|services|group|co)\b/gi, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes job title for deduplication.
 * Resolves standard equivalences (Sr -> Senior, SDE -> Software Engineer, etc.)
 */
export function normalizeJobTitle(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/\b(sr\.?|sr|senior)\b/gi, "senior")
    .replace(/\b(jr\.?|jr|junior)\b/gi, "junior")
    .replace(/\b(sde\s*ii|sde\s*2|software engineer\s*ii)\b/gi, "software engineer 2")
    .replace(/\b(sde\s*i|sde\s*1|software engineer\s*i)\b/gi, "software engineer 1")
    .replace(/\b(lead|tech lead)\b/gi, "lead")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Computes a semantic signature for cross-portal deduplication.
 * Invariant 3: Same company + normalized title + key JD fingerprint = duplicate.
 */
export function computeJobSignature(company: string, title: string, description?: string): string {
  const normCompany = normalizeCompanyName(company);
  const normTitle = normalizeJobTitle(title);

  // Take first 100 significant characters from description if available
  const snippet = (description || "")
    .toLowerCase()
    .replace(/[^\w]/g, "")
    .slice(0, 100);

  return `${normCompany}::${normTitle}::${snippet}`;
}

/**
 * Cross-Portal Deduplication Service
 * Enforces Invariant 3: Never apply to the same job opening twice across portals.
 */
export class JobDeduplicationEngine {
  private appliedSignatures: Map<string, ApplicationHistoryRecord> = new Map();

  constructor(initialHistory: ApplicationHistoryRecord[] = []) {
    for (const record of initialHistory) {
      this.appliedSignatures.set(record.signature, record);
    }
  }

  /**
   * Checks if a job has already been applied to on any portal.
   */
  public hasAlreadyApplied(company: string, title: string, description?: string): {
    isDuplicate: boolean;
    existingRecord: ApplicationHistoryRecord | null;
  } {
    const signature = computeJobSignature(company, title, description);
    const existing = this.appliedSignatures.get(signature) || null;

    if (existing) {
      return { isDuplicate: true, existingRecord: existing };
    }

    // Fallback: Check if same company + normalized title exists even if description varies slightly
    const normCompany = normalizeCompanyName(company);
    const normTitle = normalizeJobTitle(title);

    for (const record of this.appliedSignatures.values()) {
      if (
        normalizeCompanyName(record.company) === normCompany &&
        normalizeJobTitle(record.title) === normTitle
      ) {
        return { isDuplicate: true, existingRecord: record };
      }
    }

    return { isDuplicate: false, existingRecord: null };
  }

  /**
   * Records a new application in the deduplication ledger.
   */
  public recordApplication(record: ApplicationHistoryRecord): void {
    this.appliedSignatures.set(record.signature, record);
  }

  /**
   * Prioritizes between multiple listings of the same job across portals.
   * Direct ATS (Workday, Greenhouse, Lever) is always preferred over aggregator portals.
   */
  public deduplicateJobListings(listings: NormalizedJobListing[]): NormalizedJobListing[] {
    const grouped = new Map<string, NormalizedJobListing[]>();

    for (const listing of listings) {
      const sig = `${listing.normalizedCompany}::${listing.normalizedTitle}`;
      const group = grouped.get(sig) || [];
      group.push(listing);
      grouped.set(sig, group);
    }

    const deduplicated: NormalizedJobListing[] = [];

    for (const group of grouped.values()) {
      if (group.length === 1) {
        deduplicated.push(group[0]);
        continue;
      }

      // Sort by direct ATS first, then preferred portal
      const sorted = [...group].sort((a, b) => {
        if (a.isDirectAts && !b.isDirectAts) return -1;
        if (!a.isDirectAts && b.isDirectAts) return 1;
        return 0;
      });

      deduplicated.push(sorted[0]);
    }

    return deduplicated;
  }
}
