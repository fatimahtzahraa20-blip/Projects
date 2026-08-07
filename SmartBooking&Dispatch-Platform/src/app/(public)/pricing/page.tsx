"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICES } from "@/lib/mock-data";
import { calculateQuote, formatGBP, partsFor } from "@/lib/pricing";
import type { ServiceCategory, Urgency } from "@/types/domain";

function PricingCalculator() {
  const params = useSearchParams();
  const initialService = (params.get("service") as ServiceCategory) || "plumbing";

  const [service, setService] = useState<ServiceCategory>(initialService);
  const [urgency, setUrgency] = useState<Urgency>("today");
  const [hours, setHours] = useState(1.5);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const availableParts = partsFor(service);
  const quote = calculateQuote(service, urgency, hours, selectedParts);

  const togglePart = (id: string) =>
    setSelectedParts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="eyebrow text-sm text-primary">Dynamic pricing</span>
      <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
        See an instant, itemised UK quote
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pricing pulls visit fee, labour rate and local parts costs for the service you pick. This is
        an estimate — your engineer confirms the final price on site before starting work.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Service</Label>
                  <Select value={service} onValueChange={(v) => { setService(v as ServiceCategory); setSelectedParts([]); }}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>When do you need it?</Label>
                  <Select value={urgency} onValueChange={(v) => setUrgency(v as Urgency)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled (book ahead)</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="emergency">Emergency (ASAP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Estimated labour time</Label>
                <Select value={String(hours)} onValueChange={(v) => setHours(Number(v))}>
                  <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[0.5, 1, 1.5, 2, 3, 4, 6].map((h) => (
                      <SelectItem key={h} value={String(h)}>{h} hour{h !== 1 ? "s" : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Likely parts (optional)</Label>
                {availableParts.length === 0 && (
                  <p className="text-sm text-muted-foreground">No common parts catalogued for this service.</p>
                )}
                <div className="space-y-2">
                  {availableParts.map((p) => (
                    <label key={p.id} className="flex items-center justify-between gap-3 rounded-md border border-border/80 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2.5">
                        <Checkbox
                          checked={selectedParts.includes(p.id)}
                          onCheckedChange={() => togglePart(p.id)}
                        />
                        <span>
                          {p.name}
                          <span className="block text-xs text-muted-foreground">{p.supplier} · updated {p.lastUpdated}</span>
                        </span>
                      </span>
                      <span className="ref-code shrink-0 font-medium">{formatGBP(p.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 rounded-md border border-dashed border-border/80 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Part prices are refreshed from our UK supplier catalogue daily and are shown with their last-updated
            date — this demo uses a cached snapshot rather than a live supplier connection.
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="docket p-6">
            <span className="eyebrow text-xs text-muted-foreground">Estimated quote</span>
            <h2 className="mt-1 font-heading text-3xl font-semibold">{formatGBP(quote.total)}</h2>
            <p className="text-xs text-muted-foreground">Includes VAT at 20%</p>

            <div className="docket-stub my-4" />

            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Call-out fee</dt>
                <dd>{formatGBP(quote.callOut)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Labour ({quote.labourHours}h{quote.urgencyPremium > 0 ? `, +${urgency} premium` : ""})</dt>
                <dd>{formatGBP(quote.labour)}</dd>
              </div>
              {quote.parts.map((p) => (
                <div key={p.name} className="flex justify-between">
                  <dt className="text-muted-foreground">{p.name}</dt>
                  <dd>{formatGBP(p.price)}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-border/70 pt-2.5">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatGBP(quote.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">VAT (20%)</dt>
                <dd>{formatGBP(quote.vat)}</dd>
              </div>
              <div className="flex justify-between border-t border-border/70 pt-2.5 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatGBP(quote.total)}</dd>
              </div>
            </dl>

            <Button className="mt-6 w-full" render={<Link href={`/booking?service=${service}&urgency=${urgency}`} />}>
              Book this job <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingCalculator />
    </Suspense>
  );
}
