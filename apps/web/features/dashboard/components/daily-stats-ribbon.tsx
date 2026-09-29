"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyStatsRibbonProps {
  streak: number;
  points: number;
  userName?: string;
  sprintNumber?: number;
  sprintFocus?: string;
}

export function DailyStatsRibbon({
  streak,
  points,
  userName = "Rahul",
  sprintNumber = 1,
  sprintFocus = "Data Structures & OOPS Foundations.",
}: DailyStatsRibbonProps) {
  return (
    <div className="space-y-4 select-none">
      {/* 1. Announcement Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-blue-900/40 bg-[#080f20]/90 px-4 py-2.5 text-[12px] text-zinc-300 shadow-sm">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-semibold text-[10px] shrink-0">
            ✦
          </span>
          <p className="truncate text-zinc-300 text-[12px] font-normal leading-normal">
            <strong className="text-blue-400 font-medium">Sprint {sprintNumber} Active</strong> &middot; Focus: {sprintFocus}
          </p>
        </div>
        <Link
          href="/planly"
          className="shrink-0 text-[12px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          View Sprint Schedule <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* 2. Greeting & Streak Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="space-y-1">
          <h1 className="text-[22px] sm:text-[24px] font-bold leading-tight tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Welcome back, {userName}</span>
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
          <div className="rounded-lg border border-zinc-800/90 bg-[#0c1017] px-3.5 py-1.5 text-[12px] flex items-center gap-2 text-amber-300 font-mono font-medium shadow-sm">
            <span className="text-[12px]">🟡</span>
            <span>{points} Pts</span>
          </div>

          {/* Resume Study Sprint Button */}
          <Button
            asChild
            size="sm"
            className="h-8 px-3.5 text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg transition-colors active:scale-[0.98]"
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

