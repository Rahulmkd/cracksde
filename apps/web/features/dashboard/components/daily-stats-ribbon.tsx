"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyStatsRibbonProps {
  streak: number;
  points: number;
}

export function DailyStatsRibbon({ streak, points }: DailyStatsRibbonProps) {
  return (
    <div className="space-y-4">
      {/* Announcement Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-blue-500/20 bg-blue-950/20 px-3.5 py-2.5 text-[12px] text-zinc-300 shadow-subtle">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-semibold text-[10px] shrink-0">
            ✦
          </span>
          <p className="truncate text-zinc-300 text-[12px] font-normal leading-normal">
            <strong className="text-blue-400 font-medium">Sprint 1 Active</strong> &middot; Focus: Data Structures &amp; OOPS Foundations.
          </p>
        </div>
        <Link
          href="/planly"
          className="shrink-0 text-[12px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          View Sprint Schedule <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Greeting & Streak Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Welcome back</span>
            <span className="inline-block text-[18px]">👋</span>
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            You&apos;re on a{" "}
            <strong className="text-orange-400 font-semibold">{streak}-day study streak</strong>.
            Keep the momentum going!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-1 text-[12px] flex items-center gap-1.5 text-amber-300 font-mono font-medium shadow-subtle">
            <span>🟡</span>
            <span>{points} Pts</span>
          </div>

          <Button
            asChild
            size="sm"
            className="h-7 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Link href="/planly">
              <Zap className="h-3 w-3 mr-1" /> Resume Study Sprint
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
