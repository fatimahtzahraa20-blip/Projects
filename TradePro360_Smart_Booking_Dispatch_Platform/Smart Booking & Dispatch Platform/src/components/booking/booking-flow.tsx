"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SERVICES } from "@/lib/mock-data";
import { calculateQuote, formatGBP } from "@/lib/pricing";
import { rankEngineersForJob } from "@/lib/dispatch";
import { useAppStore } from "@/store/app-store";
import { ServiceIcon } from "@/components/common/service-icon";
import { UrgencyBadge } from "@/components/common/status-badge";
import type { Job, ServiceCategory, Urgency } from "@/types/domain";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Location & service", "Issue", "Schedule", "Your details", "Review"];

function generateJobReference() {
  return `TW-${Math.floor(40000 + Math.random() * 9000)}`;
}

function generateDraftId() {
  return `new-${Date.now()}`;
}

function buildSlots() {
  return nextSlots();
}

function nextSlots() {
  const slots: { label: string; start: Date; end: Date }[] = [];
  const now = new Date();
  for (let d = 1; d <= 4 && slots.length < 6; d++) {
    for (const [startH, endH] of [[9, 11], [11, 13], [14, 16], [16, 18]] as const) {
      const start = new Date(now);
      start.setDate(start.getDate() + d);
      start.setHours(startH, 0, 0, 0);
      const end = new Date(start);
      end.setHours(endH, 0, 0, 0);
      slots.push({
        label: `${start.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}, ${startH}:00–${endH}:00`,
        start,
        end,
      });
      if (slots.length >= 6) break;
    }
  }
  return slots;
}

