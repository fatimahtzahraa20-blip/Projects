"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/app-store";
import { JobStatusBadge, UrgencyBadge } from "@/components/common/status-badge";
import { SERVICES } from "@/lib/mock-data";
import { ServiceIcon } from "@/components/common/service-icon";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "completed", label: "Completed" },
  { value: "paid", label: "Paid" },
];

export default function JobsPage() {
  const jobs = useAppStore((s) => s.jobs);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => {
        if (filter === "open") return !["completed", "invoiced", "paid", "cancelled"].includes(j.status);
        if (filter === "completed") return j.status === "completed" || j.status === "invoiced";
        if (filter === "paid") return j.status === "paid";
        return true;
      })
      .filter((j) => {
        const s = q.toLowerCase();
        return !s || j.reference.toLowerCase().includes(s) || j.customerName.toLowerCase().includes(s) || j.address.postcode.toLowerCase().includes(s);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobs, filter, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">Jobs</h1>
        <Input placeholder="Search reference, customer, postcode…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>{f.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="overflow-x-auto rounded-lg border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Estimate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((job) => {
              const service = SERVICES.find((s) => s.id === job.service);
              return (
                <TableRow key={job.id} className="cursor-pointer" onClick={() => window.location.assign(`/dashboard/jobs/${job.id}`)}>
                  <TableCell>
                    <Link href={`/dashboard/jobs/${job.id}`} className="ref-code font-medium text-primary">{job.reference}</Link>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5">
                      {service && <ServiceIcon name={service.icon} className="h-3.5 w-3.5 text-muted-foreground" />}
                      {service?.name}
                    </span>
                  </TableCell>
                  <TableCell>{job.customerName}</TableCell>
                  <TableCell><UrgencyBadge urgency={job.urgency} /></TableCell>
                  <TableCell><JobStatusBadge status={job.status} /></TableCell>
                  <TableCell className="text-right">{new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(job.priceEstimate.low)}–{new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(job.priceEstimate.high)}</TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No jobs match this filter.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
