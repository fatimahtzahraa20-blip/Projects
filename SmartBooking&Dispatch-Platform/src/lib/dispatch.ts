import type { DispatchCandidate, Engineer, GeoPoint, Job } from "@/types/domain";

/** Haversine distance in km between two points. */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Rough drive-time estimate factoring urban routing (not straight line). */
export function estimateEtaMinutes(km: number): number {
  const routingFactor = 1.35; // roads aren't straight lines
  const avgSpeedKmh = 28; // urban average incl. traffic/lights
  return Math.max(4, Math.round(((km * routingFactor) / avgSpeedKmh) * 60));
}

/**
 * Ranks engineers for a job. This is a transparent, explainable scoring model -
 * not a black box - combining proximity, ETA, skill match, availability,
 * workload fairness and rating. Requires human confirmation before assignment.
 */
export function rankEngineersForJob(job: Job, engineers: Engineer[]): DispatchCandidate[] {
  const candidates = engineers.map((eng) => {
    const km = distanceKm(job.address, eng.position);
    const eta = estimateEtaMinutes(km);
    const skillMatch = eng.skills.includes(job.service);
    const workloadOk = eng.workloadToday < eng.maxWorkload;
    const availability =
      eng.status === "available" ? 1 : eng.status === "en_route" ? 0.5 : eng.status === "busy" ? 0.2 : 0;

    let score = 0;
    const reasons: string[] = [];

    if (skillMatch) {
      score += 40;
      reasons.push("Certified/skilled for this service");
    } else {
      score -= 60;
      reasons.push("No matching skill on file");
    }

    const proximityScore = Math.max(0, 25 - km);
    score += proximityScore;
    reasons.push(`${km.toFixed(1)} km away (~${eta} min drive)`);

    score += availability * 20;
    if (eng.status === "available") reasons.push("Currently available");
    if (eng.status === "en_route") reasons.push("Wrapping up a nearby job soon");
    if (eng.status === "busy") reasons.push("Currently on another job");
    if (eng.status === "offline") reasons.push("Off shift");

    const workloadRatio = eng.workloadToday / eng.maxWorkload;
    score += (1 - workloadRatio) * 10;
    if (workloadRatio > 0.85) reasons.push("Near daily workload limit");

    score += (eng.rating - 4) * 8;
    if (eng.rating >= 4.8) reasons.push(`Top-rated (${eng.rating.toFixed(1)}★)`);

    if (job.urgency === "emergency" && eng.status !== "available") {
      score -= 15;
      reasons.push("Emergency job needs immediate availability");
    }

    return {
      engineerId: eng.id,
      score: Math.round(score * 10) / 10,
      distanceKm: Math.round(km * 10) / 10,
      etaMinutes: eta,
      reasons,
      skillMatch,
      workloadOk,
    } satisfies DispatchCandidate;
  });

  return candidates.sort((a, b) => b.score - a.score);
}
