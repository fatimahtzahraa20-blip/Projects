"use client";

import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { JobStatusBadge, UrgencyBadge } from "@/components/common/status-badge";
import { SERVICES } from "@/lib/mock-data";
import { ServiceIcon } from "@/components/common/service-icon";

const DEMO_ENGINEER_ID = "eng-1";

export default function EngineerQueuePage() {
  const jobs = useAppStore((s) => s.jobs);
  const engineer = useAppStore((s) => s.engineers.find((e) => e.id === DEMO_ENGINEER_ID));

  const myJobs = jobs
    .filter((j) => j.engineerId === DEMO_ENGINEER_ID && !["invoiced", "paid", "cancelled"].includes(j.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-border/80 p-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {engineer?.avatar}
        </span>
        <div>
          <div className="font-medium">{engineer?.name}</div>
          <div className="text-xs text-muted-foreground">{myJobs.length} job{myJobs.length !== 1 ? "s" : ""} today · {engineer?.vanReg}</div>
        </div>
      </div>

      <h1 className="mb-2 text-sm font-medium text-muted-foreground">Today’s queue</h1>
      <div className="space-y-2">
        {myJobs.map((job) => {
          const service = SERVICES.find((s) => s.id === job.service);
          return (
            <Link
              key={job.id}
              href={`/engineer/jobs/${job.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/80 p-3 active:bg-muted"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {service && <ServiceIcon name={service.icon} className="h-5 w-5" />}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="ref-code text-sm font-medium">{job.reference}</span>
                    <UrgencyBadge urgency={job.urgency} />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {job.address.postcode}
                  </p>
                  <div className="mt-1"><JobStatusBadge status={job.status} /></div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
        {myJobs.length === 0 && (
          <p className="rounded-lg border border-dashed border-border/80 p-6 text-center text-sm text-muted-foreground">
            No jobs queued right now.
          </p>
        )}
      </div>
    </div>
  );
}
