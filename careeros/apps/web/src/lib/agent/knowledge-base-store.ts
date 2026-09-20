import {
  CandidateKnowledgeBase,
  DEFAULT_KNOWLEDGE_BASE,
  OperatingMode,
  PortalPermissionConfig,
  SupportedPortal,
  TargetPreferences,
  VerifiedFact,
} from "./knowledge-base.types";

const STORAGE_KEY = "careeros_agent_knowledge_base_v1";

/**
 * Knowledge Base Store & Q&A Evaluation Engine
 * Enforces Invariant 1 (Zero Hallucination) and Invariant 2 (Sovereign Governance).
 */
export class KnowledgeBaseService {
  private static instance: KnowledgeBaseService;
  private state: CandidateKnowledgeBase;

  private constructor() {
    this.state = this.loadFromStorage();
  }

  public static getInstance(): KnowledgeBaseService {
    if (!KnowledgeBaseService.instance) {
      KnowledgeBaseService.instance = new KnowledgeBaseService();
    }
    return KnowledgeBaseService.instance;
  }

  private loadFromStorage(): CandidateKnowledgeBase {
    if (typeof window === "undefined") {
      return DEFAULT_KNOWLEDGE_BASE;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_KNOWLEDGE_BASE;
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_KNOWLEDGE_BASE, ...parsed };
    } catch {
      return DEFAULT_KNOWLEDGE_BASE;
    }
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return;
    try {
      this.state.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save knowledge base to local storage:", e);
    }
  }

  public getKnowledgeBase(): CandidateKnowledgeBase {
    return { ...this.state };
  }

  public setOperatingMode(mode: OperatingMode): void {
    this.state.operatingMode = mode;
    this.saveToStorage();
  }

  public updatePreferences(preferences: Partial<TargetPreferences>): void {
    this.state.preferences = {
      ...this.state.preferences,
      ...preferences,
    };
    this.saveToStorage();
  }

  public updatePortalPermission(portal: SupportedPortal, config: Partial<PortalPermissionConfig>): void {
    if (!this.state.portalPermissions[portal]) return;
    this.state.portalPermissions[portal] = {
      ...this.state.portalPermissions[portal],
      ...config,
    };
    this.saveToStorage();
  }

  public updateLimits(limits: Partial<CandidateKnowledgeBase["limits"]>): void {
    this.state.limits = {
      ...this.state.limits,
      ...limits,
    };
    this.saveToStorage();
  }

  public addOrUpdateFact(fact: Omit<VerifiedFact, "id" | "lastConfirmedAt"> & { id?: string }): VerifiedFact {
    const existingIndex = this.state.verifiedFacts.findIndex(
      (f) => f.id === fact.id || f.questionKey === fact.questionKey
    );

    const updatedFact: VerifiedFact = {
      id: fact.id || `fact-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: fact.category,
      questionKey: fact.questionKey,
      questionText: fact.questionText,
      verifiedAnswer: fact.verifiedAnswer,
      lastConfirmedAt: new Date().toISOString(),
      isSensitive: fact.isSensitive,
    };

    if (existingIndex >= 0) {
      this.state.verifiedFacts[existingIndex] = updatedFact;
    } else {
      this.state.verifiedFacts.push(updatedFact);
    }

    this.saveToStorage();
    return updatedFact;
  }

  public removeFact(factId: string): void {
    this.state.verifiedFacts = this.state.verifiedFacts.filter((f) => f.id !== factId);
    this.saveToStorage();
  }

  /**
   * Evaluates an application question against the verified knowledge base.
   * If confidence is low or sensitive, returns `needsConfirmation: true`.
   */
  public answerQuestion(
    rawQuestion: string,
    options?: string[]
  ): {
    answer: string | null;
    confidence: number;
    matchedFact: VerifiedFact | null;
    needsConfirmation: boolean;
    reason: string;
  } {
    // Normalize string: lowercase, remove punctuation, collapse whitespace
    const cleanStr = (s: string) =>
      s.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

    const qClean = cleanStr(rawQuestion);

    // 1. Check verified facts
    for (const fact of this.state.verifiedFacts) {
      const keyClean = cleanStr(fact.questionKey.replace(/_/g, " "));
      const textClean = cleanStr(fact.questionText);

      const isKeyMatch = qClean.includes(keyClean) || keyClean.includes(qClean);
      const isTextMatch =
        qClean.includes(textClean) ||
        textClean.includes(qClean) ||
        // Check for significant sub-phrase overlap (>= 3 words)
        qClean.split(" ").filter((w) => w.length > 3 && textClean.includes(w)).length >= 3;

      if (isKeyMatch || isTextMatch) {
        if (fact.isSensitive) {
          return {
            answer: fact.verifiedAnswer,
            confidence: 0.85,
            matchedFact: fact,
            needsConfirmation: true,
            reason: "Sensitive compensation/personal question requires candidate review.",
          };
        }
        return {
          answer: fact.verifiedAnswer,
          confidence: 0.95,
          matchedFact: fact,
          needsConfirmation: false,
          reason: `Matched verified knowledge base entry: ${fact.questionKey}`,
        };
      }
    }

    // 2. Check general preferences (notice period, total experience, relocation)
    if (qClean.includes("notice period") || qClean.includes("how soon can you join")) {
      const answer = `${this.state.preferences.noticePeriodDays} days`;
      return {
        answer,
        confidence: 0.9,
        matchedFact: null,
        needsConfirmation: false,
        reason: "Derived from candidate notice period preference.",
      };
    }

    if (qClean.includes("willing to relocate") || (qClean.includes("relocate") && !qClean.includes("why"))) {
      const answer = this.state.preferences.willingToRelocate ? "Yes" : "No";
      return {
        answer,
        confidence: 0.9,
        matchedFact: null,
        needsConfirmation: false,
        reason: "Derived from relocation preference.",
      };
    }

    // Only match total experience if it's NOT asking for a specific technology/domain (e.g. "with X", "in Y")
    const isSpecificSkillExp =
      qClean.includes(" with ") ||
      qClean.includes(" in ") ||
      qClean.includes(" using ") ||
      qClean.includes(" on ");

    if (
      (qClean.includes("total experience") ||
        (qClean.includes("years of experience") && !isSpecificSkillExp)) &&
      !isSpecificSkillExp
    ) {
      const answer = `${this.state.preferences.totalExperienceYears} years`;
      return {
        answer,
        confidence: 0.9,
        matchedFact: null,
        needsConfirmation: false,
        reason: "Derived from total experience preference.",
      };
    }

    // 3. Fallback: Fact preservation rule — cannot answer with high certainty
    return {
      answer: null,
      confidence: 0.2,
      matchedFact: null,
      needsConfirmation: true,
      reason: "No verified fact found. Escalating to candidate to avoid hallucination.",
    };
  }
}
