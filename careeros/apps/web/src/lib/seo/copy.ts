import { PRODUCT_STANCE } from "@/lib/product/stance";

export const LANDING_FAQS = [
  {
    q: "What is AuraCareer AI?",
    a: "AuraCareer AI is a sovereign autonomous Career Operating System engineered by BitmAura. It discovers matching roles across 13 major job portals, prepares single-column ATS-grade LaTeX resumes with Overleaf sync, drafts cold outreach with verified recruiter contacts, and keeps candidates in full sovereign control.",
  },
  {
    q: "How many job applications can I do per day?",
    a: `Up to ${PRODUCT_STANCE.dailyQueueCap} confirmed seats per day, filled from up to ${PRODUCT_STANCE.dailyDigestRunsMax} multi-portal searches (morning, midday, evening). You confirm each apply — we don’t auto-blast LinkedIn spam.`,
  },
  {
    q: "Is AuraCareer AI better than Naukri Premium?",
    a: "Naukri is simply a job board listing site. AuraCareer AI is an autonomous execution agent: stealth portal scraping, ATS scorecards, tailored Overleaf/LaTeX packets, recruiter cold outreach with Calendly link extraction, and tracking — including roles you paste from Naukri, LinkedIn, or company career pages.",
  },
  {
    q: "Does AuraCareer AI auto-apply blindly on LinkedIn?",
    a: "No. Blind Easy Apply bots risk getting accounts restricted and fail custom screening questions. AuraCareer AI prepares the complete packet and verifies ATS fit; you approve and submit with sovereign peace of mind.",
  },
  {
    q: "Does it work across India or only specific hubs?",
    a: "Pan-India and global. Hubs such as Bengaluru, Hyderabad, Pune, Chennai, Mumbai, NCR, Ahmedabad, and international remote roles are all fully supported.",
  },
  {
    q: "Who is AuraCareer AI built for?",
    a: "Engineers, software professionals, product managers, data specialists, manufacturing SCM leaders, and any serious professional who wants sovereign AI to handle the tedious legwork of job hunting without losing control.",
  },
];

export const PUBLIC_NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for/purchase-scm", label: "Purchase & SCM" },
  { href: "/compare", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
] as const;
