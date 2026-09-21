/**
 * India-hiring public ATS boards for CareerOS portal scan.
 * Manufacturing / industrial only — US SaaS marketplace boards removed from buy-bar.
 */

export type PortalBoardKind = "greenhouse" | "lever" | "ashby";

export type PortalBoard = {
  id: string;
  company: string;
  kind: PortalBoardKind;
  token: string;
  tags: string[];
  indiaHiring: boolean;
};

/** Boards across all professional families (Tech, Healthcare, Finance, Marketing, Ops). */
export const PORTAL_BOARDS: PortalBoard[] = [
  // 1. Healthcare, Clinical & Doctors / Nurses
  {
    id: "gh-zocdoc",
    company: "Zocdoc",
    kind: "greenhouse",
    token: "zocdoc",
    tags: ["healthcare", "clinical", "hospital", "medical"],
    indiaHiring: true,
  },
  {
    id: "gh-oscar",
    company: "Oscar Health",
    kind: "greenhouse",
    token: "oscar",
    tags: ["healthcare", "clinical", "hospital", "medical"],
    indiaHiring: true,
  },
  {
    id: "gh-doximity",
    company: "Doximity",
    kind: "greenhouse",
    token: "doximity",
    tags: ["healthcare", "clinical", "medical", "doctor"],
    indiaHiring: true,
  },

  // 2. Technology & Software Engineering
  {
    id: "gh-inmobi",
    company: "InMobi",
    kind: "greenhouse",
    token: "inmobi",
    tags: ["tech", "software", "engineering", "marketing"],
    indiaHiring: true,
  },
  {
    id: "gh-canonical",
    company: "Canonical",
    kind: "greenhouse",
    token: "canonical",
    tags: ["tech", "software", "engineering", "cloud"],
    indiaHiring: true,
  },
  {
    id: "gh-razorpay",
    company: "Razorpay",
    kind: "greenhouse",
    token: "razorpaysoftwareprivatelimited",
    tags: ["tech", "software", "fintech", "finance"],
    indiaHiring: true,
  },
  {
    id: "lev-cred",
    company: "CRED",
    kind: "lever",
    token: "cred",
    tags: ["tech", "software", "fintech", "finance"],
    indiaHiring: true,
  },
  {
    id: "gh-cloudflare",
    company: "Cloudflare",
    kind: "greenhouse",
    token: "cloudflare",
    tags: ["tech", "software", "engineering", "network"],
    indiaHiring: true,
  },
  {
    id: "gh-datadog",
    company: "Datadog",
    kind: "greenhouse",
    token: "datadog",
    tags: ["tech", "software", "engineering"],
    indiaHiring: true,
  },
  {
    id: "gh-gitlab",
    company: "GitLab",
    kind: "greenhouse",
    token: "gitlab",
    tags: ["tech", "software", "engineering"],
    indiaHiring: true,
  },

  // 3. Finance, Accounting & FinTech
  {
    id: "gh-stripe",
    company: "Stripe",
    kind: "greenhouse",
    token: "stripe",
    tags: ["finance", "fintech", "accounting", "tech"],
    indiaHiring: true,
  },
  {
    id: "gh-block",
    company: "Block / Square",
    kind: "greenhouse",
    token: "block",
    tags: ["finance", "fintech", "accounting"],
    indiaHiring: true,
  },
  {
    id: "gh-chime",
    company: "Chime",
    kind: "greenhouse",
    token: "chime",
    tags: ["finance", "fintech", "accounting"],
    indiaHiring: true,
  },
  {
    id: "gh-monzo",
    company: "Monzo",
    kind: "greenhouse",
    token: "monzo",
    tags: ["finance", "accounting", "fintech"],
    indiaHiring: true,
  },
  {
    id: "gh-carta",
    company: "Carta",
    kind: "greenhouse",
    token: "carta",
    tags: ["finance", "accounting", "fintech"],
    indiaHiring: true,
  },

  // 4. Digital Marketing, Media & Growth (India hubs: Bangalore, Mumbai, Gurgaon)
  {
    id: "lev-meesho",
    company: "Meesho",
    kind: "lever",
    token: "meesho",
    tags: ["marketing", "growth", "performance marketing", "brand", "tech", "sales"],
    indiaHiring: true,
  },
  {
    id: "gh-inmobi-mktg",
    company: "InMobi",
    kind: "greenhouse",
    token: "inmobi",
    tags: ["marketing", "growth", "advertising", "media", "tech"],
    indiaHiring: true,
  },
  {
    id: "lev-cred-mktg",
    company: "CRED",
    kind: "lever",
    token: "cred",
    tags: ["marketing", "growth", "fintech", "tech"],
    indiaHiring: true,
  },
  {
    id: "gh-reddit",
    company: "Reddit",
    kind: "greenhouse",
    token: "reddit",
    tags: ["marketing", "growth", "advertising", "media"],
    indiaHiring: false,
  },
  {
    id: "gh-affirm",
    company: "Affirm",
    kind: "greenhouse",
    token: "affirm",
    tags: ["marketing", "growth", "fintech"],
    indiaHiring: true,
  },
  {
    id: "gh-instacart",
    company: "Instacart",
    kind: "greenhouse",
    token: "instacart",
    tags: ["marketing", "growth", "ops"],
    indiaHiring: true,
  },

  // 5. Operations, SCM & Industrial
  {
    id: "gh-fictiv",
    company: "Fictiv",
    kind: "greenhouse",
    token: "fictiv",
    tags: ["manufacturing", "plant", "supply", "ops"],
    indiaHiring: true,
  },
  {
    id: "gh-xometry",
    company: "Xometry",
    kind: "greenhouse",
    token: "xometry",
    tags: ["manufacturing", "supply", "ops", "sales"],
    indiaHiring: true,
  },
];

export const INDIA_MANUFACTURING_PORTAL_BOARDS = PORTAL_BOARDS;

export function boardsForRoleFamily(family: string): PortalBoard[] {
  const prefer =
    family === "software_eng"
      ? ["software", "tech", "engineering", "cloud"]
      : family === "healthcare"
        ? ["healthcare", "clinical", "hospital", "medical", "doctor"]
        : family === "finance_accounting"
          ? ["finance", "accounting", "fintech"]
          : family === "marketing"
            ? ["marketing", "growth", "advertising", "media"]
            : family === "sales"
              ? ["sales", "bizdev", "commercial"]
              : family === "procurement" || family === "plant_ops"
                ? ["supply", "ops", "manufacturing"]
                : ["tech", "software", "healthcare", "finance", "marketing", "ops"];

  return [...PORTAL_BOARDS].sort((a, b) => {
    const aMatch = a.tags.some((t) => prefer.includes(t)) ? 1 : 0;
    const bMatch = b.tags.some((t) => prefer.includes(t)) ? 1 : 0;
    return bMatch - aMatch;
  });
}
