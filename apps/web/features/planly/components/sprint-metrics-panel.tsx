"use client";

import React from "react";
import { TrendingUp, Clock, Layers, Calendar } from "lucide-react";
import { formatMinutes } from "@/lib/formatters";
import type { StudyPlanDto } from "@cracksde/shared";

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
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 shadow-subtle select-none">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Overall Progress */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <TrendingUp className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="text-[11px] font-medium tracking-tight">Overall progress</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] sm:text-[20px] font-bold font-mono text-zinc-100 leading-none">
              {progressPercent} %
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {completedDays} / {totalDays} days
            </span>
          </div>
        </div>

        {/* Metric 2: Time Spent */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="text-[11px] font-medium tracking-tight">Time spent</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] sm:text-[20px] font-bold font-mono text-zinc-100 leading-none">
              {timeSpentStr}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">of {totalTimeStr}</span>
          </div>
        </div>

        {/* Metric 3: Sprints Completed */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Layers className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="text-[11px] font-medium tracking-tight">Sprints completed</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] sm:text-[20px] font-bold font-mono text-zinc-100 leading-none">
              {completedSprints}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">of {totalSprints} sprints</span>
          </div>
        </div>

        {/* Metric 4: Est. Completion */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="text-[11px] font-medium tracking-tight">Est. completion</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] sm:text-[20px] font-bold font-mono text-zinc-100 leading-none">
              {estDayMonth}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">{estYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
