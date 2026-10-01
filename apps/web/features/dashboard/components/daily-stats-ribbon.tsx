"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyStatsRibbonProps {
  streak?: number;
  points?: number;
  userName?: string;
  sprintNumber?: number;
  sprintFocus?: string;
  isLoading?: boolean;
}

export function DailyStatsRibbon({
  streak = 0,
  points = 0,
  userName,
  sprintNumber = 1,
  sprintFocus = "Data Structures & OOPS Foundations.",
  isLoading = false,
}: DailyStatsRibbonProps) {
  return (
    <div className="space-y-4 select-none">
      {/* 1. Announcement Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-2.5 text-[12px] text-zinc-300 shadow-subtle">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-semibold text-[10px] shrink-0">
            ✦
          </span>
          <p className="truncate text-zinc-300 text-[12px] font-normal leading-normal">
            <strong className="text-blue-400 font-semibold">Sprint {sprintNumber} Active</strong>
            <span className="text-zinc-600 mx-1.5">·</span>
            <span className="text-zinc-300">Focus: {sprintFocus}</span>
          </p>
        </div>
        <Link
          href="/planly"
          className="shrink-0 text-[12px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>View Sprint Schedule</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. Greeting & Streak Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
        <div className="space-y-1">
          <h1 className="text-[22px] sm:text-[24px] font-bold leading-tight tracking-tight text-white flex items-center gap-2 min-h-[32px]">
            <span>Welcome back,</span>
            {isLoading || !userName ? (
              <span className="inline-block h-6 sm:h-7 w-28 sm:w-32 rounded-md bg-zinc-800/80 animate-pulse align-middle" />
            ) : (
              <span>{userName}</span>
            )}
            <span className="inline-block text-[20px]">👋</span>
          </h1>
          <p className="text-[13px] font-normal leading-normal text-zinc-400">
            You&apos;re on a{" "}
            <strong className="text-amber-400 font-semibold">{streak}-day study streak</strong>.
            Keep the momentum going!
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Gamified Points Pill */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-1.5 text-[12px] flex items-center gap-2 text-amber-300 font-mono font-semibold shadow-subtle">
            <span className="text-[13px]">🟡</span>
            <span>{points} Pts</span>
          </div>

          {/* Resume Study Sprint Button */}
          <Button
            asChild
            size="sm"
            className="h-9 px-4 text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm rounded-xl transition-all active:scale-[0.98]"
          >
            <Link href="/planly" className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Resume Study Sprint</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
