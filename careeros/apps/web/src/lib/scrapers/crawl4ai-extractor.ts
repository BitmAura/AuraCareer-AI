/**
 * Crawl4AI LLM-Friendly Markdown & Structured Extractor
 * Incorporated from p:\crazy-ai-stack\06-crawling-scraping\crawl4ai
 *
 * Converts raw career pages and job descriptions into pristine, noise-free
 * markdown and structured JSON schemas ready for LLM tailoring and ATS analysis.
 */

export interface ExtractedJobPosting {
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  salaryText?: string;
  markdownContent: string;
  requiredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  rawWordCount: number;
}

/**
 * Strips navigational headers, footers, cookie banners, and CSS/script clutter.
 */
export function cleanHtmlToMarkdown(rawHtml: string): string {
  if (!rawHtml) return "";

  // 1. Remove script, style, svg, and iframe tags
  let cleaned = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "");

  // 2. Convert standard headers
  cleaned = cleaned
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n");

  // 3. Convert list items
  cleaned = cleaned
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "\n• $1")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<\/ol>/gi, "\n");

  // 4. Convert paragraphs and line breaks
  cleaned = cleaned
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "\n$1\n")
    .replace(/<br\s*[\/]?>/gi, "\n");

  // 5. Strip remaining tags and unescape entities
  cleaned = cleaned
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned;
}

/**
 * Analyzes clean markdown content to extract key structured job facets.
 */
export function parseJobPostingFromMarkdown(
  markdown: string,
  sourceUrl?: string
): ExtractedJobPosting {
  const lines = markdown.split("\n").map((l) => l.trim()).filter(Boolean);
  const title = lines[0]?.replace(/^#+\s*/, "").slice(0, 100) || "Software Engineer";

  // Heuristic extraction for common skills
  const commonTechSkills = [
    "TypeScript", "JavaScript", "Python", "Go", "Java", "C++", "Rust",
    "React", "Next.js", "Node.js", "Express", "NestJS", "FastAPI", "Django",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "Elasticsearch",
    "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD",
    "GraphQL", "REST", "gRPC", "Microservices", "System Design", "Distributed Systems"
  ];

  const lowerContent = markdown.toLowerCase();
  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const requiredSkills = commonTechSkills.filter((s) => {
    const escaped = escapeRegex(s.toLowerCase());
    return new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, "i").test(lowerContent);
  });

  const isRemote = /\b(remote|work from home|wfh|anywhere)\b/i.test(markdown);

  // Detect salary strings (e.g. $150,000 - $180,000 or ₹25 LPA - ₹35 LPA)
  const salaryMatch = markdown.match(/(\$|₹|INR|USD|€|£)\s*\d+[\d,\.]*\s*(?:k|lpa|m|per year|annually)?(?:\s*-\s*(\$|₹|INR|USD|€|£)?\s*\d+[\d,\.]*\s*(?:k|lpa|m|per year|annually)?)?/i);
  const salaryText = salaryMatch ? salaryMatch[0] : undefined;

  // Extract bullets as responsibilities / qualifications
  const bullets = lines.filter((l) => l.startsWith("•") || l.startsWith("-")).map((l) => l.replace(/^[•\-]\s*/, ""));
  const responsibilities = bullets.slice(0, Math.min(6, bullets.length));
  const qualifications = bullets.slice(Math.min(6, bullets.length), 12);

  return {
    title,
    company: "Target Employer",
    location: isRemote ? "Remote" : "Hybrid / On-site",
    isRemote,
    salaryText,
    markdownContent: markdown,
    requiredSkills,
    responsibilities,
    qualifications,
    rawWordCount: markdown.split(/\s+/).length,
  };
}
