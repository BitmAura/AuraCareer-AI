import type { CareerTargets } from "@/lib/db/types";

export const DEFAULT_INDUSTRY_PACK = "general" as const;

export const INDUSTRY_PACKS = [
  { id: "software_tech", label: "Technology & Software Engineering" },
  { id: "healthcare", label: "Healthcare & Clinical (Doctors, Nurses, Hospital)" },
  { id: "finance_accounting", label: "Finance, Accounting, CA & Tax" },
  { id: "marketing_growth", label: "Digital Marketing, SEO, Content & Growth" },
  { id: "sales_bizdev", label: "Sales & Business Development" },
  { id: "manufacturing_scm", label: "Operations, Supply Chain & Manufacturing" },
  { id: "general", label: "General Professional (All Domains)" },
] as const;

export type RoleFamily =
  | "software_eng"
  | "healthcare"
  | "finance_accounting"
  | "marketing"
  | "sales"
  | "procurement"
  | "plant_ops"
  | "trades"
  | "hr_admin"
  | "it_mfg"
  | "general";

/** Universal role suggestions across major disciplines */
export const UNIVERSAL_ROLE_SUGGESTIONS = [
  "Senior Software Engineer",
  "Full Stack Developer",
  "Frontend Engineer (React / Next.js)",
  "Backend Engineer (Node / Python / Java)",
  "General Physician / Doctor (MBBS / MD)",
  "Registered Staff Nurse / Nursing Officer",
  "Chartered Accountant (CA / CPA)",
  "Financial Analyst / Controller",
  "Digital Marketing Specialist",
  "Performance Marketing & SEO Lead",
  "Product Manager",
  "Data Scientist / AI Engineer",
  "Procurement & Supply Chain Manager",
  "Plant Operations & Quality Manager",
  "HR Executive & Talent Partner",
  "Business Development & Key Account Manager",
] as const;

export const PACK_ROLE_SUGGESTIONS: Record<string, string[]> = {
  software_tech: [
    "Senior Software Engineer",
    "Full Stack Developer",
    "Backend Engineer (Node/Python/Go)",
    "Frontend Engineer (React/Next.js)",
    "AI / ML Engineer",
    "DevOps / Cloud Architect",
  ],
  healthcare: [
    "General Physician / Doctor (MBBS)",
    "Consultant Specialist / MD",
    "Staff Nurse / Registered Nurse (RN)",
    "Clinical Research Associate",
    "Hospital Operations Manager",
  ],
  finance_accounting: [
    "Chartered Accountant (CA)",
    "Senior Financial Analyst",
    "Finance Manager / Controller",
    "Taxation & Audit Specialist",
    "Accounts Payable / Receivable Lead",
  ],
  marketing_growth: [
    "Digital Marketing Specialist",
    "SEO & Content Growth Lead",
    "Performance Marketing Manager",
    "Brand & Social Media Strategist",
    "Product Marketing Manager",
  ],
  sales_bizdev: [
    "Enterprise Account Executive",
    "Business Development Manager (BDM)",
    "Sales Director",
    "Key Account Manager",
  ],
  manufacturing_scm: [
    "Plant Operations Manager",
    "Quality Assurance (QA/QC) Engineer",
    "Supply Chain & Procurement Manager",
    "Production Supervisor",
    "Maintenance Engineer",
  ],
  general: [
    "Senior Software Engineer",
    "General Physician / Doctor",
    "Registered Staff Nurse",
    "Chartered Accountant (CA)",
    "Digital Marketing Specialist",
    "Financial Analyst",
    "Product Manager",
    "Operations Manager",
  ],
};

export const MANUFACTURING_ROLE_SUGGESTIONS = UNIVERSAL_ROLE_SUGGESTIONS;

export function emptyTargets(): CareerTargets {
  return {
    targetRole: "",
    yearsExperience: 0,
    cities: [],
    industryPack: DEFAULT_INDUSTRY_PACK,
    /** Default true — Pan-India hunt; cities are preference, not a wall */
    openToRelocate: true,
  };
}

export function normalizeTargets(raw: Partial<CareerTargets> | null | undefined): CareerTargets {
  const base = emptyTargets();
  if (!raw) return base;
  const cities = Array.isArray(raw.cities)
    ? raw.cities.map((c) => String(c).trim()).filter(Boolean).slice(0, 8)
    : String((raw as { cities?: unknown }).cities || "")
        .split(/[,|]/)
        .map((c) => c.trim())
        .filter(Boolean)
        .slice(0, 8);
  return {
    targetRole: String(raw.targetRole || "").slice(0, 120),
    yearsExperience: Math.max(0, Math.min(45, Number(raw.yearsExperience) || 0)),
    cities,
    ctcMinLpa: raw.ctcMinLpa != null ? Number(raw.ctcMinLpa) || undefined : undefined,
    ctcMaxLpa: raw.ctcMaxLpa != null ? Number(raw.ctcMaxLpa) || undefined : undefined,
    noticeDays: raw.noticeDays != null ? Math.max(0, Number(raw.noticeDays) || 0) : undefined,
    industryPack:
      raw.industryPack === "healthcare" || raw.industryPack === "general"
        ? raw.industryPack
        : DEFAULT_INDUSTRY_PACK,
    openToRelocate: raw.openToRelocate === undefined ? true : Boolean(raw.openToRelocate),
  };
}

