import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Radar,
  ReceiptText,
  MessageSquareText,
  Star,
  ShieldCheck,
  Gauge,
  Palette,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SERVICES, TESTIMONIALS } from "@/lib/mock-data";
import { GmbWidgetPreview } from "@/components/marketing/gmb-widget-preview";
import { LiveDispatchPreview } from "@/components/marketing/live-dispatch-preview";
import { ServiceIcon } from "@/components/common/service-icon";

const STEPS = [
  {
    n: "01",
    title: "Customer requests a job",
    body: "Postcode, issue and photos captured in under a minute — from the website, Google Business Profile, or phone.",
  },
  {
    n: "02",
    title: "AI dispatch ranks engineers",
    body: "Nearest qualified, available engineer is recommended by GPS, skills, workload and rating — dispatcher confirms.",
  },
  {
    n: "03",
    title: "Customer tracks live",
    body: "A shareable tracking link shows ETA, route and engineer details, updated as the job progresses.",
  },
  {
    n: "04",
    title: "Invoice, pay, review",
    body: "PDF invoice raised automatically. Pay by card or pay later. One tap to leave a rating.",
  },
];

const FEATURES = [
  { icon: Radar, title: "AI-powered dispatching", body: "Ranks every available engineer against distance, ETA, skills and workload — with a plain-English reason for each recommendation." },
  { icon: MapPin, title: "Real-time customer tracking", body: "Live map and ETA window so customers know exactly when the engineer will arrive." },
  { icon: Gauge, title: "Dynamic GBP pricing", body: "Instant quotes from call-out fees, labour and a local UK parts catalogue." },
  { icon: ReceiptText, title: "Invoicing & payments", body: "Stripe-ready checkout, automatic PDF invoices and a pay-later option." },
  { icon: MessageSquareText, title: "Client portal", body: "Customers upload photos, message the engineer, approve quotes and rate the job." },
  { icon: Palette, title: "White-label branding", body: "Your logo, colours and domain — one dashboard to run every booking." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--primary)_0%,transparent_45%)] opacity-[0.06]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs text-primary">
              Built for UK plumbers · electricians · cleaners · heating engineers
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Dispatch the nearest engineer.
              <br />
              <span className="text-primary">Every job, tracked live.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              TradeWeb turns a Google Business Profile click into a booked, priced and tracked job —
              with AI-matched engineers, instant GBP quotes and automatic VAT invoicing, all from one white-label
              dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/booking" />}>
                  Book a free quote <ArrowRight className="h-4 w-4" />
                </Button>
              <Button size="lg" variant="outline" render={<Link href="/dashboard" />}>See the owner dashboard</Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/70 pt-6 text-sm">
              <div>
                <div className="font-heading text-2xl font-semibold">18 min</div>
                <div className="text-muted-foreground">Avg. engineer ETA</div>
              </div>
              <div>
                <div className="font-heading text-2xl font-semibold">4.8★</div>
                <div className="text-muted-foreground">Average job rating</div>
              </div>
              <div>
                <div className="font-heading text-2xl font-semibold">96%</div>
                <div className="text-muted-foreground">First-time fix rate</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <GmbWidgetPreview />
            <LiveDispatchPreview />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="services">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-sm text-primary">Services</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">One platform, every trade</h2>
          </div>
          <Button variant="ghost" className="hidden sm:inline-flex" render={<Link href="/services" />}>
            All services <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SERVICES.map((s) => (
            <Link key={s.id} href={`/booking?service=${s.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-3 pt-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-medium">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
                  </div>
                  <span className="mt-auto text-sm font-medium text-primary">From {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(s.from)}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/70 bg-muted/30" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="eyebrow text-sm text-primary">How it works</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">From click to completed job</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n} className="docket p-5">
                <span className="font-heading text-3xl font-semibold text-primary/35">{step.n}</span>
                <h3 className="mt-3 font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <span className="eyebrow text-sm text-primary">Platform</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Everything the job needs, nothing it doesn’t</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border border-border/80 p-5">
              <f.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-medium">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GMB selling point */}
      <section className="border-y border-border/70 bg-muted/30">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="eyebrow text-sm text-primary">Sell it on Google</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Turn your Google Business Profile “Book” button into bookings
            </h2>
            <p className="mt-4 text-muted-foreground">
              Add TradeWeb’s booking link to your Google Business Profile action button. When a UK customer taps
              <span className="font-medium text-foreground"> Book</span>, it opens your branded booking flow and
              pre-fills their location — no typing, no drop-off.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> Signed, tenant-scoped links — no spoofed bookings.</li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" /> Location prefilled only with the customer’s consent.</li>
              <li className="flex gap-2"><Gauge className="h-4 w-4 shrink-0 text-primary" /> Every GMB click tracked as attributed lead source.</li>
            </ul>
            <Button className="mt-6" render={<Link href="/booking?source=gmb&service=plumbing&postcode=75300&lat=24.9207&lng=67.0922" />}>
                Try the GMB booking demo <ArrowRight className="h-4 w-4" />
              </Button>
          </div>
          <div className="docket overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/70 bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-2">business.google.com — TradeWeb London</span>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary text-lg font-semibold text-primary-foreground">TP</div>
                <div>
                  <div className="font-medium">TradeWeb — London</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" /> 4.9 (1,204 reviews) · Plumber
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground">Book</Badge>
                <Badge variant="outline">Call</Badge>
                <Badge variant="outline">Directions</Badge>
                <Badge variant="outline">Website</Badge>
              </div>
              <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-3 text-xs text-muted-foreground">
                Tapping <span className="font-medium text-foreground">Book</span> opens tradeweb.co.uk/booking?source=gmb
                with the customer’s approximate location attached.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile/desktop + theme */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-xl border border-border/80 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <span className="eyebrow text-sm text-primary">Works everywhere</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Desktop dispatch board. Mobile engineer app. Any brand.
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              The dispatcher’s dense board and the engineer’s thumb-friendly job queue share one design
              system that adapts down to a 360px phone and up to a wide desktop monitor — in light, dark
              or your own brand colours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-24 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-border/80 bg-muted/40">
              <Smartphone className="h-5 w-5 text-primary" />
              <span className="text-[10px] text-muted-foreground">Mobile</span>
            </div>
            <div className="flex h-16 w-28 flex-col items-center justify-center gap-1 rounded-xl border border-border/80 bg-muted/40">
              <Gauge className="h-5 w-5 text-primary" />
              <span className="text-[10px] text-muted-foreground">Desktop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border/70 bg-muted/30" id="reviews">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="eyebrow text-sm text-primary">Reviews</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">What customers say</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <CardContent className="pt-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-warning text-warning" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.area} · {t.service}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5 rounded-xl bg-primary px-6 py-14 text-center text-primary-foreground">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to see it dispatch a real job?</h2>
          <p className="max-w-xl text-primary-foreground/85">
            Run through the full booking-to-payment journey, or jump straight into the dispatcher’s board.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" render={<Link href="/booking" />}>Book a demo job</Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" render={<Link href="/dashboard/dispatch" />}>Open dispatch board</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
