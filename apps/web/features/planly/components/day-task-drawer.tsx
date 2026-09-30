"use client";

import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMinutes } from "@/lib/formatters";
import { TaskItemRow } from "./task-item-row";
import type { StudyDayDto, StudyTaskDto } from "@starter/shared";

interface DayTaskDrawerProps {
  day: StudyDayDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleTaskStatus: (task: StudyTaskDto) => void;
  isUpdatingTask?: boolean;
}

export function DayTaskDrawer({
  day,
  isExpanded,
  onToggleExpand,
  onToggleTaskStatus,
  isUpdatingTask,
}: DayTaskDrawerProps) {
  const dayNumber = day.planDayNo || day.sprintDayNo || 1;
  const tasks = day.tasks || [];
  const totalMinutes =
    day.estimatedMinutes ||
    tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 20), 0) ||
    233; // ~3h 53m

  return (
    <div className="relative pl-5 space-y-1.5">
      {/* Day Header Trigger */}
      <div
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-zinc-900/60 active:bg-zinc-900/80 cursor-pointer select-none group transition-colors -ml-1.5"
        aria-expanded={isExpanded}
        aria-label={`Toggle Day ${dayNumber}`}
      >
        <div className="flex items-center gap-2">
          {/* Day Tree Node Icon */}
          <div
            className={cn(
              "w-4.5 h-4.5 rounded-full border border-blue-500/40 bg-zinc-950 flex items-center justify-center text-blue-400 shrink-0 transition-colors shadow-xs group-hover:border-blue-400",
              isExpanded && "bg-blue-600/15 text-blue-300 border-blue-400"
            )}
          >
            {isExpanded ? (
              <ChevronDown className="h-2.5 w-2.5" />
            ) : (
              <ChevronRight className="h-2.5 w-2.5" />
            )}
          </div>

          <span className="text-[13px] font-semibold text-zinc-100 group-hover:text-white transition-colors">
            Day {dayNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400">
            Est. {formatMinutes(totalMinutes)}
          </span>
          <ChevronRight
            className={cn(
              "h-3 w-3 text-zinc-600 group-hover:text-zinc-300 transition-transform duration-150",
              isExpanded && "rotate-90 text-zinc-300"
            )}
          />
        </div>
      </div>

      {/* Tasks List (indented under Day) */}
      {isExpanded && (
        <div className="relative border-l border-zinc-800/80 ml-0.5 pl-2.5 py-0.5 space-y-0.5 animate-in fade-in-50 duration-150">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItemRow
                key={task.taskId}
                task={task}
                onToggleStatus={onToggleTaskStatus}
                isUpdating={isUpdatingTask}
              />
            ))
          ) : (
            <div className="py-2 text-[11px] text-zinc-500 italic pl-2.5">
              No topics scheduled for this day yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
