"use client";

import React from "react";
import Link from "next/link";
import { Star, Calendar, Layers, Clock } from "lucide-react";
import { formatMinutes } from "@/lib/formatters";
import type { StudyPlanDto, StudyTaskDto } from "@starter/shared";

interface PlanlyScheduleSidebarProps {
  plan?: StudyPlanDto;
  onViewAllRevisions?: () => void;
}

export function PlanlyScheduleSidebar({
  plan,
  onViewAllRevisions,
}: PlanlyScheduleSidebarProps) {
  // Extract first sprint & active day for preview
  const firstSprint = plan?.sprints?.[0];
  const previewDay =
    plan?.sprints?.flatMap((s) => s.days || []).find((d) => (d.tasksCompleted || 0) < (d.tasksTotal || 1)) ||
    firstSprint?.days?.[0];

  const previewTasks = previewDay?.tasks || [];
  const topicsCount = previewTasks.length || 20;

  const totalDayMinutes =
    previewDay?.estimatedMinutes ||
    previewTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 20), 0) ||
    233; // ~3h 53m

  // Format start date and calculate countdown
  const baseStartDate = plan?.startDate ? new Date(plan.startDate) : new Date(2026, 9, 1);
  const now = new Date();
  const diffDays = Math.ceil(
    (baseStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formattedStartDate = !isNaN(baseStartDate.getTime())
    ? baseStartDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "1 Oct 2026";

  const countdownText =
    diffDays > 0 ? `Starts in ${diffDays} days` : diffDays === 0 ? "Starts today" : "Study plan active";

  // Default fallback topics if tasks are empty during load
  const displayTasks: Array<{ title: string; duration: string }> =
    previewTasks.length > 0
      ? previewTasks.map((t) => ({
          title: t.item?.title || "Topic Task",
          duration: `${t.estimatedMinutes || 20}m`,
        }))
      : [
          { title: "Linear Search", duration: "4m" },
          { title: "Largest Element", duration: "5m" },
          { title: "Second Largest Element", duration: "15m" },
          { title: "Maximum Consecutive Ones", duration: "3m" },
          { title: "Left Rotate Array by One", duration: "6m" },
          { title: "Left Rotate Array by K Places", duration: "17m" },
          { title: "Move Zeros to End", duration: "13m" },
        ];

  return (
    <aside className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-4 shadow-subtle select-none">
      {/* 1. Revision List Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-zinc-200 fill-zinc-200" />
          <h2 className="text-sm font-semibold text-zinc-100">Revision list</h2>
        </div>
        <Link
          href="/prep-hub"
          onClick={onViewAllRevisions}
          className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* 2. Starts in X days Banner */}
      <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-3 space-y-1">
        <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>{countdownText}</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Your plan is ready. Study sessions begin on {formattedStartDate}.
        </p>
      </div>

      {/* 3. Day Schedule Preview Section */}
      <div className="space-y-3 pt-1">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Scheduled for {formattedStartDate}
          </h3>
          <p className="text-xs text-zinc-500 font-normal mt-0.5">
            Day {previewDay?.planDayNo || 1} &middot; Schedule preview
          </p>
        </div>

        {/* Topics Count & Planned Time */}
        <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-zinc-500" />
            <span>{topicsCount} topics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>{formatMinutes(totalDayMinutes)} planned</span>
          </div>
        </div>

        {/* Compact Topics List */}
        <div className="space-y-2 pt-1">
          {displayTasks.slice(0, 8).map((task, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-0.5 hover:text-zinc-100 transition-colors group"
            >
              <span className="text-zinc-300 group-hover:text-zinc-100 truncate pr-2">
                {task.title}
              </span>
              <span className="text-zinc-500 font-mono shrink-0 text-right">
                {task.duration}
              </span>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div className="border-t border-zinc-800/60 pt-3">
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Browse your schedule now. Task timers and progress tracking become available when your plan starts.
          </p>
        </div>
      </div>
    </aside>
  );
}
