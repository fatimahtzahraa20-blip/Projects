import { useEffect } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export default function Modal({ open, onClose, title, description, children, footer, className }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} aria-label="Close modal" />
      <section className={cn("relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl", className)}>
        <header className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Close">
            <X className="size-5" />
          </button>
        </header>
        <div className="overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer ? <footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">{footer}</footer> : null}
      </section>
    </div>
  );
}
