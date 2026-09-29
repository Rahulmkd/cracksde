"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SprintStatusCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2.5 max-w-xl">
          <span className="inline-block rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            PLANLY &middot; Personal Study Planner
          </span>

          <h2 className="text-[18px] sm:text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            Know what to study every day and readjust as you go
          </h2>

          <p className="text-[12px] font-normal text-zinc-400 leading-normal">
            Personalized day-by-day study roadmap adapted to your schedule, weak areas, and interview targets.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            <Button
              asChild
              size="sm"
              className="h-7 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Link href="/planly">
                Resume Sprint 1 <ArrowRight className="h-3 w-3 ml-1.5" />
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-7 px-3 text-[12px] font-medium"
            >
              <Link href="/onboarding">Reconfigure Plan</Link>
            </Button>
          </div>
        </div>

        {/* Right Tagline */}
        <div className="hidden md:flex flex-col items-end justify-center text-right text-[12px] text-zinc-400 pr-2 space-y-0.5">
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Timeline</span>
          <p className="font-normal text-zinc-300 text-[12px]">
            Target: <strong className="text-blue-400 font-semibold">61 Days</strong>
          </p>
          <span className="text-[11px] text-zinc-500 font-normal font-mono">9 structured sprints</span>
        </div>
      </div>
    </div>
  );
}
