"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, LocateFixed, MapPin, Navigation, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { JobStatusBadge, UrgencyBadge } from "@/components/common/status-badge";
import { JobChat } from "@/components/tracking/job-chat";
import { LiveMap } from "@/components/tracking/live-map";
import type { JobStatus } from "@/types/domain";
import { distanceKm, estimateEtaMinutes } from "@/lib/dispatch";

const ACTIONS: Partial<Record<JobStatus, { next: JobStatus; label: string }>> = {
  assigned: { next: "en_route", label: "Start driving" },
  en_route: { next: "arrived", label: "Mark arrived" },
  arrived: { next: "in_progress", label: "Start job" },
  in_progress: { next: "completed", label: "Mark completed" },
  completed: { next: "invoiced", label: "Send invoice" },
};

export default function EngineerJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const job = useAppStore((s) => s.jobs.find((j) => j.id === id));
  const addJobStatus = useAppStore((s) => s.addJobStatus);
  const ensureInvoiceForJob = useAppStore((s) => s.ensureInvoiceForJob);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const updateJob = useAppStore((s) => s.updateJob);
  const updateEngineerPosition = useAppStore((s) => s.updateEngineerPosition);
  const engineer = useAppStore((s) => s.engineers.find((e) => e.id === job?.engineerId));
  const [sharingLocation, setSharingLocation] = useState(false);
  const watchId = useRef<number | null>(null);

  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
  }, []);

  if (!job) return <p className="px-4 py-6 text-muted-foreground">Job not found.</p>;

  const action = ACTIONS[job.status];

  function advance() {
    if (!job || !action) return;
    addJobStatus(job.id, action.next);
    if (action.next === "invoiced") ensureInvoiceForJob({ ...job, status: "invoiced" });
    if (action.next === "en_route") {
      sendMessage({ jobId: job.id, sender: "engineer", senderName: engineer?.name ?? "Engineer", text: "On my way now." });
    }
    if (action.next === "completed") {
      sendMessage({ jobId: job.id, sender: "engineer", senderName: engineer?.name ?? "Engineer", text: "All done — invoice on its way shortly." });
    }
  }

  function toggleLocationSharing() {
    if (!engineer || !job || !navigator.geolocation) {
      toast.error("Location is not available on this device.");
      return;
    }
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setSharingLocation(false);
      return;
    }
    watchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        updateEngineerPosition(engineer.id, coords.latitude, coords.longitude);
        updateJob(job.id, { etaMinutes: estimateEtaMinutes(distanceKm(job.address, { lat: coords.latitude, lng: coords.longitude })) });
        setSharingLocation(true);
      },
      (error) => {
        watchId.current = null;
        setSharingLocation(false);
        toast.error(error.code === error.PERMISSION_DENIED ? "Allow location access to share live GPS." : "Your GPS position could not be read.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => router.push("/engineer")} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Today’s queue
      </button>

      <div className="flex items-center justify-between">
        <span className="ref-code text-lg font-semibold">{job.reference}</span>
        <div className="flex items-center gap-2"><UrgencyBadge urgency={job.urgency} /><JobStatusBadge status={job.status} /></div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{job.issue}</p>

      <div className="mt-4"><LiveMap job={job} engineer={engineer ?? null} /></div>

      <Button variant={sharingLocation ? "default" : "outline"} className="mt-3 w-full" onClick={toggleLocationSharing}>
        <LocateFixed className="h-4 w-4" /> {sharingLocation ? "Live GPS sharing on — tap to stop" : "Start live GPS sharing"}
      </Button>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/80 p-3 text-sm">
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span>{job.address.line1}, {job.address.city} {job.address.postcode}</span>
      </div>
      {job.accessNotes && (
        <p className="mt-2 rounded-md bg-muted/60 p-2.5 text-xs text-muted-foreground">Access: {job.accessNotes}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" className="w-full" render={<a href={`tel:${job.customerPhone.replace(/\s/g, "")}`} />}>
          <Phone className="h-4 w-4" /> Call customer
        </Button>
        <Button variant="outline" className="w-full" render={<a href={`https://www.google.com/maps/search/?api=1&query=${job.address.lat},${job.address.lng}`} target="_blank" rel="noreferrer" />}>
          <Navigation className="h-4 w-4" /> Directions
        </Button>
      </div>

      {action && (
        <Button className="mt-4 w-full" size="lg" onClick={advance}>
          <CheckCircle2 className="h-4 w-4" /> {action.label}
        </Button>
      )}

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-medium">Message customer</h2>
        <JobChat jobId={job.id} asSender="engineer" />
      </div>
    </div>
  );
}
