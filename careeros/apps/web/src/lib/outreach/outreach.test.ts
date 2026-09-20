import { describe, it, expect } from "vitest";
import { generateColdEmailCampaign } from "./cold-email-generator";
import { analyzeRecruiterResponse } from "./sentiment-analyzer";
import { RecruiterContact } from "./outreach.types";
import { LatexResumeData } from "../resume/latex-templates";

describe("Recruiter Cold Email & Sentiment Classifier Engine", () => {
  const sampleRecruiter: RecruiterContact = {
    id: "rec-1",
    fullName: "Ananya Iyer",
    roleTitle: "Lead Talent Acquisition Partner",
    seniority: "lead_recruiter",
    company: "Razorpay",
    companyDomain: "razorpay.com",
    email: "ananya.iyer@razorpay.com",
    emailStatus: "verified",
  };

  const sampleResume: LatexResumeData = {
    fullName: "Arjun Mehta",
    email: "arjun@example.com",
    phone: "+91 9988776655",
    location: "Bengaluru",
    summary: "Senior Backend Architect with 8 years experience building high-scale FinTech infrastructure.",
    skills: [
      {
        category: "Backend",
        items: ["Node.js", "Go", "PostgreSQL", "Kafka"],
      },
    ],
    experience: [
      {
        roleTitle: "Lead Engineer",
        company: "PayCraft",
        location: "Bengaluru",
        startDate: "2021",
        endDate: "Present",
        highlights: [
          "Scaled payment processing throughput by 300% handling 2.5M daily transactions.",
          "Reduced database query latency by 45% through read-replica sharding.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Tech",
        institution: "IIT Madras",
        location: "Chennai",
        year: "2017",
      },
    ],
  };

  it("generates a personalized, human-like cold email draft with metrics", () => {
    const campaign = generateColdEmailCampaign({
      recruiter: sampleRecruiter,
      targetRoleTitle: "Staff Backend Engineer",
      candidateResume: sampleResume,
      senderName: "Arjun Mehta",
      senderEmail: "arjun@example.com",
    });

    expect(campaign.initialDraft.subject).toContain("Staff Backend Engineer");
    expect(campaign.initialDraft.subject).toContain("Razorpay");
    expect(campaign.initialDraft.body).toContain("Hi Ananya");
    expect(campaign.initialDraft.body).toContain("Scaled payment processing throughput by 300%");
    expect(campaign.initialDraft.latexResumeAttached).toBe(true);

    // Follow-ups generated
    expect(campaign.followUp1.scheduledAfterDays).toBe(3);
    expect(campaign.followUp2.scheduledAfterDays).toBe(7);
  });

  describe("Sentiment Analyzer", () => {
    it("classifies interview requests with high confidence", () => {
      const email = "Hi Arjun, thanks for reaching out. Your background is impressive. Would you be free for a 30-min introductory call next Tuesday? You can pick a slot directly on my calendar: https://calendly.com/ananya-razorpay/intro";
      const result = analyzeRecruiterResponse(email);

      expect(result.sentiment).toBe("interview_opportunity");
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
      expect(result.suggestedAction).toBe("alert_candidate_interview");
      expect(result.bookingLink).toContain("https://calendly.com/ananya-razorpay/intro");
    });

    it("classifies rejections accurately", () => {
      const email = "Dear Arjun, thank you for your interest in Razorpay. While your profile has strong merits, we have decided to move forward with other candidates whose experience more closely matches our immediate needs.";
      const result = analyzeRecruiterResponse(email);

      expect(result.sentiment).toBe("rejection");
      expect(result.suggestedAction).toBe("log_rejection");
    });

    it("identifies action-required requests for CTC and notice period", () => {
      const email = "Hi Arjun, we liked your profile. Could you please share your current CTC, expected CTC, and official notice period before we proceed with the technical round?";
      const result = analyzeRecruiterResponse(email);

      expect(result.sentiment).toBe("action_required");
      expect(result.suggestedAction).toBe("provide_info");
    });

    it("handles unsubscribe / negative responses", () => {
      const email = "Please remove me from your mailing list and do not contact me again.";
      const result = analyzeRecruiterResponse(email);

      expect(result.sentiment).toBe("negative");
      expect(result.suggestedAction).toBe("close_thread");
    });
  });
});
