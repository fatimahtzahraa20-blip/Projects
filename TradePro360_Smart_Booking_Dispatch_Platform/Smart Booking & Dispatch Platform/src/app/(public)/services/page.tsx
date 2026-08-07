import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICES } from "@/lib/mock-data";
import { ServiceIcon } from "@/components/common/service-icon";

export const metadata = { title: "Services" };

const INCLUDED: Record<string, string[]> = {
  plumbing: ["Leak detection & repair", "Blocked drains & toilets", "Tap & valve replacement", "Bathroom fit-outs"],
  electrical: ["Fault finding & rewiring", "Distribution board upgrades", "Earthing & safety inspection", "Lighting & sockets"],
  heating: ["Boiler repair & servicing", "Central-heating diagnostics", "Radiator installation", "Gas safety checks"],
  cleaning: ["Move-in and move-out deep clean", "Regular home cleaning", "Office & commercial clean", "Carpet & upholstery"],
  locksmith: ["Emergency lockouts", "Lock changes & upgrades", "Door and window lock repair", "Key cutting"],
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="eyebrow text-sm text-primary">Services</span>
      <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
        Vetted trades, dispatched by the nearest available engineer
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every TradeWeb engineer is identity-checked, background-checked and qualification-verified before their first job.
        Pick a service to see typical pricing and book in minutes.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {SERVICES.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <CardContent className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-start">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ServiceIcon name={s.icon} className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-heading text-2xl font-semibold">{s.name}</h2>
                  <span className="ref-code text-sm text-muted-foreground">from {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(s.from)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
                <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {INCLUDED[s.id].map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" render={<Link href={`/booking?service=${s.id}`} />}>
                    Book {s.name.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" render={<Link href={`/pricing?service=${s.id}`} />}>
                    Estimate a price
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
