"use client";

import React from "react";
import type { ProfileStatsDto } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Flame,
  Clock,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";

interface ProfileStatsCardProps {
  stats: ProfileStatsDto;
  dailyGoalMinutes?: number;
}

export function ProfileStatsCard({
  stats,
  dailyGoalMinutes = 60,
}: ProfileStatsCardProps) {
  const hoursSpent = Math.floor(stats.totalTimeSpentMinutes / 60);
  const minutesSpent = stats.totalTimeSpentMinutes % 60;
  const timeFormatted =
    hoursSpent > 0 ? `${hoursSpent}h ${minutesSpent}m` : `${minutesSpent}m`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          Study Metrics &amp; Performance
        </h2>
        <span className="text-[11px] text-zinc-400">
          Target: {dailyGoalMinutes} min/day
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Solved Problems */}
        <Card className="border-zinc-800/80 bg-zinc-900/40 hover:border-blue-500/30 transition-colors group">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                Problems Solved
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 font-mono">
                {stats.totalSolved}
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                <span>{stats.overallPercentage}% of curriculum</span>
                <span className="text-zinc-400">/ {stats.totalCurriculumItems}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Streak */}
        <Card className="border-zinc-800/80 bg-zinc-900/40 hover:border-orange-500/30 transition-colors group">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                Current Streak
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                <Flame className="h-4 w-4 fill-orange-500 text-orange-500 animate-pulse" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-orange-400 font-mono flex items-baseline gap-1">
                {stats.streakDays}
                <span className="text-xs font-normal text-zinc-400">days</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Solve daily to keep flame alive
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Study Points */}
        <Card className="border-zinc-800/80 bg-zinc-900/40 hover:border-amber-500/30 transition-colors group">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                CrackSDE Points
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform text-sm">
                🟡
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-300 font-mono">
                {stats.studyPoints}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                +15 pts per problem solved
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Time Invested */}
        <Card className="border-zinc-800/80 bg-zinc-900/40 hover:border-purple-500/30 transition-colors group">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                Estimated Time
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 font-mono">
                {timeFormatted}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Active study time invested
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spaced Repetition Quick Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                Spaced Repetitions Due
              </div>
              <div className="text-[11px] text-zinc-400 font-normal">
                Recall items due today for optimal retention
              </div>
            </div>
          </div>
          <span className="text-base font-bold font-mono text-blue-400 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
            {stats.revisionsDueCount}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                Mastered Concepts
              </div>
              <div className="text-[11px] text-zinc-400 font-normal">
                Solved 3+ times across revision cycles
              </div>
            </div>
          </div>
          <span className="text-base font-bold font-mono text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            {stats.revisionsMasteredCount}
          </span>
        </div>
      </div>
    </div>
  );
}
