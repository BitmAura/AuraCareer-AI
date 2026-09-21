/**
 * Shared location + keyword gates for portal / OEM scanners.
 */

import type { CareerTargets } from "@/lib/db/types";
import { packKeywordsForTargets } from "@/lib/product/targets";

const INDIA_LOC =
  /\bindia\b|bengaluru|bangalore|mumbai|pune|chennai|hyderabad|delhi|gurgaon|gurugram|noida|kolkata|ahmedabad|coimbatore|vadodara|nashik|jaipur|ncr\b|ballari|bellary|hosapete|hospet|hubli|hubballi|mysuru|mysore|mangaluru|mangalore|andhra pradesh|karnataka|maharashtra|tamil nadu|telangana|gujarat|uttar pradesh|madhya pradesh|rajasthan|kerala|odisha|west bengal|haryana|punjab/;

const NON_INDIA_LOC =
  /\b(united states|\busa\b|\bus\b|u\.s\.a?\b|canada|mexico|china|germany|europe|\buk\b|united kingdom|london|seattle|california|texas|new york|florida|illinois|massachusetts|washington|colorado|arizona|georgia|san francisco|los angeles|chicago|austin|boston|denver|atlanta|remote\s*[-–]\s*usa|remote\s*[-–]\s*us)\b|,\s*(ca|ny|tx|wa|il|ma|fl|co|az|ga|nj|nc|va|or|mi)\b/;

export function indiaRelevantLocation(
  location: string,
  targets?: CareerTargets | null,
): boolean {
  const loc = (location || "").toLowerCase().trim();
  if (!loc) return false;

  const isWorldwideTarget = (targets?.cities || []).some((c) =>
    /\b(worldwide|global|all)\b/i.test(c),
  );

  // If candidate is explicitly hunting worldwide/global, allow
  if (isWorldwideTarget) {
    return true;
  }

  // Explicit foreign/non-India location MUST be rejected unless worldwide is targeted
  if (NON_INDIA_LOC.test(loc)) {
    return false;
  }

  const cities = (targets?.cities || []).map((c) => c.toLowerCase().trim()).filter(Boolean);
  const isCityTargeted = cities.length > 0;

  // If candidate has specific target cities (e.g. Bangalore)
  if (isCityTargeted) {
    if (cities.some((c) => c && loc.includes(c))) {
      return true;
    }
    // Allow pan-India remote if candidate allows remote
    if (cities.includes("remote") && /\b(remote|work from home|wfh)\b/i.test(loc) && !NON_INDIA_LOC.test(loc)) {
      return true;
    }
    // If open to relocate is true, allow other verified Indian locations
    if (targets?.openToRelocate && INDIA_LOC.test(loc)) {
      return true;
    }
    return false;
  }

  // Fallback if no target cities set: must match India
  if (INDIA_LOC.test(loc)) return true;

  if (
    targets?.openToRelocate &&
    /\b(apac|asia)\b/i.test(loc) &&
    !NON_INDIA_LOC.test(loc)
  ) {
    return true;
  }
  return false;
}

export function profileKeywordHit(
  text: string,
  targets?: CareerTargets | null,
): boolean {
  const pack = packKeywordsForTargets(targets).toLowerCase();
  const role = (targets?.targetRole || "").toLowerCase();
  const hay = text.toLowerCase();
  const roleTokens = role
    .split(/[^a-z0-9+]+/)
    .filter(
      (t) =>
        t.length > 2 &&
        !["the", "and", "for", "with", "from", "india", "years", "year"].includes(t),
    );
  const distinctive = roleTokens.filter((t) =>
    /^(hvac|iti|lorry|jcb|electrician|fitter|welder|driver|refrigeration|crane|ac|technician|purchase|procurement|sales|hr|admin|marketing|seo|sem|growth|copywriter|content|analytics)$/.test(
      t,
    ),
  );
  if (distinctive.length && !distinctive.some((t) => hay.includes(t))) {
    return false;
  }
  const tokens = [...pack.split(/\s+/), ...roleTokens].filter(
    (t) => t.length > 3 && !["with", "from", "india", "years"].includes(t),
  );
  if (!tokens.length) return true;
  const hits = tokens.filter((t) => hay.includes(t)).length;
  return hits >= Math.min(2, tokens.length);
}
