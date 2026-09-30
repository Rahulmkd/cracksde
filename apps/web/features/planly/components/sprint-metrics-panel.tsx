"use client";

import React from "react";
import { TrendingUp, Clock, Layers, Calendar } from "lucide-react";
import { formatMinutes } from "@/lib/formatters";
import type { StudyPlanDto } from "@starter/shared";

interface SprintMetricsPanelProps {
  plan?: StudyPlanDto;
}

export function SprintMetricsPanel({ plan }: SprintMetricsPanelProps) {
  const sprints = plan?.sprints || [];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);

  const totalTasks = plan?.totalTasks ?? (allTasks.length || 847);
  const completedTasks =
    plan?.completedTasks ?? allTasks.filter((t) => t.status === "completed").length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalDays = plan?.totalDays ?? (allDays.length || 56);
  const completedDays =
    plan?.completedDays ??
    allDays.filter((d) => (d.tasksCompleted || 0) >= (d.tasksTotal || 1) && (d.tasksTotal || 0) > 0)
      .length;

  // Time calculations
  const totalMinutes =
    plan?.totalEstimatedMinutes ||
    allTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 20), 0) ||
    16253; // ~270h 53m
  const completedMinutes =
    plan?.completedEstimatedMinutes ||
    allTasks
      .filter((t) => t.status === "completed")
      .reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes || 20), 0) ||
    0;

  const timeSpentStr = formatMinutes(completedMinutes);
  const totalTimeStr = formatMinutes(totalMinutes);

  // Sprints calculation
  const totalSprints = sprints.length || 9;
  const completedSprints =
    plan?.completedSprints ?? sprints.filter((s) => s.status === "completed").length;

  // Est. Completion Date calculation
  const baseStartDate = plan?.startDate ? new Date(plan.startDate) : new Date(2026, 9, 1);
  const estEndDate = plan?.targetDate
    ? new Date(plan.targetDate)
    : new Date(baseStartDate.getTime() + totalDays * 24 * 60 * 60 * 1000);

  const estDayMonth = !isNaN(estEndDate.getTime())
    ? estEndDate.toLocaleDateString("en-US", { day: "numeric", month: "short" })
    : "30 Nov";
  const estYear = !isNaN(estEndDate.getTime()) ? estEndDate.getFullYear() : "2026";

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-subtle select-none">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 divide-y lg:divide-y-0 sm:divide-x-0">
        {/* Metric 1: Overall Progress */}
        <div className="space-y-1.5 pt-2 first:pt-0 lg:pt-0">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium tracking-tight">Overall progress</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-zinc-100">{progressPercent} %</span>
            <span className="text-xs text-zinc-500 font-mono">
              {completedDays} / {totalDays} days
            </span>
          </div>
        </div>

        {/* Metric 2: Time Spent */}
        <div className="space-y-1.5 pt-2 lg:pt-0">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium tracking-tight">Time spent</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-zinc-100">{timeSpentStr}</span>
            <span className="text-xs text-zinc-500 font-mono">of {totalTimeStr}</span>
          </div>
        </div>

        {/* Metric 3: Sprints Completed */}
        <div className="space-y-1.5 pt-2 lg:pt-0">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Layers className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium tracking-tight">Sprints completed</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-zinc-100">{completedSprints}</span>
            <span className="text-xs text-zinc-500 font-mono">of {totalSprints} sprints</span>
          </div>
        </div>

        {/* Metric 4: Est. Completion */}
        <div className="space-y-1.5 pt-2 lg:pt-0">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium tracking-tight">Est. completion</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-zinc-100">{estDayMonth}</span>
            <span className="text-xs text-zinc-500 font-mono">{estYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
