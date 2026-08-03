"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("hut-theme");
    const next = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("hut-theme", next ? "dark" : "light");
  };
  return <button type="button" onClick={toggle} className="theme-toggle grid h-10 w-10 place-items-center rounded-full border border-white/25 transition hover:bg-white/10 disabled:opacity-60" aria-label={`Switch to ${dark ? "light" : "dark"} theme`} title={`Switch to ${dark ? "light" : "dark"} theme`} disabled={dark === null}>{dark ? <Sun size={17}/> : <Moon size={17}/>}</button>;
}