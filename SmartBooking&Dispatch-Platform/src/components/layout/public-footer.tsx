"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { BrandMark } from "@/components/common/brand-mark";
import { useAppStore } from "@/store/app-store";

export function PublicFooter() {
  const brand = useAppStore((s) => s.brand);
  return (
    <footer className="border-t border-border/80 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BrandMark className="h-4.5 w-4.5" />
            </span>
            {brand.companyName}
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{brand.tagline} Vetted, insured tradespeople dispatched across {brand.serviceAreas.slice(0, 3).join(", ")} and beyond.</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {brand.phone}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {brand.email}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {brand.serviceAreas.join(" · ")}</div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">Pricing calculator</Link></li>
            <li><Link href="/booking" className="hover:text-foreground">Book a job</Link></li>
            <li><Link href="/portal" className="hover:text-foreground">Client portal</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Business tools</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/dashboard" className="hover:text-foreground">Owner dashboard</Link></li>
            <li><Link href="/dashboard/dispatch" className="hover:text-foreground">Live dispatch</Link></li>
            <li><Link href="/engineer" className="hover:text-foreground">Engineer app</Link></li>
            <li><Link href="/dashboard/settings" className="hover:text-foreground">White-label branding</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/80 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {brand.companyName}. Demo environment — all bookings, prices and payments shown are simulated.
      </div>
    </footer>
  );
}
