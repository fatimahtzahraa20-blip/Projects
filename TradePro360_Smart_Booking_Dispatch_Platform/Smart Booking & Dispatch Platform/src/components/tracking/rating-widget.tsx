"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/domain";

export function RatingWidget({ job }: { job: Job }) {
  const updateJob = useAppStore((s) => s.updateJob);
  const [stars, setStars] = useState(job.rating?.stars ?? 5);
  const [comment, setComment] = useState(job.rating?.comment ?? "");
  const [submitted, setSubmitted] = useState(!!job.rating);

  if (submitted) {
    return (
      <div className="rounded-lg border border-border/80 p-4 text-sm">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-4 w-4", i < stars ? "fill-warning text-warning" : "text-muted")} />
          ))}
        </div>
        {comment && <p className="mt-2 text-muted-foreground">&ldquo;{comment}&rdquo;</p>}
        <p className="mt-1 text-xs text-muted-foreground">Thanks for the feedback.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/80 p-4">
      <p className="text-sm font-medium">How did the job go?</p>
      <div className="mt-2 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} type="button" onClick={() => setStars(i + 1)} aria-label={`${i + 1} stars`}>
            <Star className={cn("h-6 w-6 transition-colors", i < stars ? "fill-warning text-warning" : "text-muted hover:text-warning/60")} />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment (optional)"
        rows={2}
        className="mt-3"
      />
      <Button
        size="sm"
        className="mt-3"
        onClick={() => {
          updateJob(job.id, { rating: { stars, comment } });
          setSubmitted(true);
        }}
      >
        Submit rating
      </Button>
    </div>
  );
}
