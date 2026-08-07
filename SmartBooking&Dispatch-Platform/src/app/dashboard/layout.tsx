"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { DemoLogin } from "@/components/auth/demo-login";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const logout = useAuthStore((state) => state.logout);

  if (!hydrated) return null;
  if (!session || session.role !== "owner") return <DemoLogin role="owner" />;

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/80 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <DashboardBreadcrumb />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{session.email}</span>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
