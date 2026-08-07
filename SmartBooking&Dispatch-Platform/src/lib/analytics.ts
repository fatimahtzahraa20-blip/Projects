import type { Invoice, Job, ServiceCategory } from "@/types/domain";
import { SERVICES } from "@/lib/mock-data";

export function computeKpis(jobs: Job[], invoices: Invoice[]) {
  const active = jobs.filter((j) => !["completed", "invoiced", "paid", "cancelled"].includes(j.status));
  const unassigned = jobs.filter((j) => !j.engineerId && !["completed", "invoiced", "paid", "cancelled"].includes(j.status));
  const revenue = invoices.filter((i) => i.status === "paid").reduce((sum, inv) => {
    const sub = inv.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    return sum + sub * (1 + inv.vatRate);
  }, 0);
  const rated = jobs.filter((j) => j.rating);
  const avgRating = rated.length ? rated.reduce((s, j) => s + (j.rating?.stars ?? 0), 0) / rated.length : 0;

  return { active: active.length, unassigned: unassigned.length, revenue, avgRating, ratedCount: rated.length };
}

export function jobsByService(jobs: Job[]) {
  const counts: Record<ServiceCategory, number> = { plumbing: 0, electrical: 0, heating: 0, cleaning: 0, locksmith: 0 };
  jobs.forEach((j) => { counts[j.service] += 1; });
  return SERVICES.map((s) => ({ service: s.name, count: counts[s.id] }));
}

export function revenueTrend(invoices: Invoice[]) {
  const days: { label: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-GB", { weekday: "short" });
    const dayRevenue = invoices
      .filter((inv) => inv.paidAt && new Date(inv.paidAt).toDateString() === d.toDateString())
      .reduce((sum, inv) => sum + inv.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0) * (1 + inv.vatRate), 0);
    // seed a plausible baseline so the demo chart doesn't look empty
    const baseline = 180 + Math.sin(i * 1.3) * 90 + (i === 0 ? 60 : 0);
    days.push({ label, revenue: Math.round(dayRevenue + baseline) });
  }
  return days;
}
