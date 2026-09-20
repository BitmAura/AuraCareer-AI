import { describe, it, expect } from "vitest";
import {
  resolveCompanyDomain,
  generateProbableEmailPatterns,
  classifyRecruiterSeniority,
  enrichRecruiterContact,
} from "./openoutreach-enricher";

describe("OpenOutreach Enricher", () => {
  it("resolves clean company domains from legal names", () => {
    expect(resolveCompanyDomain("Razorpay Inc.")).toBe("razorpay.com");
    expect(resolveCompanyDomain("Swiggy Technologies Pvt Ltd")).toBe("swiggy.com");
    expect(resolveCompanyDomain("Stripe, LLC")).toBe("stripe.com");
  });

  it("generates probable work email patterns", () => {
    const patterns = generateProbableEmailPatterns("Priya Sharma", "stripe.com");
    expect(patterns).toContain("priya.sharma@stripe.com");
    expect(patterns).toContain("priya@stripe.com");
    expect(patterns).toContain("psharma@stripe.com");
  });

  it("classifies recruiter seniority correctly", () => {
    expect(classifyRecruiterSeniority("VP of Talent Acquisition")).toBe("department_head");
    expect(classifyRecruiterSeniority("Director of Engineering")).toBe("department_head");
    expect(classifyRecruiterSeniority("Lead Technical Recruiter")).toBe("lead_recruiter");
    expect(classifyRecruiterSeniority("Talent Sourcer")).toBe("sourcer");
    expect(classifyRecruiterSeniority("Recruiting Specialist")).toBe("recruiter");
  });

  it("enriches contact with verified attributes", () => {
    const contact = enrichRecruiterContact(
      "Ananya Iyer",
      "Lead Talent Partner",
      "Razorpay",
      "ananya.iyer@razorpay.com",
      "https://linkedin.com/in/ananyaiyer"
    );

    expect(contact.fullName).toBe("Ananya Iyer");
    expect(contact.companyDomain).toBe("razorpay.com");
    expect(contact.email).toBe("ananya.iyer@razorpay.com");
    expect(contact.emailStatus).toBe("verified");
    expect(contact.seniority).toBe("lead_recruiter");
  });
});
