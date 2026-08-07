"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { rankEngineersForJob } from "@/lib/dispatch";
import { demoDwellSeconds, nextDemoStatus } from "@/lib/simulate";
import type { Job } from "@/types/domain";

const TERMINAL: Job["status"][] = ["invoiced", "paid", "cancelled"];

/**
 * Demo-only automation: advances a job through lead -> ... -> invoiced on a
 * realistic (sped-up) timer so the tracking page feels live without needing
 * a dispatcher to manually click through every step.
 */
export function useJobSimulation(jobId: string | undefined) {
  const job = useAppStore((s) => s.jobs.find((j) => j.id === jobId));
  const engineers = useAppStore((s) => s.engineers);
  const assignEngineer = useAppStore((s) => s.assignEngineer);
  const addJobStatus = useAppStore((s) => s.addJobStatus);
  const ensureInvoiceForJob = useAppStore((s) => s.ensureInvoiceForJob);
  const sendMessage = useAppStore((s) => s.sendMessage);

  useEffect(() => {
    if (!job) return;
    if (TERMINAL.includes(job.status)) {
      if (job.status === "invoiced") ensureInvoiceForJob(job);
      return;
    }

    const lastEvent = job.timeline[job.timeline.length - 1];
    const elapsedSeconds = lastEvent ? (Date.now() - new Date(lastEvent.at).getTime()) / 1000 : 0;
    const dwell = demoDwellSeconds(job.status);
    const remainingMs = Math.max(500, (dwell - elapsedSeconds) * 1000);

    const timer = setTimeout(() => {
      if (job.status === "lead" && !job.engineerId) {
        const ranked = rankEngineersForJob(job, engineers);
        const best = ranked[0];
        if (best) {
          assignEngineer(job.id, best.engineerId);
          const eng = engineers.find((e) => e.id === best.engineerId);
          sendMessage({
            jobId: job.id,
            sender: "system",
            senderName: "TradeWeb",
            text: `${eng?.name ?? "An engineer"} has been matched to your job (AI dispatch: ${best.distanceKm}km away, ~${best.etaMinutes} min).`,
          });
        }
        return;
      }

      const next = nextDemoStatus(job.status);
      if (!next) return;
      addJobStatus(job.id, next);

      if (next === "en_route") {
        const eng = engineers.find((e) => e.id === job.engineerId);
        sendMessage({
          jobId: job.id,
          sender: "engineer",
          senderName: eng?.name ?? "Engineer",
          text: `On my way now — should be with you in around ${job.etaMinutes ?? 15} minutes.`,
        });
      }
      if (next === "arrived") {
        const eng = engineers.find((e) => e.id === job.engineerId);
        sendMessage({
          jobId: job.id,
          sender: "engineer",
          senderName: eng?.name ?? "Engineer",
          text: "I've arrived and I'm just parking up outside.",
        });
      }
      if (next === "invoiced") {
        ensureInvoiceForJob({ ...job, status: next });
      }
    }, remainingMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.status, job?.id, job?.timeline.length]);
}
