import { describe, it, expect } from "vitest";
import {
  normalizeCompanyName,
  normalizeJobTitle,
  computeJobSignature,
  JobDeduplicationEngine,
  NormalizedJobListing,
} from "./dedup-engine";

describe("Cross-Portal Deduplication Engine (Invariant 3)", () => {
  it("normalizes company names by stripping corporate suffixes and special chars", () => {
    expect(normalizeCompanyName("Swiggy Private Limited")).toBe("swiggy");
    expect(normalizeCompanyName("Razorpay Software Technologies Pvt. Ltd.")).toBe("razorpay software");
    expect(normalizeCompanyName("Google, Inc.")).toBe("google");
    expect(normalizeCompanyName("Tata Motors Co.")).toBe("tata motors");
  });

  it("normalizes job title variations to standard seniority and canonical names", () => {
    expect(normalizeJobTitle("Sr. Software Engineer")).toBe("senior software engineer");
    expect(normalizeJobTitle("SDE II - Backend")).toBe("software engineer 2 backend");
    expect(normalizeJobTitle("Tech Lead - Platform")).toBe("lead platform");
  });

  it("detects cross-portal duplicates and prevents re-applying", () => {
    const engine = new JobDeduplicationEngine([
      {
        id: "app-1",
        signature: computeJobSignature("Swiggy", "Staff Engineer", "Build high scale distributed food delivery systems"),
        company: "Swiggy Pvt Ltd",
        title: "Sr. Staff Engineer",
        appliedPortal: "greenhouse",
        applyUrl: "https://boards.greenhouse.io/swiggy/jobs/123",
        appliedAt: new Date().toISOString(),
        resumeVersion: "v2-ats-latex",
        status: "submitted",
        answersSnapshot: {},
      },
    ]);

    // Same role encountered on LinkedIn
    const check1 = engine.hasAlreadyApplied("Swiggy", "Sr. Staff Engineer");
    expect(check1.isDuplicate).toBe(true);
    expect(check1.existingRecord?.appliedPortal).toBe("greenhouse");

    // Different company
    const check2 = engine.hasAlreadyApplied("Zomato", "Sr. Staff Engineer");
    expect(check2.isDuplicate).toBe(false);
  });

  it("prioritizes direct company ATS listings over third-party aggregator portals", () => {
    const engine = new JobDeduplicationEngine();

    const listings: NormalizedJobListing[] = [
      {
        id: "job-linkedin",
        company: "Atlassian",
        normalizedCompany: "atlassian",
        title: "Senior Backend Engineer",
        normalizedTitle: "senior backend engineer",
        location: "Bengaluru",
        portal: "linkedin",
        applyUrl: "https://linkedin.com/jobs/view/999",
        isDirectAts: false,
        description: "Join our platform team in Bengaluru.",
        semanticSignature: "sig-1",
        discoveredAt: new Date().toISOString(),
      },
      {
        id: "job-greenhouse",
        company: "Atlassian",
        normalizedCompany: "atlassian",
        title: "Senior Backend Engineer",
        normalizedTitle: "senior backend engineer",
        location: "Bengaluru",
        portal: "direct_ats",
        applyUrl: "https://boards.greenhouse.io/atlassian/jobs/888",
        isDirectAts: true,
        description: "Join our platform team in Bengaluru.",
        semanticSignature: "sig-1",
        discoveredAt: new Date().toISOString(),
      },
      {
        id: "job-naukri",
        company: "Atlassian",
        normalizedCompany: "atlassian",
        title: "Senior Backend Engineer",
        normalizedTitle: "senior backend engineer",
        location: "Bengaluru",
        portal: "naukri",
        applyUrl: "https://naukri.com/job-listings/777",
        isDirectAts: false,
        description: "Join our platform team in Bengaluru.",
        semanticSignature: "sig-1",
        discoveredAt: new Date().toISOString(),
      },
    ];

    const deduplicated = engine.deduplicateJobListings(listings);
    expect(deduplicated).toHaveLength(1);
    expect(deduplicated[0].portal).toBe("direct_ats"); // Direct ATS won over LinkedIn and Naukri!
    expect(deduplicated[0].isDirectAts).toBe(true);
  });
});
