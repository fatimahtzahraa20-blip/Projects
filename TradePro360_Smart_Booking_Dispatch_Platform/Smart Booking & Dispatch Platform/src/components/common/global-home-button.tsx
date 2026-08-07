"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "lucide-react";

export function GlobalHomeButton() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      aria-label="Return to homepage"
      className="fixed bottom-4 left-4 z-[100] flex h-11 items-center gap-2 rounded-full border border-border bg-background/95 px-4 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <House className="h-4 w-4 text-primary" />
      Home
    </Link>
  );
}
