import { describe, it, expect } from "vitest";
import {
  generateSelfLearningInsights,
  SAMPLE_LEARNING_REPORT,
} from "./learning-engine";

describe("Closed-Loop Self-Learning & Reinforcement Engine (Pillar 3)", () => {
  it("generates automated strategy tuning recommendations from historical performance", () => {
    const recommendations = generateSelfLearningInsights(SAMPLE_LEARNING_REPORT);
    expect(recommendations.length).toBeGreaterThanOrEqual(2);

    // Verifies resume format optimization recommendation
    expect(recommendations.some((r) => r.includes("Overleaf ATS LaTeX"))).toBe(true);

    // Verifies portal yield tuning recommendation
    expect(recommendations.some((r) => r.includes("direct_ats"))).toBe(true);
  });

  it("identifies high-frequency uncommitted questions for addition to knowledge base", () => {
    const recommendations = generateSelfLearningInsights(SAMPLE_LEARNING_REPORT);
    expect(recommendations.some((r) => r.includes("recurring question"))).toBe(true);
  });
});
