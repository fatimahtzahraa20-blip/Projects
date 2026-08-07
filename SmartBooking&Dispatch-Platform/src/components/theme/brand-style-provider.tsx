"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

/** Injects the white-label primary/accent brand colours as CSS variables. */
export function BrandStyleProvider() {
  const primary = useAppStore((s) => s.brand.primaryColor);
  const accent = useAppStore((s) => s.brand.accentColor);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", primary);
    root.style.setProperty("--sidebar-primary", primary);
    root.style.setProperty("--ring", primary);
    root.style.setProperty("--brand-accent", accent);
    root.style.setProperty("--chart-1", primary);
    root.style.setProperty("--chart-2", accent);
  }, [primary, accent]);

  return null;
}
