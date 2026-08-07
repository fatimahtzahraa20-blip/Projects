import { cn } from "@/lib/utils";
import { STATUS_LABEL, STATUS_TONE, URGENCY_LABEL, URGENCY_TONE, toneClasses } from "@/lib/status";
import type { JobStatus, Urgency } from "@/types/domain";

export function JobStatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses(STATUS_TONE[status]),
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function UrgencyBadge({ urgency, className }: { urgency: Urgency; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses(URGENCY_TONE[urgency]),
        className,
      )}
    >
      {URGENCY_LABEL[urgency]}
    </span>
  );
}
