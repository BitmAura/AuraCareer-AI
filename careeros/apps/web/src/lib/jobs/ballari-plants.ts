/**
 * Ballari / Bellary–Hosapete industrial plant directory.
 * These employers hire locally but usually do NOT expose Workday/Greenhouse job APIs.
 * CareerOS uses this list for: search query enrichment, UI watchlist, paste guidance.
 */

export type BallariPlantHireMode =
  | "careers_page"
  | "walkin_form"
  | "email_resume"
  | "unknown";

export type BallariPlant = {
  id: string;
  name: string;
  area: string;
  careersUrl: string;
  hireMode: BallariPlantHireMode;
  notes: string;
};

/** Seed list — expand as founders verify more official careers URLs. */
export const BALLARI_PLANTS: BallariPlant[] = [
  {
    id: "jsw-vijayanagar",
    name: "JSW Steel — Vijayanagar Works",
    area: "Toranagallu / Vijayanagar, Ballari",
    careersUrl: "https://www.jsw.in/careers/",
    hireMode: "careers_page",
    notes:
      "Largest local steel employer. Hiring often via jsw.in careers marketing site, walk-ins, or Microsoft Forms — not a public Workday API we can poll.",
  },
  {
    id: "janki-corp",
    name: "Janki Corp (JCL) — Steel division",
    area: "Sidiginamola, Ballari",
    careersUrl: "https://www.jankicorp.com/careers/",
    hireMode: "email_resume",
    notes:
      "Careers page asks candidates to share resume — no structured job board / ATS feed found.",
  },
  {
    id: "minera",
    name: "Minera Steel & Power",
    area: "Ballari",
    careersUrl: "https://www.mineragroup.com/",
    hireMode: "email_resume",
    notes: "Local integrated steel/power — openings often via LinkedIn/email, not ATS API.",
  },
  {
    id: "kalyani-koppal",
    name: "Kalyani Steels (nearby Koppal)",
    area: "Ginigera, Koppal (near Ballari belt)",
    careersUrl: "https://www.kalyanisteels.com/",
    hireMode: "unknown",
    notes: "Regional steel — treat as nearby plant belt; verify openings on company site / paste JD.",
  },
];

const BALLARI_CITY =
  /\bballari\b|\bbellary\b|\btoranagallu\b|\bvijayanagar\b|\bhosapet[e]?\b|\bhospet\b|\bkoppal\b/i;

export function profileTargetsBallariBelt(
  cities: string[] | null | undefined,
  roleText?: string,
): boolean {
  const blob = [...(cities || []), roleText || ""].join(" ");
  return BALLARI_CITY.test(blob);
}

/** Company OR-clause for TinyFish / web backup when hunting Ballari belt. */
export function ballariPlantSearchClause(): string {
  return (
    '("JSW Vijayanagar" OR "JSW Steel" Ballari OR "Janki Corp" OR "Janki Corp Limited" OR ' +
    '"Minera Steel" Ballari OR "Kalyani Steels" Koppal)'
  );
}

export function ballariPlantNames(): string[] {
  return BALLARI_PLANTS.map((p) => p.name);
}
