"use client";

import Link from "next/link";
import { Radar, Briefcase, Star, Banknote, ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAppStore } from "@/store/app-store";
import { computeKpis, jobsByService, revenueTrend } from "@/lib/analytics";
import { formatGBP } from "@/lib/pricing";
import { JobStatusBadge, UrgencyBadge } from "@/components/common/status-badge";

const barConfig = { count: { label: "Jobs", color: "var(--chart-1)" } } satisfies ChartConfig;
const lineConfig = { revenue: { label: "Revenue", color: "var(--chart-2)" } } satisfies ChartConfig;

export default function DashboardOverview() {
  const jobs = useAppStore((s) => s.jobs);
  const invoices = useAppStore((s) => s.invoices);
  const kpis = computeKpis(jobs, invoices);
  const byService = jobsByService(jobs);
  const trend = revenueTrend(invoices);

  const unassigned = jobs.filter((j) => !j.engineerId && !["completed", "invoiced", "paid", "cancelled"].includes(j.status));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Active jobs</p>
              <p className="font-heading text-2xl font-semibold">{kpis.active}</p>
            </div>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Needs dispatch</p>
              <p className="font-heading text-2xl font-semibold">{kpis.unassigned}</p>
            </div>
            <Radar className="h-5 w-5 text-warning" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Revenue collected</p>
              <p className="font-heading text-2xl font-semibold">{formatGBP(kpis.revenue)}</p>
            </div>
            <Banknote className="h-5 w-5 text-success" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Avg. rating</p>
              <p className="font-heading text-2xl font-semibold">{kpis.avgRating ? kpis.avgRating.toFixed(1) : "—"}</p>
            </div>
            <Star className="h-5 w-5 fill-warning text-warning" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue, last 7 days</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={lineConfig} className="aspect-auto h-56 w-full">
              <LineChart data={trend}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Jobs by service</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="aspect-auto h-56 w-full">
              <BarChart data={byService}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="service" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Awaiting dispatch</CardTitle>
          <Button variant="ghost" size="sm" render={<Link href="/dashboard/dispatch" />}>
            Open dispatch board <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {unassigned.length === 0 && <p className="text-sm text-muted-foreground">Everything is assigned. Nice work.</p>}
          {unassigned.map((job) => (
            <Link key={job.id} href="/dashboard/dispatch" className="flex items-center justify-between rounded-md border border-border/80 p-3 text-sm hover:bg-muted/50">
              <div>
                <span className="ref-code font-medium">{job.reference}</span>
                <span className="ml-2 text-muted-foreground">{job.issue}</span>
              </div>
              <div className="flex items-center gap-2">
                <UrgencyBadge urgency={job.urgency} />
                <JobStatusBadge status={job.status} />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
