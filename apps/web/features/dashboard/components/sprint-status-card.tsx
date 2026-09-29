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
    <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0c1017] p-5 sm:p-6 shadow-sm hover:border-zinc-700/80 transition-all duration-200 select-none">
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
          <span className="inline-block rounded-md border border-zinc-800 bg-zinc-950/90 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
            PLANLY &middot; PERSONAL STUDY PLANNER
          </span>

          <h2 className="text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight text-zinc-100">
            Know what to study every day and readjust as you go
          </h2>

          <p className="text-[13px] font-normal text-zinc-400 leading-relaxed">
            Personalized day-by-day study roadmap adapted to your schedule, weak areas, and interview targets.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Button
              asChild
              size="sm"
              className="h-8 px-4 text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg transition-colors"
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
              className="h-8 px-4 text-[12px] font-medium border-zinc-700/80 hover:bg-zinc-800/80 text-zinc-300 rounded-lg transition-colors"
            >
              <Link href="/onboarding">Reconfigure Plan</Link>
            </Button>
          </div>
        </div>

        {/* Right Tagline */}
        <div className="hidden md:flex flex-col items-end justify-center text-right text-[12px] text-zinc-400 pr-2 space-y-0.5 shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Timeline</span>
          <p className="font-normal text-zinc-400 text-[12px]">
            Target: <strong className="text-blue-400 font-semibold ml-1">{targetDays} Days</strong>
          </p>
          <span className="text-[11px] text-zinc-500 font-normal font-mono">{totalSprints} structured sprints</span>
        </div>
      </div>
    </div>
  );
}

