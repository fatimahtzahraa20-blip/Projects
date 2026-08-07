"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, Cell, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAppStore } from "@/store/app-store";
import { jobsByService } from "@/lib/analytics";
import { SERVICES } from "@/lib/mock-data";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const barConfig = { count: { label: "Jobs", color: "var(--chart-1)" } } satisfies ChartConfig;

export default function ReportsPage() {
  const jobs = useAppStore((s) => s.jobs);
  const byService = jobsByService(jobs);

  const urgencyCounts = [
    { name: "Emergency", value: jobs.filter((j) => j.urgency === "emergency").length },
    { name: "Same day", value: jobs.filter((j) => j.urgency === "today").length },
    { name: "Scheduled", value: jobs.filter((j) => j.urgency === "scheduled").length },
  ];

  const firstTimeFix = jobs.length ? Math.round((jobs.filter((j) => ["completed", "invoiced", "paid"].includes(j.status)).length / jobs.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Reports</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-2"><p className="text-sm text-muted-foreground">Completion rate</p><p className="font-heading text-2xl font-semibold">{firstTimeFix}%</p></CardContent></Card>
        <Card><CardContent className="pt-2"><p className="text-sm text-muted-foreground">Total jobs logged</p><p className="font-heading text-2xl font-semibold">{jobs.length}</p></CardContent></Card>
        <Card><CardContent className="pt-2"><p className="text-sm text-muted-foreground">Services offered</p><p className="font-heading text-2xl font-semibold">{SERVICES.length}</p></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Jobs by service</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="aspect-auto h-64 w-full">
              <BarChart data={byService}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="service" tickLine={false} axisLine={false} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Jobs by urgency</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={{}} className="aspect-square h-64 w-full max-w-64">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={urgencyCounts} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {urgencyCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