/** Infer family from free text (role title, job title+description). */
export function inferRoleFamilyFromText(text: string): RoleFamily {
  const role = (text || "").toLowerCase();
  // Title-ish prefix — avoids JD body words (operator/technician) hijacking family.
  const head = role.slice(0, 160);

  // 1. Healthcare & Medicine (Doctors, Nurses, Surgeons, Clinical, Pharma)
  if (
    /doctor|physician|nurse|nursing|surgeon|mbbs|md\b|bams|bhms|dentist|pharmacist|pharmacy|clinical|hospital|medical affairs|patient care|healthcare|anesthesiologist|pediatrician|pathologist|radiologist|general practitioner/.test(
      role,
    )
  ) {
    return "healthcare";
  }

  // 2. Technology & Software Engineering
  if (
    /software|frontend|backend|full\s*stack|developer|programmer|engineer|devops|sre|cloud|solutions architect|web developer|mobile developer|ios|android|react|node|python|java\b|golang|data scientist|machine learning|ai engineer|sde\b|qa engineer|test engineer|systems architect|tech lead|engineering manager/.test(
      role,
    )
  ) {
    return "software_eng";
  }

  // 3. Finance, Accounting, CA & Tax
  if (
    /accountant|accounting|finance|chartered accountant|\bca\b|\bcpa\b|financial analyst|audit|auditor|taxation|tax analyst|billing|controller|accounts payable|accounts receivable|treasury|bookkeeper|financial planning|fp&a/.test(
      role,
    )
  ) {
    return "finance_accounting";
  }

  // 4. Digital Marketing, Growth & SEO
  if (
    /digital marketing|performance marketing|marketing manager|growth manager|\bseo\b|\bsem\b|social media|content writer|content marketing|brand manager|campaign manager|ppc|copywriter|ad operations|media buyer/.test(
      role,
    )
  ) {
    return "marketing";
  }

  // 5. Specific industrial trades
  if (
    /\biti\b|hvac|a\/?c tech|ac tech|air conditioning|refrigeration|electrician|fitter|welder|plumber|jcb|excavator|crane operator|rigger|lorry|truck driver|heavy vehicle|forklift|cnc operator|millwright|boiler operator|instrumentation tech/.test(
      head,
    )
  ) {
    return "trades";
  }

  // 6. HR & People Operations
  if (
    /\bhr\b|human resource|talent acquisition|recruitment|payroll|admin\b|administration|office assistant|front office|receptionist|facility coordinator|people ops/.test(
      head,
    )
  ) {
    return "hr_admin";
  }

  // 7. IT Support / System Admin
  if (
    /\bit support\b|it executive|information technology|system admin|sysadmin|network engineer|helpdesk|help desk|desktop support|sap basis|ot support|plant it|infra support/.test(
      head,
    )
  ) {
    return "it_mfg";
  }

  // 8. Sales & Business Development
  if (
    /sales|account manager|key account|kam\b|rsm\b|bdm\b|business development|channel|dealer|distributor|institutional|commercial manager|area sales|territory|revenue|partner success|customer program/.test(
      role,
    )
  ) {
    return "sales";
  }

  // 9. Plant Operations & Production
  if (
    /production|plant manager|maintenance manager|quality|manufacturing engineer|shift incharge|operations manager|factory|ehs|tpm|lean|production supervisor|shop floor|project lead|business intelligence/.test(
      role,
    )
  ) {
    return "plant_ops";
  }

  // 10. Procurement & Supply Chain
  if (
    /procure|purchase|scm|supply chain|sourcing|vendor|material|buyer|planning|logistics|category manager|stores|inventory|warehouse/.test(
      role,
    )
  ) {
    return "procurement";
  }

  if (
    /diploma|technician|helper|\boperator\b|mechanic/.test(head) &&
    !/manager|director|engineer|lead\b|head\b/.test(head)
  ) {
    return "trades";
  }

  return "general";
}

/** Infer hunt family from target role text (drives search keywords + match lexicon). */
export function inferRoleFamily(targets: CareerTargets | null | undefined): RoleFamily {
  if (!targets) return "general";
  if (targets.industryPack === "software_tech") return "software_eng";
  if (targets.industryPack === "healthcare") return "healthcare";
  if (targets.industryPack === "finance_accounting") return "finance_accounting";
  if (targets.industryPack === "marketing_growth") return "marketing";
  if (targets.industryPack === "sales_bizdev") return "sales";
  if (targets.industryPack === "general") {
    const fromRole = inferRoleFamilyFromText(targets.targetRole || "");
    return fromRole;
  }

  const fromRole = inferRoleFamilyFromText(targets.targetRole || "");
  if (fromRole !== "general") return fromRole;
  return "general";
}

