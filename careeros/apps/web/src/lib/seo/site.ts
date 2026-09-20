import type { Metadata } from "next";
import { LANDING_FAQS, PUBLIC_NAV } from "@/lib/seo/copy";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aura-career-ai.vercel.app";

export const siteConfig = {
  name: "AuraCareer AI",
  shortName: "AuraCareer",
  url: SITE_URL,
  locale: "en_IN",
  language: "en-IN",
  tagline: "Autonomous Career Action Platform — Pan-India & Worldwide",
  description:
    "AuraCareer AI by BitmAura is the sovereign autonomous career action platform for candidates worldwide — intelligent multi-portal direct ATS discovery, ATS-ready single-column LaTeX resumes with Overleaf sync, verified recruiter outreach, and human-in-the-loop control.",
  keywords: [
    "AuraCareer AI",
    "AuraCareer",
    "BitmAura Career",
    "Autonomous Job Search Agent",
    "ATS resume India",
    "LaTeX Overleaf resume generator",
    "Recruiter cold outreach automation",
    "AI career operating system",
    "Tech and Software jobs India",
    "Product Management careers",
    "Pan-India and global careers",
  ],
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Sovereign Autonomous Career Platform`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "AuraCareer AI (BitmAura)" }],
  creator: "AuraCareer AI",
  publisher: "BitmAura",
  applicationName: siteConfig.shortName,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Sovereign Autonomous Career Platform`,
    description: siteConfig.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Sovereign Autonomous Career Platform`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: { "en-IN": siteConfig.url, "x-default": siteConfig.url },
  },
  category: "career technology",
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "content-language": "en-IN",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    ...defaultMetadata,
    title: opts.title,
    description: opts.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      url,
      title: `${opts.title} · ${siteConfig.name}`,
      description: opts.description,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${opts.title} · ${siteConfig.name}`,
      description: opts.description,
    },
    alternates: {
      canonical: url,
      languages: { "en-IN": url, "x-default": url },
    },
  };
}

/** SoftwareApplication + FAQPage + Organization for SEO + AEO/GEO citation signals */
export function buildLandingJsonLd() {
  const org = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    areaServed: { "@type": "Country", name: "India" },
    slogan: siteConfig.tagline,
    knowsAbout: [
      "India manufacturing careers",
      "Purchase and procurement jobs",
      "Supply chain management",
      "Assisted job applications",
    ],
  };

  const app = {
    "@type": "SoftwareApplication",
    "@id": `${siteConfig.url}/#app`,
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "0",
      highPrice: "1999",
      offerCount: 3,
      description: "Starter free; Concierge ₹1,999/mo; Pro target ₹999/mo when inventory is buy-worthy",
    },
    featureList: [
      "Career targets — role, years, Pan-India cities, CTC, notice, industry pack",
      "Resume intelligence — ATS-style readiness scorecard",
      "Daily graded seats — 3 searches/day, 15 Confirm-apply seats",
      "OEM Workday + Greenhouse + pasted Naukri/LinkedIn JDs",
      "Tailored resume + cover packets",
      "Human Confirm apply — never silent Easy Apply",
    ],
    audience: {
      "@type": "Audience",
      geographicArea: { "@type": "AdministrativeArea", name: "Pan-India & Worldwide" },
      audienceType: "Every ambitious professional across Tech, Engineering, Operations, Product & Business",
    },
    provider: { "@id": `${siteConfig.url}/#organization` },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    mainEntity: LANDING_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const nav = {
    "@type": "ItemList",
    "@id": `${siteConfig.url}/#sitelinks`,
    name: "AuraCareer sitelinks",
    itemListElement: PUBLIC_NAV.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.label,
      url: absoluteUrl(item.href),
    })),
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    url: siteConfig.url,
    name: `${siteConfig.name} — Sovereign Autonomous Career Platform`,
    description: siteConfig.description,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#app` },
    primaryImageOfPage: `${siteConfig.url}/opengraph-image`,
    inLanguage: "en-IN",
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.tagline,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-IN",
  };

  return {
    "@context": "https://schema.org",
    "@graph": [org, website, webpage, app, faq, nav],
  };
}
