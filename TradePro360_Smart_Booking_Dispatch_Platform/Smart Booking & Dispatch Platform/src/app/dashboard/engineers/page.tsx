"use client";

import { Star, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/lib/mock-data";
import { ServiceIcon } from "@/components/common/service-icon";

const STATUS_DOT: Record<string, string> = {
  available: "bg-success",
  en_route: "bg-warning",
  busy: "bg-destructive",
  offline: "bg-muted-foreground",
};

export default function EngineersPage() {
  const engineers = useAppStore((s) => s.engineers);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-semibold">Engineers</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {engineers.map((eng) => (
          <Card key={eng.id}>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{eng.avatar}</span>
                  <div>
                    <div className="font-medium">{eng.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" /> {eng.rating} · {eng.jobsCompleted} jobs
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                  <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[eng.status])} /> {eng.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {eng.skills.map((sk) => {
                  const svc = SERVICES.find((s) => s.id === sk);
                  return (
                    <span key={sk} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {svc && <ServiceIcon name={svc.icon} className="h-3 w-3" />} {svc?.name}
                    </span>
                  );
                })}
              </div>

              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> {eng.certifications.map((c) => c.name).join(", ")}</div>
                <div>Base: {eng.homeBase} · {eng.vanReg}</div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Workload today</span>
                  <span>{eng.workloadToday}/{eng.maxWorkload}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, (eng.workloadToday / eng.maxWorkload) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
