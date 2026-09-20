import { describe, it, expect, beforeEach } from "vitest";
import { KnowledgeBaseService } from "./knowledge-base-store";

describe("KnowledgeBaseService & Fact Preservation Engine", () => {
  let kbService: KnowledgeBaseService;

  beforeEach(() => {
    kbService = KnowledgeBaseService.getInstance();
  });

  it("initializes with default sovereign approval mode and portal permissions", () => {
    const kb = kbService.getKnowledgeBase();
    expect(kb.operatingMode).toBe("approval");
    expect(kb.portalPermissions.linkedin.enabled).toBe(true);
    expect(kb.portalPermissions.naukri.enabled).toBe(true);
    expect(kb.limits.maxDailyApplications).toBe(20);
  });

  it("updates operating mode safely", () => {
    kbService.setOperatingMode("autonomous");
    expect(kbService.getKnowledgeBase().operatingMode).toBe("autonomous");

    kbService.setOperatingMode("approval");
    expect(kbService.getKnowledgeBase().operatingMode).toBe("approval");
  });

  it("answers verified questions with high confidence (>90%)", () => {
    const res = kbService.answerQuestion("What is your official notice period?");
    expect(res.answer).toBe("30 Days (Negotiable for immediate/early buyout)");
    expect(res.confidence).toBeGreaterThanOrEqual(0.9);
    expect(res.needsConfirmation).toBe(false);
  });

  it("flags sensitive compensation questions for candidate confirmation", () => {
    const res = kbService.answerQuestion("Can you share your current CTC details?");
    expect(res.confidence).toBeGreaterThanOrEqual(0.8);
    expect(res.needsConfirmation).toBe(true); // Sensitive fact requires confirmation
  });

  it("escalates unverified questions to candidate to prevent hallucination (Zero Hallucination Invariant)", () => {
    const res = kbService.answerQuestion("Do you have 5+ years of experience with Kubernetes cluster security?");
    expect(res.answer).toBeNull();
    expect(res.confidence).toBeLessThan(0.5);
    expect(res.needsConfirmation).toBe(true);
  });

  it("allows candidate to add verified facts dynamically", () => {
    const newFact = kbService.addOrUpdateFact({
      category: "custom",
      questionKey: "remote_work_setup",
      questionText: "Do you have a dedicated home office and high-speed fiber internet?",
      verifiedAnswer: "Yes, dedicated home office with 300 Mbps dual-redundant fiber connection.",
      isSensitive: false,
    });

    const res = kbService.answerQuestion("Do you have a dedicated home office?");
    expect(res.answer).toBe(newFact.verifiedAnswer);
    expect(res.needsConfirmation).toBe(false);
  });
});
