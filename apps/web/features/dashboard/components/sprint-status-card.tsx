"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SprintStatusCardProps {
  sprintNumber?: number;
  targetDays?: number;
  totalSprints?: number;
}

export function SprintStatusCard({
  sprintNumber = 1,
  targetDays = 61,
  totalSprints = 9,
}: SprintStatusCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 shadow-subtle hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 select-none">
      {/* Subtle blueprint grid effect */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <span className="inline-block rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
            PLANLY &middot; PERSONAL STUDY PLANNER
          </span>

          <h2 className="text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight text-white">
            Know what to study every day and readjust as you go
          </h2>

          <p className="text-[13px] font-normal text-zinc-400 leading-relaxed">
            Personalized day-by-day study roadmap adapted to your schedule, weak areas, and interview targets.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Button
              asChild
              size="sm"
              className="h-9 px-4 text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm rounded-xl transition-all active:scale-[0.98]"
            >
              <Link href="/planly" className="flex items-center gap-1.5">
                <span>Resume Sprint {sprintNumber}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-9 px-4 text-[13px] font-medium border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:text-white text-zinc-300 rounded-xl transition-colors"
            >
              <Link href="/onboarding">Reconfigure Plan</Link>
            </Button>
          </div>
        </div>

        {/* Right Timeline Stat Panel */}
        <div className="hidden md:flex flex-col items-end justify-center rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-3 text-right shrink-0 space-y-1 shadow-subtle">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Timeline</span>
          <p className="font-normal text-zinc-300 text-[12px]">
            Target: <strong className="text-blue-400 font-bold ml-1">{targetDays} Days</strong>
          </p>
          <span className="text-[11px] text-zinc-400 font-mono">{totalSprints} structured sprints</span>
        </div>
      </div>
    </div>
  );
}

