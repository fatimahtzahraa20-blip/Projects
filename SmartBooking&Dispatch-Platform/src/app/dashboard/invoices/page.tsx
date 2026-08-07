"use client";

import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toneClasses } from "@/lib/status";
import { useAppStore } from "@/store/app-store";
import { formatGBP } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const INVOICE_TONE: Record<string, "muted" | "info" | "warning" | "success" | "danger"> = {
  draft: "muted",
  sent: "info",
  overdue: "danger",
  paid: "success",
  pay_later: "warning",
};

export default function InvoicesPage() {
  const invoices = useAppStore((s) => s.invoices);
  const jobs = useAppStore((s) => s.jobs);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-semibold">Invoices</h1>
      <div className="overflow-x-auto rounded-lg border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => {
              const job = jobs.find((j) => j.id === inv.jobId);
              const subtotal = inv.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
              const total = subtotal * (1 + inv.vatRate);
              return (
                <TableRow key={inv.id}>
                  <TableCell className="ref-code font-medium">{inv.number}</TableCell>
                  <TableCell>
                    {job ? <Link href={`/dashboard/jobs/${job.id}`} className="text-primary">{job.reference}</Link> : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(inv.issuedAt).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", toneClasses(INVOICE_TONE[inv.status]))}>
                      {inv.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatGBP(total)}</TableCell>
                </TableRow>
              );
            })}
            {invoices.length === 0 && (
              <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No invoices yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
