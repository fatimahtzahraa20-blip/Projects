import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BrandMark } from "@/components/common/brand-mark";

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col border-x border-border/60 bg-background sm:max-w-lg">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/80 bg-background/95 px-4 backdrop-blur">
        <Link href="/engineer" className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BrandMark className="h-4 w-4" />
          </span>
          Engineer app
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-md border border-border/80 text-muted-foreground hover:bg-muted" aria-label="Owner dashboard">
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        </div>
      </header>
      <main className="flex-1 pb-6">{children}</main>
    </div>
  );
}
