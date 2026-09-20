import {
  generateModernAtsLatex,
  type LatexResumeData,
  sanitizeLatex,
} from "./latex-templates";

export interface TailorLatexOptions {
  jobDescription?: string;
  targetRoleTitle?: string;
}

export interface GeneratedLatexResult {
  latexSource: string;
  overleafUrl: string;
  matchedKeywords: string[];
  suggestedAdditions: string[];
}

/**
 * Extracts potential keywords from a target Job Description.
 */
export function extractJdKeywords(jdText: string): string[] {
  if (!jdText) return [];
  const words = jdText
    .toLowerCase()
    .replace(/[^\w\s\+\#\.\-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/[.,;:]+$/, "").trim())
    .filter((w) => w.length >= 3);

  const stopWords = new Set([
    "the", "and", "for", "with", "this", "that", "from", "have", "will", "your",
    "must", "should", "ability", "experience", "years", "working", "team", "role",
    "responsibilities", "requirements", "candidate", "about", "what", "where",
  ]);

  const unique = Array.from(new Set(words.filter((w) => !stopWords.has(w))));
  return unique.slice(0, 40);
}

/**
 * Tailors candidate resume data to target JD keywords without fabricating facts.
 * Adheres strictly to Invariant 1 (Fact Preservation Guarantee).
 */
export function tailorResumeDataToJd(
  baseData: LatexResumeData,
  options?: TailorLatexOptions
): {
  tailoredData: LatexResumeData;
  matchedKeywords: string[];
  suggestedAdditions: string[];
} {
  if (!options?.jobDescription) {
    return {
      tailoredData: baseData,
      matchedKeywords: [],
      suggestedAdditions: [],
    };
  }

  const jdKeywords = extractJdKeywords(options.jobDescription);
  const resumeTextLower = JSON.stringify(baseData).toLowerCase();

  const matchedKeywords: string[] = [];
  const suggestedAdditions: string[] = [];

  for (const kw of jdKeywords) {
    if (resumeTextLower.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      suggestedAdditions.push(kw);
    }
  }

  // Re-prioritize skills: move matching skills to front of lists
  const tailoredSkills = baseData.skills.map((category) => {
    const sortedItems = [...category.items].sort((a, b) => {
      const aMatch = jdKeywords.some((k) => a.toLowerCase().includes(k));
      const bMatch = jdKeywords.some((k) => b.toLowerCase().includes(k));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
    return {
      ...category,
      items: sortedItems,
    };
  });

  // Highlight or prioritize experience bullets that mention matched keywords
  const tailoredExperience = baseData.experience.map((exp) => {
    const sortedHighlights = [...exp.highlights].sort((a, b) => {
      const aMatches = matchedKeywords.filter((k) => a.toLowerCase().includes(k)).length;
      const bMatches = matchedKeywords.filter((k) => b.toLowerCase().includes(k)).length;
      return bMatches - aMatches;
    });
    return {
      ...exp,
      highlights: sortedHighlights,
    };
  });

  return {
    tailoredData: {
      ...baseData,
      skills: tailoredSkills,
      experience: tailoredExperience,
    },
    matchedKeywords,
    suggestedAdditions: suggestedAdditions.slice(0, 10),
  };
}

/**
 * Generates an Overleaf 1-click cloud import link.
 * Uses Overleaf's direct document creator endpoint with base64 data URI.
 */
export function generateOverleafUrl(latexSource: string): string {
  // Base64 encode the LaTeX document
  const base64Content = typeof window !== "undefined"
    ? window.btoa(unescape(encodeURIComponent(latexSource)))
    : Buffer.from(latexSource, "utf-8").toString("base64");

  const dataUri = `data:application/x-tex;base64,${base64Content}`;
  return `https://www.overleaf.com/docs?snip_uri=${encodeURIComponent(dataUri)}`;
}

/**
 * Full LaTeX generation pipeline for AuraCareer AI (BitmAura).
 */
export function generateAtsLatexResume(
  data: LatexResumeData,
  options?: TailorLatexOptions
): GeneratedLatexResult {
  const { tailoredData, matchedKeywords, suggestedAdditions } = tailorResumeDataToJd(data, options);
  const latexSource = generateModernAtsLatex(tailoredData);
  const overleafUrl = generateOverleafUrl(latexSource);

  return {
    latexSource,
    overleafUrl,
    matchedKeywords,
    suggestedAdditions,
  };
}
export { LatexResumeData };

