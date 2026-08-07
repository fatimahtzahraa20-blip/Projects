"use client";

import { useState } from "react";
import { Radar, MapPin, Star, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/app-store";
import { rankEngineersForJob } from "@/lib/dispatch";
import { JobStatusBadge, UrgencyBadge } from "@/components/common/status-badge";
import { SERVICES } from "@/lib/mock-data";
import { ServiceIcon } from "@/components/common/service-icon";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/domain";

export default function DispatchBoardPage() {
  const jobs = useAppStore((s) => s.jobs);
  const engineers = useAppStore((s) => s.engineers);
  const assignEngineer = useAppStore((s) => s.assignEngineer);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const queue = jobs
    .filter((j) => !["completed", "invoiced", "paid", "cancelled"].includes(j.status))
    .sort((a, b) => {
      const urgencyRank = { emergency: 0, today: 1, scheduled: 2 };
      if (!a.engineerId !== !b.engineerId) return a.engineerId ? 1 : -1;
      return urgencyRank[a.urgency] - urgencyRank[b.urgency];
    });

  const ranked = activeJob ? rankEngineersForJob(activeJob, engineers) : [];

  function confirmAssign(jobId: string, engineerId: string, engineerName: string) {
    assignEngineer(jobId, engineerId);
    toast.success("Engineer assigned", { description: `${engineerName} has been dispatched to the job.` });
    setActiveJob(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Radar className="h-5 w-5 text-primary" />
        <h1 className="font-heading text-2xl font-semibold">Live dispatch board</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Jobs are queued by urgency and assignment status. Click a job to see the AI’s ranked, explainable
        engineer recommendations — you confirm every assignment.
      </p>

      <div className="space-y-3">
        {queue.map((job) => {
          const service = SERVICES.find((s) => s.id === job.service);
          const engineer = engineers.find((e) => e.id === job.engineerId);
          return (
            <Card key={job.id} className={cn(!job.engineerId && job.urgency === "emergency" && "border-destructive/40")}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {service && <ServiceIcon name={service.icon} className="h-5 w-5" />}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="ref-code text-sm font-medium">{job.reference}</span>
                      <UrgencyBadge urgency={job.urgency} />
                      <JobStatusBadge status={job.status} />
                    </div>
                    <p className="mt-0.5 max-w-md text-sm text-muted-foreground">{job.issue}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {job.address.postcode} · {job.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {engineer ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{engineer.avatar}</span>
                      {engineer.name}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                  <Button size="sm" variant={engineer ? "outline" : "default"} onClick={() => setActiveJob(job)}>
                    <Sparkles className="h-3.5 w-3.5" /> {engineer ? "Reassign" : "AI dispatch"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {queue.length === 0 && (
          <Card><CardContent className="py-10 text-center text-muted-foreground">No active jobs in the queue.</CardContent></Card>
        )}
      </div>

      <Dialog open={!!activeJob} onOpenChange={(open) => !open && setActiveJob(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI-ranked engineers for {activeJob?.reference}</DialogTitle>
            <DialogDescription>Ranked by skill match, distance, ETA, current workload and rating.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {ranked.map((c, i) => {
              const eng = engineers.find((e) => e.id === c.engineerId)!;
              return (
                <div key={c.engineerId} className={cn("rounded-lg border p-3", i === 0 ? "border-primary/40 bg-primary/5" : "border-border/80")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{eng.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          {eng.name}
                          {i === 0 && <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">Best match</span>}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-warning text-warning" /> {eng.rating} · {c.distanceKm}km · ~{c.etaMinutes} min
                        </div>
                      </div>
                    </div>
                    <Button size="sm" disabled={!c.skillMatch} onClick={() => confirmAssign(activeJob!.id, eng.id, eng.name)}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Assign
                    </Button>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {c.reasons.map((r) => (
                      <li key={r} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{r}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
