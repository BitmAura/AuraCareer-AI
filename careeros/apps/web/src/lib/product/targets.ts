import type { CareerTargets } from "@/lib/db/types";

export const DEFAULT_INDUSTRY_PACK = "manufacturing_scm" as const;

export const INDUSTRY_PACKS = [
  {
    id: "manufacturing_scm",
    label: "Manufacturing plant — purchase, sales, ops, trades, HVAC, HR, IT",
  },
  { id: "healthcare", label: "Healthcare — Clinical / Hospital / Med Affairs" },
  { id: "general", label: "General professional" },
] as const;

/**
 * Hunt families inside manufacturing plants / industrial sites.
 * trades = ITI/diploma/HVAC/driver/JCB/operator; hr_admin = HR + office admin;
 * it_mfg = plant IT / OT support (not SaaS product).
 */
export type RoleFamily =
  | "sales"
  | "procurement"
  | "plant_ops"
  | "trades"
  | "hr_admin"
  | "it_mfg"
  | "healthcare"
  | "general";

/** Profile chips — manufacturing workforce only. */
export const MANUFACTURING_ROLE_SUGGESTIONS = [
  "Purchase Executive",
  "Procurement Manager",
  "Store / Inventory",
  "Sales Executive — Manufacturing",
  "Regional Sales Manager",
  "Production Supervisor",
  "Plant / Maintenance Manager",
  "Quality Engineer",
  "HVAC Technician",
  "AC Technician",
  "ITI Fitter / Electrician",
  "Diploma Mechanical",
  "JCB / Crane Operator",
  "Lorry / Truck Driver",
  "HR Executive — Plant",
  "Admin / Office Assistant",
  "IT Support — Manufacturing",
] as const;

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

  if (
    /clinical|hospital|medical affairs|physician|doctor|nurse|healthcare|patient care/.test(role)
  ) {
    return "healthcare";
  }

  // Specific trades on title/head first (HVAC, ITI, drivers, craft).
  if (
    /\biti\b|hvac|a\/?c tech|ac tech|air conditioning|refrigeration|electrician|fitter|welder|plumber|jcb|excavator|crane operator|rigger|lorry|truck driver|heavy vehicle|forklift|cnc operator|millwright|boiler operator|instrumentation tech/.test(
      head,
    )
  ) {
    return "trades";
  }

  if (
    /\bhr\b|human resource|talent acquisition|recruitment|payroll|admin\b|administration|office assistant|front office|receptionist|facility coordinator/.test(
      head,
    )
  ) {
    return "hr_admin";
  }

  if (
    /\bit support\b|it executive|information technology|system admin|sysadmin|network engineer|helpdesk|help desk|desktop support|sap basis|ot support|plant it|infra support/.test(
      head,
    )
  ) {
    return "it_mfg";
  }

  if (
    /sales|account manager|key account|kam\b|rsm\b|bdm\b|business development|channel|dealer|distributor|institutional|commercial manager|area sales|territory|revenue|partner success|customer program/.test(
      role,
    )
  ) {
    return "sales";
  }

  if (
    /production|plant manager|maintenance manager|quality|manufacturing engineer|shift incharge|operations manager|factory|ehs|tpm|lean|production supervisor|shop floor|project lead|business intelligence/.test(
      role,
    )
  ) {
    return "plant_ops";
  }

  if (
    /procure|purchase|scm|supply chain|sourcing|vendor|material|buyer|planning|logistics|category manager|stores|inventory|warehouse/.test(
      role,
    )
  ) {
    return "procurement";
  }

  // Weaker trades signals (technician/operator/diploma) — title/head only.
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
  if (!targets) return "procurement";
  if (targets.industryPack === "healthcare") return "healthcare";
  if (targets.industryPack === "general") return "general";

  const fromRole = inferRoleFamilyFromText(targets.targetRole || "");
  if (fromRole !== "general") return fromRole;
  // Manufacturing pack with empty/unknown role → default beachhead (purchase/SCM)
  if (!(targets.targetRole || "").trim()) return "procurement";
  return "general";
}

/**
 * Compatible families for queue admission.
 * trades ↔ plant_ops (same plant workforce). Others stay strict except general.
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

/** Keywords for TinyFish queries + match rubric — follows Profile targetRole. */
export function packKeywordsForTargets(targets: CareerTargets | null | undefined): string {
  const family = inferRoleFamily(targets);
  switch (family) {
    case "sales":
      return "sales key account channel distributor institutional B2B manufacturing commercial revenue";
    case "plant_ops":
      return "production plant quality maintenance manufacturing operations lean TPM safety supervisor";
    case "trades":
      return "ITI diploma HVAC technician electrician fitter operator JCB driver manufacturing plant";
    case "hr_admin":
      return "HR human resources recruitment payroll admin office plant manufacturing";
    case "it_mfg":
      return "IT support network helpdesk SAP plant manufacturing SCADA MES system admin";
    case "healthcare":
      return "clinical hospital medical doctor physician healthcare patient care";
    case "procurement":
      return "procurement purchase SAP MM supply chain vendor negotiation manufacturing plant sourcing";
    default:
      return "manufacturing plant India careers jobs";
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
  if (!targets?.cities?.length) return true;
  if (targets.openToRelocate !== false) return true;
  const loc = (jobLocation || "").toLowerCase();
  if (!loc.trim()) return true;
  if (/remote|pan[\s-]?india|anywhere|multiple/i.test(loc)) return true;
  return targets.cities.some((c) => loc.includes(c.toLowerCase()));
}
