"use client";

import Link from "next/link";
import { ArrowRight, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { JobStatusBadge } from "@/components/common/status-badge";
import { SERVICES } from "@/lib/mock-data";
import { ServiceIcon } from "@/components/common/service-icon";
import { DemoLogin } from "@/components/auth/demo-login";
import { useAuthStore } from "@/store/auth-store";

export default function PortalPage() {
  const jobs = useAppStore((s) => s.jobs);
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const logout = useAuthStore((state) => state.logout);

  if (!hydrated) return null;
  if (!session || session.role !== "client") return <DemoLogin role="client" />;

  const myJobs = jobs.filter(
    (job) => job.customerId === session.customerId || job.customerEmail?.toLowerCase() === session.email.toLowerCase(),
  );
  const firstName = session.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-sm text-primary">Client portal</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
          <p className="mt-1 text-muted-foreground">Track live jobs, view invoices and message your engineer.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={logout}><LogOut className="h-4 w-4" /> Log out</Button>
          <Button render={<Link href="/booking" />}><Plus className="h-4 w-4" /> Book a new job</Button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {myJobs.length === 0 && (
          <Card><CardContent className="py-10 text-center text-muted-foreground">No bookings yet.</CardContent></Card>
        )}
        {myJobs.map((job) => {
          const service = SERVICES.find((s) => s.id === job.service);
          return (
            <Link key={job.id} href={`/track/${job.reference}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      {service && <ServiceIcon name={service.icon} className="h-5 w-5" />}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="ref-code text-sm font-medium">{job.reference}</span>
                        <JobStatusBadge status={job.status} />
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{job.issue}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
