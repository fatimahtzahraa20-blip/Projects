import type { JobStatus, Urgency } from "@/types/domain";

export const STATUS_LABEL: Record<JobStatus, string> = {
  lead: "New lead",
  quote_requested: "Quote requested",
  quoted: "Quoted",
  approved: "Approved",
  unassigned: "Unassigned",
  assigned: "Assigned",
  en_route: "Engineer en route",
  arrived: "Engineer arrived",
  in_progress: "In progress",
  paused: "Paused",
  completed: "Completed",
  invoiced: "Invoiced",
  paid: "Paid",
  cancelled: "Cancelled",
};

export const STATUS_TONE: Record<JobStatus, "muted" | "info" | "warning" | "success" | "danger"> = {
  lead: "muted",
  quote_requested: "muted",
  quoted: "info",
  approved: "info",
  unassigned: "warning",
  assigned: "info",
  en_route: "warning",
  arrived: "warning",
  in_progress: "info",
  paused: "warning",
  completed: "success",
  invoiced: "info",
  paid: "success",
  cancelled: "danger",
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  emergency: "Emergency",
  today: "Same day",
  scheduled: "Scheduled",
};

export const URGENCY_TONE: Record<Urgency, "danger" | "warning" | "muted"> = {
  emergency: "danger",
  today: "warning",
  scheduled: "muted",
};

export const JOB_PIPELINE: JobStatus[] = [
  "lead",
  "quoted",
  "approved",
  "assigned",
  "en_route",
  "arrived",
  "in_progress",
  "completed",
  "invoiced",
  "paid",
];

export function toneClasses(tone: "muted" | "info" | "warning" | "success" | "danger"): string {
  switch (tone) {
    case "success":
      return "bg-success/15 text-success border-success/30";
    case "warning":
      return "bg-warning/20 text-warning border-warning/40";
    case "danger":
      return "bg-destructive/15 text-destructive border-destructive/30";
    case "info":
      return "bg-primary/10 text-primary border-primary/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
