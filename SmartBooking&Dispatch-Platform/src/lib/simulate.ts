import type { GeoPoint, Job, JobStatus } from "@/types/domain";
import { JOB_PIPELINE } from "@/lib/status";

/** Order jobs progress through automatically in this demo environment. */
export function nextDemoStatus(status: JobStatus): JobStatus | null {
  const idx = JOB_PIPELINE.indexOf(status);
  if (idx === -1 || idx === JOB_PIPELINE.length - 1) return null;
  return JOB_PIPELINE[idx + 1];
}

/** Seconds to wait (demo-paced, not real-world) before advancing to the next status. */
export function demoDwellSeconds(status: JobStatus): number {
  switch (status) {
    case "lead":
      return 4;
    case "quoted":
      return 5;
    case "approved":
      return 4;
    case "assigned":
      return 6;
    case "en_route":
      return 18;
    case "arrived":
      return 5;
    case "in_progress":
      return 14;
    case "completed":
      return 6;
    case "invoiced":
      return 999999; // wait for customer payment action
    default:
      return 8;
  }
}

/** Interpolates an engineer's position along a straight line toward the job address, based on elapsed time. */
export function interpolatePosition(
  from: GeoPoint,
  to: GeoPoint,
  startedAt: number,
  durationMs: number,
  now: number,
): GeoPoint {
  const t = Math.min(1, Math.max(0, (now - startedAt) / durationMs));
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

export function progressFraction(job: Job): number {
  const idx = JOB_PIPELINE.indexOf(job.status);
  if (idx === -1) return 0;
  return idx / (JOB_PIPELINE.length - 1);
}
