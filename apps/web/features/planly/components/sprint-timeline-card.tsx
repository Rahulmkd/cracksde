"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMinutes } from "@/lib/formatters";
import { DayTaskDrawer } from "./day-task-drawer";
import type { StudySprintDto, StudyTaskDto } from "@cracksde/shared";

interface SprintTimelineCardProps {
  sprint: StudySprintDto;
  isExpanded: boolean;
  expandedDayIds: Record<string, boolean>;
  onToggleSprintExpand: () => void;
  onToggleDayExpand: (dayId: string) => void;
  onToggleTaskStatus: (task: StudyTaskDto) => void;
  isUpdatingTask?: boolean;
}

export function SprintTimelineCard({
  sprint,
  isExpanded,
  expandedDayIds,
  onToggleSprintExpand,
  onToggleDayExpand,
  onToggleTaskStatus,
  isUpdatingTask,
}: SprintTimelineCardProps) {
  const isCompleted = sprint.status === "completed";
  const isInProgress = sprint.status === "in_progress";
  const days = sprint.days || [];
  const allTasks = days.flatMap((d) => d.tasks || []);

  const totalMinutes =
    sprint.totalEstimatedMinutes ??
    allTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 20), 0);
  const spentMinutes =
    sprint.totalActualMinutes ??
    allTasks
      .filter((t) => t.status === "completed")
      .reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes || 20), 0);

  const formattedSpent = spentMinutes > 0 ? formatMinutes(spentMinutes) : "0 sec";
  const formattedEst = formatMinutes(totalMinutes);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3.5 space-y-3 shadow-subtle overflow-hidden">
      {/* Sprint Header Row */}
      <div
        onClick={onToggleSprintExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleSprintExpand();
          }
        }}
        className="flex items-center justify-between gap-3 cursor-pointer select-none group p-1 -m-1 rounded-lg hover:bg-zinc-800/30 active:bg-zinc-800/50 transition-colors"
        aria-expanded={isExpanded}
        aria-label={`Toggle Sprint ${sprint.sprintNo}`}
      >
        {/* Left: Radio circle + Sprint badge + Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 bg-zinc-950 flex items-center justify-center shrink-0">
            {isCompleted ? (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ) : isInProgress ? (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            ) : null}
          </div>

          <div className="rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-semibold px-2.5 py-0.5 text-[11px] font-mono">
            Sprint {sprint.sprintNo}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            <span>
              {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming"}
            </span>
          </div>
        </div>

        {/* Right: Est. time · Time spent & Chevron toggle */}
        <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 font-mono">
          <span className="hidden sm:inline text-zinc-400">
            Est. {formattedEst} &middot; Time spent : {formattedSpent}
          </span>
          <span className="sm:hidden text-zinc-400">
            {formattedEst}
          </span>

          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-200",
              isExpanded && "rotate-180 text-zinc-200"
            )}
          />
        </div>
      </div>

      {/* Indented Tree Structure (Sprint -> Days -> Topics) */}
      {isExpanded && (
        <div className="relative border-l-2 border-blue-500/25 ml-1.5 pl-2 pt-0.5 pb-0.5 space-y-2.5 animate-in fade-in-0 duration-150">
          {days.length > 0 ? (
            days.map((day) => (
              <DayTaskDrawer
                key={day.dayId}
                day={day}
                isExpanded={Boolean(expandedDayIds[day.dayId])}
                onToggleExpand={() => onToggleDayExpand(day.dayId)}
                onToggleTaskStatus={onToggleTaskStatus}
                isUpdatingTask={isUpdatingTask}
              />
            ))
          ) : (
            <div className="py-3 text-center text-[11px] text-zinc-500 italic">
              No day intervals assigned for this sprint.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
