"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

const STORAGE_KEY = "tradeweb-uk-demo-store";

/** Keeps owner, engineer and customer tabs synchronized on the same device. */
export function StoreSync() {
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) void useAppStore.persist.rehydrate();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return null;
}
