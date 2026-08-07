import { Check } from "lucide-react";
import { JOB_PIPELINE, STATUS_LABEL } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/domain";

export function JobTimeline({ job }: { job: Job }) {
  const currentIdx = JOB_PIPELINE.indexOf(job.status);

  return (
    <ol className="space-y-0">
      {JOB_PIPELINE.map((status, i) => {
        const done = currentIdx >= 0 && i <= currentIdx;
        const isCurrent = i === currentIdx;
        const event = job.timeline.find((t) => t.status === status);
        const isLast = i === JOB_PIPELINE.length - 1;
        return (
          <li key={status} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-full w-px",
                  done && i < currentIdx ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px]",
                done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground",
                isCurrent && "ring-4 ring-primary/15",
              )}
            >
              {done ? <Check className="h-3 w-3" /> : null}
            </span>
            <div className="pt-0.5">
              <div className={cn("text-sm font-medium", !done && "text-muted-foreground")}>
                {STATUS_LABEL[status]}
              </div>
              {event && (
                <div className="text-xs text-muted-foreground">
                  {new Date(event.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  {event.note ? ` · ${event.note}` : ""}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
