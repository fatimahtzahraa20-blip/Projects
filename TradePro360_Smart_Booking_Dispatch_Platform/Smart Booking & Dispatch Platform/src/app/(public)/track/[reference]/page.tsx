"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Phone, MapPin, ShieldCheck, Star, Upload, X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { LiveMap } from "@/components/tracking/live-map";
import { JobTimeline } from "@/components/tracking/job-timeline";
import { JobChat } from "@/components/tracking/job-chat";
import { InvoicePanel } from "@/components/tracking/invoice-panel";
import { RatingWidget } from "@/components/tracking/rating-widget";
import { JobStatusBadge, UrgencyBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/mock-data";
import { ServiceIcon } from "@/components/common/service-icon";

export default function TrackPage() {
  const params = useParams<{ reference: string }>();
  const job = useAppStore((s) => s.jobs.find((j) => j.reference === params.reference));
  const engineers = useAppStore((s) => s.engineers);
  const updateJob = useAppStore((s) => s.updateJob);
  const invoice = useAppStore((s) => s.invoices.find((i) => i.jobId === job?.id));

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">We can’t find that job</h1>
        <p className="mt-2 text-muted-foreground">Double-check the link, or start a new booking.</p>
        <Button className="mt-6" render={<Link href="/booking" />}>Book a job</Button>
      </div>
    );
  }

  const engineer = engineers.find((e) => e.id === job.engineerId) ?? null;
  const service = SERVICES.find((s) => s.id === job.service);
  const isDone = ["completed", "invoiced", "paid"].includes(job.status);

  function onPhotoUpload(files: FileList | null) {
    if (!files || !job) return;
    Array.from(files)
      .slice(0, 4 - job.photos.length)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => updateJob(job.id, { photos: [...job.photos, reader.result as string] });
        reader.readAsDataURL(file);
      });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              {service && <ServiceIcon name={service.icon} className="h-4.5 w-4.5" />}
            </span>
            <div>
              <h1 className="ref-code text-xl font-semibold">{job.reference}</h1>
              <p className="text-sm text-muted-foreground">{service?.name} · {job.address.postcode}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UrgencyBadge urgency={job.urgency} />
          <JobStatusBadge status={job.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <LiveMap job={job} engineer={engineer} />

          {engineer && (
            <div className="flex items-center justify-between rounded-lg border border-border/80 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {engineer.avatar}
                </span>
                <div>
                  <div className="font-medium">{engineer.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" /> {engineer.rating} · {engineer.vanReg}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {job.etaMinutes && job.status === "en_route" && (
                  <span className="text-sm font-medium text-primary">ETA {job.etaMinutes} min</span>
                )}
                <Button variant="outline" size="icon" aria-label="Call engineer" render={<a href={`tel:${engineer.phone.replace(/\s/g, "")}`} />}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border/80 p-5">
            <h2 className="font-medium">Job progress</h2>
            <div className="mt-4">
              <JobTimeline job={job} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-medium">Message {engineer ? engineer.name.split(" ")[0] : "the office"}</h2>
            <JobChat jobId={job.id} asSender="customer" />
          </div>

          {isDone && <RatingWidget job={job} />}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border/80 p-5">
            <h2 className="text-sm font-medium">Job details</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Issue</dt>
                <dd className="text-right">{job.issue || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Address</dt>
                <dd className="text-right">{job.address.line1}, {job.address.postcode}</dd>
              </div>
              {job.scheduledWindow && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Window</dt>
                  <dd className="text-right">
                    {new Date(job.scheduledWindow.start).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Estimate</dt>
                <dd className="text-right">{new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(job.priceEstimate.low)}–{new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(job.priceEstimate.high)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border/80 p-5">
            <h2 className="text-sm font-medium">Photos</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.photos.map((p, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="Job photo" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => updateJob(job.id, { photos: job.photos.filter((_, idx) => idx !== i) })}
                    className="absolute right-0.5 top-0.5 rounded-full bg-background/90 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {job.photos.length < 4 && (
                <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground hover:bg-muted">
                  <Upload className="h-4 w-4" />
                  <span className="text-[10px]">Add</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onPhotoUpload(e.target.files)} />
                </label>
              )}
            </div>
          </div>

          {invoice && <InvoicePanel job={job} invoice={invoice} />}

          <div className="flex items-center gap-2 rounded-md border border-dashed border-border/80 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Bookmark this page — it’s your live link to track this job any time.
          </div>
        </div>
      </div>
    </div>
  );
}
