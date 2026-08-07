"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { JobStatusBadge, UrgencyBadge } from "@/components/common/status-badge";
import { JobTimeline } from "@/components/tracking/job-timeline";
import { JobChat } from "@/components/tracking/job-chat";
import { InvoicePanel } from "@/components/tracking/invoice-panel";
import { LiveMap } from "@/components/tracking/live-map";
import { SERVICES } from "@/lib/mock-data";
import { ServiceIcon } from "@/components/common/service-icon";

export default function DashboardJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const job = useAppStore((s) => s.jobs.find((j) => j.id === id));
  const engineers = useAppStore((s) => s.engineers);
  const invoice = useAppStore((s) => s.invoices.find((i) => i.jobId === id));
  const ensureInvoiceForJob = useAppStore((s) => s.ensureInvoiceForJob);

  if (!job) {
    return <p className="text-muted-foreground">Job not found.</p>;
  }

  const engineer = engineers.find((e) => e.id === job.engineerId) ?? null;
  const service = SERVICES.find((s) => s.id === job.service);
  const canInvoice = ["completed", "invoiced", "paid"].includes(job.status);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/dashboard/jobs" />}>
        <ArrowLeft className="h-3.5 w-3.5" /> All jobs
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            {service && <ServiceIcon name={service.icon} className="h-5 w-5" />}
          </span>
          <div>
            <h1 className="ref-code text-xl font-semibold">{job.reference}</h1>
            <p className="text-sm text-muted-foreground">{job.customerName} · {job.address.postcode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UrgencyBadge urgency={job.urgency} />
          <JobStatusBadge status={job.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <LiveMap job={job} engineer={engineer} />
          <div className="rounded-lg border border-border/80 p-5">
            <h2 className="font-medium">Progress</h2>
            <div className="mt-4"><JobTimeline job={job} /></div>
          </div>
          <div>
            <h2 className="mb-3 font-medium">Office chat</h2>
            <JobChat jobId={job.id} asSender="office" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border/80 p-5">
            <h2 className="text-sm font-medium">Customer</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="font-medium">{job.customerName}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {job.customerPhone}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {job.address.line1}, {job.address.postcode}</div>
            </div>
          </div>

          {engineer && (
            <div className="rounded-lg border border-border/80 p-5">
              <h2 className="text-sm font-medium">Assigned engineer</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{engineer.avatar}</span>
                <div>
                  <div className="font-medium">{engineer.name}</div>
                  <div className="text-xs text-muted-foreground">{engineer.vanReg} · {engineer.rating}★</div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border/80 p-5">
            <h2 className="text-sm font-medium">Issue</h2>
            <p className="mt-2 text-sm text-muted-foreground">{job.issue}</p>
            {job.accessNotes && <p className="mt-2 text-xs text-muted-foreground">Access: {job.accessNotes}</p>}
          </div>

          {canInvoice ? (
            invoice ? <InvoicePanel job={job} invoice={invoice} /> : (
              <Button variant="outline" className="w-full" onClick={() => ensureInvoiceForJob(job)}>Generate invoice</Button>
            )
          ) : (
            <p className="text-xs text-muted-foreground">Invoice available once the job is completed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