export function BookingFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const addJob = useAppStore((s) => s.addJob);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const engineers = useAppStore((s) => s.engineers);
  const customers = useAppStore((s) => s.customers);
  const brand = useAppStore((s) => s.brand);

  const source = params.get("source");
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [service, setService] = useState<ServiceCategory>((params.get("service") as ServiceCategory) || "plumbing");
  const [postcode, setPostcode] = useState(params.get("postcode") || "");
  const [addressLine, setAddressLine] = useState("");
  const [urgency, setUrgency] = useState<Urgency>((params.get("urgency") as Urgency) || "today");
  const [issue, setIssue] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [slotIndex, setSlotIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accessNotes, setAccessNotes] = useState("");
  const [consent, setConsent] = useState(false);

  const slots = useMemo(() => buildSlots(), []);
  const [lat, setLat] = useState(Number(params.get("lat")) || 51.5074);
  const [lng, setLng] = useState(Number(params.get("lng")) || -0.1278);
  const [locating, setLocating] = useState(false);

  const quote = useMemo(() => calculateQuote(service, urgency, 1.5, []), [service, urgency]);

  const draftJob: Job = useMemo(() => {
    const now = new Date();
    return {
      id: "draft",
      reference: "TP-DRAFT",
      customerId: "cus-new",
      customerName: name || "New customer",
      customerEmail: email.trim().toLowerCase(),
      customerPhone: phone,
      address: { line1: addressLine || "New job address", city: "London", postcode: postcode || "SW1A 1AA", lat, lng },
      service,
      issue,
      urgency,
      status: "lead",
      createdAt: now.toISOString(),
      scheduledWindow: null,
      engineerId: null,
      etaMinutes: null,
      priceEstimate: { low: quote.subtotal * 0.85, high: quote.total },
      photos,
      notes: "",
      timeline: [],
    };
  }, [name, email, phone, addressLine, postcode, lat, lng, service, issue, urgency, quote, photos]);

  const ranked = useMemo(() => rankEngineersForJob(draftJob, engineers).slice(0, 3), [draftJob, engineers]);
  const topEngineer = engineers.find((e) => e.id === ranked[0]?.engineerId);

  function onPhotoUpload(files: FileList | null) {
    if (!files) return;
    Array.from(files).slice(0, 4 - photos.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLat(coords.latitude);
        setLng(coords.longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  const canProceed = [
    !!postcode && !!service,
    !!issue.trim(),
    urgency === "emergency" || slotIndex !== null,
    !!name.trim() && !!email.trim() && !!phone.trim() && consent,
    true,
  ][step];

  async function submit() {
    setSubmitting(true);
    const reference = generateJobReference();
    const chosenSlot = slotIndex !== null ? slots[slotIndex] : null;
    const bestMatch = ranked.find((candidate) => candidate.skillMatch && candidate.workloadOk);
    const existingCustomer = customers.find((customer) => customer.email.toLowerCase() === email.trim().toLowerCase());
    const job: Job = {
      ...draftJob,
      id: generateDraftId(),
      reference,
      customerId: existingCustomer?.id ?? `cus-${email.trim().toLowerCase()}`,
      customerEmail: email.trim().toLowerCase(),
      status: bestMatch ? "assigned" : "unassigned",
      engineerId: bestMatch?.engineerId ?? null,
      etaMinutes: bestMatch?.etaMinutes ?? null,
      scheduledWindow: chosenSlot ? { start: chosenSlot.start.toISOString(), end: chosenSlot.end.toISOString() } : null,
      accessNotes,
      timeline: [
        { status: "lead", at: new Date().toISOString(), note: source === "gmb" ? "Booked via Google Business Profile" : "Booked via website" },
        { status: bestMatch ? "assigned" : "unassigned", at: new Date().toISOString(), note: bestMatch ? "Automatically assigned to the highest-ranked available technician" : "Awaiting dispatcher assignment" },
      ],
    };
    await new Promise((resolve) => setTimeout(resolve, 900));
    addJob(job);
    if (bestMatch) {
      const matchedEngineer = engineers.find((candidate) => candidate.id === bestMatch.engineerId);
      sendMessage({
        jobId: job.id,
        sender: "system",
        senderName: brand.companyName,
        text: `${matchedEngineer?.name ?? "A technician"} was automatically assigned (${bestMatch.distanceKm} km away, estimated ${bestMatch.etaMinutes} minutes).`,
      });
    }

    try {
      const response = await fetch("/api/email/booking-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          reference: job.reference,
          service: SERVICES.find((item) => item.id === service)?.name ?? service,
          address: `${job.address.line1}, ${job.address.city} ${job.address.postcode}`,
          scheduledFor: urgency === "emergency" ? "As soon as possible" : chosenSlot?.label ?? "To be confirmed",
          priceLow: job.priceEstimate.low,
          priceHigh: job.priceEstimate.high,
        }),
      });

      if (!response.ok) {
        console.error("Booking saved, but confirmation email was not sent.");
      }
    } catch (error) {
      console.error("Booking saved, but confirmation email could not be requested.", error);
    }

    router.push(`/track/${job.reference}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {source === "gmb" && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-primary">
          <MapPin className="h-4 w-4" /> Continuing from your Google Business Profile — location prefilled.
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {STEP_LABELS.map((label, i) => (
            <span key={label} className={cn("hidden sm:block", i === step && "font-medium text-foreground")}>
              {label}
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-2">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-heading text-2xl font-semibold">Where and what’s the job?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Postcode</Label>
                  <Input value={postcode} onChange={(e) => setPostcode(e.target.value.toUpperCase())} placeholder="SW1A 1AA" />
                </div>
                <div className="space-y-1.5">
                  <Label>Address line (optional)</Label>
                  <Input value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="14 Maple Street, London" />
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={useCurrentLocation} disabled={locating}>
                <MapPin className="h-4 w-4" /> {locating ? "Finding your location…" : "Use my current GPS location"}
              </Button>
              <div className="space-y-2">
                <Label>Service needed</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setService(s.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-xs transition-colors",
                        service === s.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted",
                      )}
                    >
                      <ServiceIcon name={s.icon} className="h-5 w-5" />
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-heading text-2xl font-semibold">Tell us what’s happening</h2>
              <div className="space-y-2">
                <Label>How urgent is this?</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["emergency", "today", "scheduled"] as Urgency[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={cn(
                        "rounded-md border px-3 py-2.5 text-sm capitalize transition-colors",
                        urgency === u ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                      )}
                    >
                      <UrgencyBadge urgency={u} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Describe the issue</Label>
                <Textarea value={issue} onChange={(e) => setIssue(e.target.value)} rows={4} placeholder="e.g. Kitchen tap dripping constantly, water pooling under the sink." />
              </div>
              <div className="space-y-1.5">
                <Label>Photos (optional, up to 4)</Label>
                <div className="flex flex-wrap gap-2">
                  {photos.map((p, i) => (
                    <div key={i} className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt="Uploaded job photo" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute right-0.5 top-0.5 rounded-full bg-background/90 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 4 && (
                    <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      <span className="text-[10px]">Add</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onPhotoUpload(e.target.files)} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-heading text-2xl font-semibold">When works for you?</h2>
              {urgency === "emergency" ? (
                <div className="rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
                  Emergency jobs are dispatched immediately — we’ll match the nearest available engineer as
                  soon as you confirm your details.
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {slots.map((slot, i) => (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() => setSlotIndex(i)}
                      className={cn(
                        "rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                        slotIndex === i ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                      )}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-heading text-2xl font-semibold">Your details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jamie Cooper" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 900123" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="amelia@example.co.uk" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Access notes for the engineer (optional)</Label>
                  <Textarea value={accessNotes} onChange={(e) => setAccessNotes(e.target.value)} rows={2} placeholder="e.g. Ring buzzer for flat 2, dog in the garden." />
                </div>
              </div>
              <label className="flex items-start gap-2.5 text-sm">
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
                <span>
                  I agree to be contacted about this job and consent to sharing my location with the assigned
                  engineer for live tracking.
                </span>
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-heading text-2xl font-semibold">Review & confirm</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{SERVICES.find((s) => s.id === service)?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Urgency</span><UrgencyBadge urgency={urgency} /></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{postcode || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">When</span><span className="font-medium">{urgency === "emergency" ? "ASAP" : slotIndex !== null ? slots[slotIndex].label : "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-medium">{name || "—"}</span></div>
                  <p className="rounded-md bg-muted/50 p-3 text-muted-foreground">{issue || "No description provided."}</p>
                </div>
                <div className="docket p-4">
                  <span className="eyebrow text-[11px] text-muted-foreground">Estimated price</span>
                  <div className="font-heading text-2xl font-semibold">
                    {formatGBP(draftJob.priceEstimate.low)} – {formatGBP(draftJob.priceEstimate.high)}
                  </div>
                  <div className="docket-stub my-3" />
                  {topEngineer ? (
                    <div>
                      <span className="eyebrow text-[11px] text-muted-foreground">Likely engineer</span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{topEngineer.avatar}</span>
                        <div>
                          <div className="text-sm font-medium">{topEngineer.name}</div>
                          <div className="text-xs text-muted-foreground">{ranked[0].etaMinutes} min away · {topEngineer.rating}★</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Engineer confirmed once you submit.</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Final price is confirmed by your {brand.companyName} engineer on site. No payment is taken now.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {step < STEP_LABELS.length - 1 ? (
          <Button disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={submitting} onClick={submit}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {submitting ? "Confirming…" : "Confirm booking"}
          </Button>
        )}
      </div>
    </div>
  );
}
