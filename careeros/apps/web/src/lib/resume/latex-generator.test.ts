import { describe, it, expect } from "vitest";
import {
  generateAtsLatexResume,
  generateOverleafUrl,
  extractJdKeywords,
  tailorResumeDataToJd,
} from "./latex-generator";
import { LatexResumeData, sanitizeLatex } from "./latex-templates";

describe("LaTeX / Overleaf Resume Generator Engine", () => {
  const sampleCandidate: LatexResumeData = {
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedinUrl: "https://linkedin.com/in/priyasharma",
    githubUrl: "https://github.com/priyasharma",
    summary:
      "Senior Staff Software Engineer with 7+ years designing distributed systems, Next.js applications, and high-throughput microservices handling $50M+ in transactions.",
    skills: [
      {
        category: "Core Languages & Frameworks",
        items: ["TypeScript", "Python", "Go", "Next.js", "React", "Node.js"],
      },
      {
        category: "Cloud & Infrastructure",
        items: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Kafka"],
      },
    ],
    experience: [
      {
        roleTitle: "Staff Software Engineer",
        company: "HyperScale Tech & Co.",
        location: "Bengaluru",
        startDate: "Jan 2022",
        endDate: "Present",
        highlights: [
          "Architected real-time event streaming pipeline using Kafka & PostgreSQL reducing latency by 45%.",
          "Engineered Next.js & TypeScript core web platform with 99.99% uptime.",
          "Cut AWS infrastructure expenses by $18,000/month through Docker & Kubernetes cluster optimization.",
        ],
      },
      {
        roleTitle: "Senior Software Engineer",
        company: "FinFlow Technologies",
        location: "Pune",
        startDate: "Jul 2019",
        endDate: "Dec 2021",
        highlights: [
          "Built high-throughput payment reconciliation engine processing 1.2M transactions daily.",
          "Implemented Redis caching layer decreasing API p99 response times from 350ms to 42ms.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Tech in Computer Science & Engineering",
        institution: "National Institute of Technology",
        location: "Surathkal",
        year: "2019",
        honors: "First Class with Distinction",
      },
    ],
    projects: [
      {
        name: "Sovereign AGI Mesh",
        technologies: ["TypeScript", "Mastra", "Next.js", "PostgreSQL"],
        description: "Autonomous multi-agent orchestration framework for career intelligence.",
        link: "https://github.com/priyasharma/sovereign-mesh",
      },
    ],
  };

  it("sanitizes special LaTeX characters properly", () => {
    expect(sanitizeLatex("Tech & Co.")).toBe("Tech \\& Co.");
    expect(sanitizeLatex("Reduced costs by 15% ($50K+)")).toBe("Reduced costs by 15\\% (\\$50K+)");
    expect(sanitizeLatex("user_id_hash #1")).toBe("user\\_id\\_hash \\#1");
  });

  it("extracts relevant keywords from target Job Description", () => {
    const jd = `
      We are looking for a Staff Software Engineer to build our next-generation distributed systems.
      Must have strong experience with TypeScript, Next.js, PostgreSQL, Docker, and Kafka.
    `;
    const keywords = extractJdKeywords(jd);
    expect(keywords).toContain("typescript");
    expect(keywords).toContain("postgresql");
    expect(keywords).toContain("kafka");
    expect(keywords).toContain("docker");
  });

  it("prioritizes matched skills and experience without hallucinating new data", () => {
    const jd = "Seeking Kafka, PostgreSQL, and Kubernetes expert.";
    const result = tailorResumeDataToJd(sampleCandidate, { jobDescription: jd });

    expect(result.matchedKeywords).toContain("kafka");
    expect(result.matchedKeywords).toContain("postgresql");
    expect(result.matchedKeywords).toContain("kubernetes");

    // Fact Preservation Check: candidate companies and roles remain untouched
    expect(result.tailoredData.experience[0].company).toBe(sampleCandidate.experience[0].company);
    expect(result.tailoredData.experience[0].roleTitle).toBe(sampleCandidate.experience[0].roleTitle);
  });

  it("generates complete, valid LaTeX resume source", () => {
    const result = generateAtsLatexResume(sampleCandidate);

    expect(result.latexSource).toContain("\\documentclass[letterpaper,10pt]{article}");
    expect(result.latexSource).toContain("Priya Sharma");
    expect(result.latexSource).toContain("Staff Software Engineer");
    expect(result.latexSource).toContain("HyperScale Tech \\& Co.");
    expect(result.latexSource).toContain("\\end{document}");
  });

  it("generates valid Overleaf 1-click URL with encoded data", () => {
    const result = generateAtsLatexResume(sampleCandidate);
    expect(result.overleafUrl).toMatch(/^https:\/\/www\.overleaf\.com\/docs\?snip_uri=data%3Aapplication%2Fx-tex%3Bbase64/);
  });
});
