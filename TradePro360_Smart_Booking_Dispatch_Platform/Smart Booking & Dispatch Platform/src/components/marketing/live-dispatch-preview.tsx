import { Radar } from "lucide-react";
import { ENGINEERS, JOBS } from "@/lib/mock-data";
import { rankEngineersForJob } from "@/lib/dispatch";

export function LiveDispatchPreview() {
  const job = JOBS.find((j) => j.id === "job-2")!;
  const ranked = rankEngineersForJob(job, ENGINEERS).slice(0, 3);

  return (
    <div className="docket p-4">
      <div className="flex items-center justify-between">
        <span className="eyebrow flex items-center gap-1.5 text-[11px] text-primary">
          <Radar className="h-3.5 w-3.5" /> AI dispatch — {job.reference}
        </span>
        <span className="text-xs text-muted-foreground">{job.address.postcode}</span>
      </div>
      <p className="mt-1.5 text-sm font-medium">{job.issue}</p>
      <div className="mt-3 space-y-2">
        {ranked.map((c, i) => {
          const eng = ENGINEERS.find((e) => e.id === c.engineerId)!;
          return (
            <div key={c.engineerId} className="flex items-center justify-between rounded-md border border-border/70 px-2.5 py-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {i + 1}
                </span>
                <span>{eng.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{c.distanceKm} km · ~{c.etaMinutes} min</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
