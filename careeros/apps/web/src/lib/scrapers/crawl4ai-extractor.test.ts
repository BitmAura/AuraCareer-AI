import { describe, it, expect } from "vitest";
import { cleanHtmlToMarkdown, parseJobPostingFromMarkdown } from "./crawl4ai-extractor";

describe("Crawl4AI Extractor", () => {
  it("cleans raw HTML and removes scripts/styles/nav", () => {
    const rawHtml = `
      <html>
        <head><style>.btn { color: red; }</style></head>
        <body>
          <nav><a href="/home">Home</a></nav>
          <h1>Staff Backend Engineer</h1>
          <p>We are seeking an experienced engineer to scale our distributed systems.</p>
          <ul>
            <li>Build high-throughput Kafka pipelines</li>
            <li>Optimize PostgreSQL databases</li>
          </ul>
          <footer>Copyright 2026</footer>
        </body>
      </html>
    `;

    const md = cleanHtmlToMarkdown(rawHtml);
    expect(md).toContain("# Staff Backend Engineer");
    expect(md).toContain("We are seeking an experienced engineer");
    expect(md).toContain("• Build high-throughput Kafka pipelines");
    expect(md).not.toContain("color: red");
    expect(md).not.toContain("Copyright 2026");
  });

  it("parses structured job facets including skills and remote status", () => {
    const markdown = `
      # Senior Full-Stack Engineer
      Location: Remote (US & India)
      Compensation: $160,000 - $190,000 per year

      Responsibilities:
      • Architect scalable Next.js and TypeScript frontend applications
      • Design robust Go and PostgreSQL microservices
      • Deploy workloads to Kubernetes on AWS

      Requirements:
      • 5+ years of experience with React, TypeScript, and Node.js
    `;

    const parsed = parseJobPostingFromMarkdown(markdown);
    expect(parsed.title).toBe("Senior Full-Stack Engineer");
    expect(parsed.isRemote).toBe(true);
    expect(parsed.salaryText).toBeDefined();
    expect(parsed.requiredSkills).toContain("TypeScript");
    expect(parsed.requiredSkills).toContain("React");
    expect(parsed.requiredSkills).toContain("Next.js");
    expect(parsed.requiredSkills).toContain("Go");
    expect(parsed.requiredSkills).toContain("PostgreSQL");
    expect(parsed.requiredSkills).toContain("Kubernetes");
    expect(parsed.responsibilities.length).toBeGreaterThan(0);
  });
});
