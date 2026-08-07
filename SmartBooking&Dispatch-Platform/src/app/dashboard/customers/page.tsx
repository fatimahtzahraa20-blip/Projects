"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app-store";
import { formatGBP } from "@/lib/pricing";

export default function CustomersPage() {
  const customers = useAppStore((s) => s.customers);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-semibold">Customers</h1>
      <div className="overflow-x-auto rounded-lg border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Jobs</TableHead>
              <TableHead className="text-right">Lifetime value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.email}<br />{c.phone}</TableCell>
                <TableCell className="text-muted-foreground">{c.address.line1}, {c.address.postcode}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="text-right">{c.jobsCount}</TableCell>
                <TableCell className="text-right">{formatGBP(c.lifetimeValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
