import { describe, expect, it } from "vitest";

import { ENGINEERS, JOBS } from "@/lib/mock-data";
import { distanceKm, estimateEtaMinutes, rankEngineersForJob } from "@/lib/dispatch";

describe("dispatch engine", () => {
  it("calculates zero distance for the same GPS position", () => {
    const point = { lat: 24.8607, lng: 67.0011 };
    expect(distanceKm(point, point)).toBe(0);
    expect(estimateEtaMinutes(0)).toBe(4);
  });

  it("ranks candidates from highest to lowest score", () => {
    const ranked = rankEngineersForJob(JOBS[0], ENGINEERS);

    expect(ranked).toHaveLength(ENGINEERS.length);
    expect(ranked.every((candidate, index) => index === 0 || ranked[index - 1].score >= candidate.score)).toBe(true);
  });

  it("favours an available, qualified nearby engineer", () => {
    const ranked = rankEngineersForJob(JOBS[0], ENGINEERS);
    const best = ranked[0];
    const engineer = ENGINEERS.find((candidate) => candidate.id === best.engineerId);

    expect(best.skillMatch).toBe(true);
    expect(engineer?.status).toBe("available");
    expect(engineer?.skills).toContain(JOBS[0].service);
    expect(best.reasons.length).toBeGreaterThan(1);
  });
});
