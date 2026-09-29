"use client";

import React from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  RotateCcw,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMinutes } from "@/lib/formatters";
import type { StudyPlanDto } from "@starter/shared";

interface SprintMetricsPanelProps {
  plan?: StudyPlanDto;
  onOpenCatchupModal: () => void;
  onOpenAdjustPlanModal: () => void;
}

export function SprintMetricsPanel({
  plan,
  onOpenCatchupModal,
  onOpenAdjustPlanModal,
}: SprintMetricsPanelProps) {
  const sprints = plan?.sprints || [];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);

  const totalTasks = plan?.totalTasks ?? (allTasks.length || 847);
  const completedTasks =
    plan?.completedTasks ?? allTasks.filter((t) => t.status === "completed").length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalDays = plan?.totalDays ?? (allDays.length || 61);
  const completedDays =
    plan?.completedDays ??
    allDays.filter((d) => (d.tasksCompleted || 0) >= (d.tasksTotal || 1) && (d.tasksTotal || 0) > 0)
      .length;

  return (
    <div className="space-y-4 select-none">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 border-zinc-800/80 bg-zinc-900/40 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Overall Progress</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-[20px] font-bold text-zinc-100 font-mono">
            {progressPercent}%
          </div>
          <Progress value={progressPercent} className="h-1" />
        </Card>

        <Card className="p-4 border-zinc-800/80 bg-zinc-900/40 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Tasks Solved</span>
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-[20px] font-bold text-zinc-100 font-mono">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">{totalTasks - completedTasks} remaining</p>
        </Card>

        <Card className="p-4 border-zinc-800/80 bg-zinc-900/40 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Sprint Days</span>
            <CalendarDays className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-[20px] font-bold text-zinc-100 font-mono">
            {completedDays}/{totalDays}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">{totalDays - completedDays} days left</p>
        </Card>

        <Card className="p-4 border-zinc-800/80 bg-zinc-900/40 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Daily Target</span>
            <Clock className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-[20px] font-bold text-zinc-100 font-mono">
            {plan?.dailyHours || 4}h/day
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">Role Paced</p>
        </Card>
      </div>

      {/* Quick Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span>Fell behind schedule? Use smart catch-up to redistribute tasks.</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCatchupModal}
            className="h-7 text-xs font-medium border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Smart Catch-Up Mode
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenAdjustPlanModal}
            className="h-7 text-xs font-medium border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
          >
            <Settings2 className="h-3 w-3 mr-1" /> Adjust Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