/**
 * Compatible families for queue admission.
 */
export function roleFamiliesCompatible(
  candidate: RoleFamily,
  job: RoleFamily,
): boolean {
  if (candidate === "general" || job === "general") return true;
  if (candidate === job) return true;
  if (
    (candidate === "trades" && job === "plant_ops") ||
    (candidate === "plant_ops" && job === "trades")
  ) {
    return true;
  }
  return false;
}

/** Keywords for search queries + match rubric — follows Profile targetRole. */
export function packKeywordsForTargets(targets: CareerTargets | null | undefined): string {
  const family = inferRoleFamily(targets);
  switch (family) {
    case "software_eng":
      return "software engineer full stack backend frontend cloud python java react nextjs node developer SDE";
    case "healthcare":
      return "doctor physician nurse MBBS MD hospital clinical healthcare medical patient care surgery";
    case "finance_accounting":
      return "finance accounting accountant chartered accountant CA CPA audit tax reconciliation financial analyst billing";
    case "marketing":
      return "digital marketing performance marketing SEO growth social media brand campaign SEM content copy";
    case "sales":
      return "sales key account channel distributor institutional B2B commercial revenue business development client";
    case "plant_ops":
      return "production plant quality maintenance manufacturing operations lean TPM safety supervisor";
    case "trades":
      return "ITI diploma HVAC technician electrician fitter operator JCB driver";
    case "hr_admin":
      return "HR human resources recruitment payroll admin office talent acquisition people ops";
    case "it_mfg":
      return "IT support network helpdesk SAP SCADA MES system admin desktop support";
    case "procurement":
      return "procurement purchase SAP MM supply chain vendor negotiation sourcing buyer";
    default:
      return "professional career openings vacancies jobs hiring opportunities";
  }
}

export function targetsToSearchText(targets: CareerTargets | null | undefined): string {
  if (!targets) return "";
  const parts = [
    targets.targetRole,
    targets.yearsExperience ? `${targets.yearsExperience} years experience` : "",
    ...(targets.cities || []),
    packKeywordsForTargets(targets),
    targets.ctcMinLpa ? `CTC ${targets.ctcMinLpa} LPA` : "",
    targets.ctcMaxLpa ? `${targets.ctcMaxLpa} LPA` : "",
    targets.noticeDays != null ? `notice ${targets.noticeDays} days` : "",
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function hasUsableTargets(targets: CareerTargets | null | undefined): boolean {
  if (!targets) return false;
  return (
    Boolean(targets.targetRole?.trim()) ||
    (targets.cities?.length || 0) > 0 ||
    (targets.yearsExperience || 0) > 0
  );
}

/** Soft preference only — never used to drop jobs from the national pool when relocating. */
export function locationPreferenceScore(
  jobLocation: string,
  targets: CareerTargets | null | undefined,
): { score: number; note?: string } {
  if (!targets?.cities?.length) {
    return { score: 70, note: jobLocation ? `Posted: ${jobLocation}` : undefined };
  }
  const loc = (jobLocation || "").toLowerCase();
  const cityHit = targets.cities.some((c) => loc.includes(c.toLowerCase()));
  const panIndia = /remote|pan[\s-]?india|anywhere|india\b|multiple|pan india/i.test(loc);

  if (cityHit) {
    return { score: 98, note: `Preferred city match: ${jobLocation}` };
  }
  if (panIndia) {
    return { score: 82, note: `Pan-India / flexible location: ${jobLocation}` };
  }
  return {
    score: targets.openToRelocate === false ? 28 : 62,
    note:
      targets.openToRelocate === false
        ? `Outside preferred cities (${jobLocation}) — excluded when relocate is off`
        : `Other city (${jobLocation}) — still ranked; prefer ${targets.cities.join(", ")} if equal fit`,
  };
}

/**
 * Hard location gate only when openToRelocate === false and cities are set.
 * Pan-India / remote always allowed.
 */
export function jobMatchesTargetLocation(
  jobLocation: string,
  targets: CareerTargets | null | undefined,
): boolean {
  const loc = (jobLocation || "").toLowerCase().trim();
  if (!loc) return true;

  const isWorldwideTarget = (targets?.cities || []).some((c) =>
    /\b(worldwide|global|all)\b/i.test(c),
  );
  if (isWorldwideTarget) return true;

  const NON_INDIA =
    /\b(united states|\busa\b|\bus\b|canada|mexico|china|germany|europe|\buk\b|united kingdom|london|seattle|california|texas|new york|florida|illinois|san francisco|chicago|toronto)\b|,\s*(ca|ny|tx|wa|il|ma|fl|uk)\b/;
  if (NON_INDIA.test(loc)) return false;

  if (!targets?.cities?.length) return true;
  if (targets.openToRelocate === false) {
    if (/remote|pan[\s-]?india|anywhere|multiple/i.test(loc)) return true;
    return targets.cities.some((c) => loc.includes(c.toLowerCase()));
  }
  return true;
}
