"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  dispatch: "Live dispatch",
  jobs: "Jobs",
  engineers: "Engineers",
  customers: "Customers",
  invoices: "Invoices",
  reports: "Reports",
  settings: "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const label = LABELS[parts[parts.length - 1]] ?? "Overview";
  return <span className="text-sm font-medium">{label}</span>;
}
