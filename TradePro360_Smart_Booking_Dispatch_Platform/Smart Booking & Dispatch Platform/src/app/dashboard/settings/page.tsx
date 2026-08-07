"use client";

import { useState } from "react";
import { Check, Copy, Palette } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAND_PRESETS, useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const brand = useAppStore((s) => s.brand);
  const updateBrand = useAppStore((s) => s.updateBrand);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const [copied, setCopied] = useState(false);

  const gmbLink = `https://tradeweb.co.uk/booking?source=gmb&company=${encodeURIComponent(brand.companyName.toLowerCase().replace(/\s+/g, "-"))}`;

  function copyLink() {
    navigator.clipboard.writeText(gmbLink).then(() => {
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-heading text-2xl font-semibold">White-label settings</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Brand identity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Company name</Label>
              <Input value={brand.companyName} onChange={(e) => updateBrand({ companyName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Logo initials</Label>
              <Input value={brand.logoInitials} maxLength={3} onChange={(e) => updateBrand({ logoInitials: e.target.value.toUpperCase() })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tagline</Label>
              <Input value={brand.tagline} onChange={(e) => updateBrand({ tagline: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={brand.phone} onChange={(e) => updateBrand({ phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={brand.email} onChange={(e) => updateBrand({ email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>VAT registration number</Label>
              <Input value={brand.vatNumber} onChange={(e) => updateBrand({ vatNumber: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Invoice prefix</Label>
              <Input value={brand.invoicePrefix} onChange={(e) => updateBrand({ invoicePrefix: e.target.value.toUpperCase() })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 text-base"><Palette className="h-4 w-4" /> Brand colour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {BRAND_PRESETS.map((preset, i) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(i)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors",
                  brand.primaryColor === preset.primary ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                )}
              >
                <span className="flex h-8 w-full overflow-hidden rounded-md">
                  <span className="h-full w-1/2" style={{ backgroundColor: preset.primary }} />
                  <span className="h-full w-1/2" style={{ backgroundColor: preset.accent }} />
                </span>
                {preset.name}
                {brand.primaryColor === preset.primary && <Check className="h-3 w-3 text-primary" />}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            This updates the primary colour across the entire booking flow, tracking pages and dashboard —
            live, so your team can preview it before rolling out to customers.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Google Business Profile booking widget</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Paste this link into your GMB profile’s “Book” action button. It opens your branded booking flow
            and is tagged so leads from Google are attributed correctly.
          </p>
          <div className="flex items-center gap-2">
            <Input readOnly value={gmbLink} className="ref-code text-xs" />
            <Button variant="outline" size="icon" onClick={copyLink} aria-label="Copy link">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
