import { UK_PARTS } from "@/lib/mock-data";
import type { ServiceCategory, Urgency } from "@/types/domain";

export const CALL_OUT_FEE: Record<ServiceCategory, number> = {
  plumbing: 85,
  electrical: 95,
  heating: 110,
  cleaning: 55,
  locksmith: 90,
};

export const LABOUR_RATE_PER_HOUR: Record<ServiceCategory, number> = {
  plumbing: 65,
  electrical: 75,
  heating: 85,
  cleaning: 32,
  locksmith: 80,
};

export const URGENCY_MULTIPLIER: Record<Urgency, number> = {
  emergency: 1.5,
  today: 1.15,
  scheduled: 1,
};

export interface QuoteBreakdown {
  callOut: number;
  labour: number;
  labourHours: number;
  urgencyPremium: number;
  parts: { name: string; price: number; supplier: string }[];
  partsCost: number;
  subtotal: number;
  vat: number;
  total: number;
}

export function partsFor(category: ServiceCategory) {
  return UK_PARTS.filter((p) => p.category === category);
}

export function calculateQuote(
  service: ServiceCategory,
  urgency: Urgency,
  estimatedHours: number,
  selectedPartIds: string[],
): QuoteBreakdown {
  const callOut = CALL_OUT_FEE[service];
  const baseLabour = LABOUR_RATE_PER_HOUR[service] * estimatedHours;
  const multiplier = URGENCY_MULTIPLIER[urgency];
  const labour = Math.round(baseLabour * multiplier * 100) / 100;
  const urgencyPremium = Math.round((labour - baseLabour) * 100) / 100;

  const parts = UK_PARTS.filter((p) => selectedPartIds.includes(p.id)).map((p) => ({
    name: p.name,
    price: p.price,
    supplier: p.supplier,
  }));
  const partsCost = Math.round(parts.reduce((sum, p) => sum + p.price, 0) * 100) / 100;

  const subtotal = Math.round((callOut + labour + partsCost) * 100) / 100;
  const vat = Math.round(subtotal * 0.2 * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;

  return {
    callOut,
    labour,
    labourHours: estimatedHours,
    urgencyPremium,
    parts,
    partsCost,
    subtotal,
    vat,
    total,
  };
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(amount);
}
