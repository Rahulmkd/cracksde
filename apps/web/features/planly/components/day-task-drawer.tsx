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
    <div className="relative pl-6 space-y-2">
      {/* Day Header Trigger */}
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-900/40 cursor-pointer select-none group transition-colors -ml-2"
      >
        <div className="flex items-center gap-2.5">
          {/* Day Tree Node Icon */}
          <button
            type="button"
            className={cn(
              "w-5 h-5 rounded-full border border-blue-500/50 bg-zinc-950 flex items-center justify-center text-blue-400 shrink-0 transition-colors shadow-xs group-hover:border-blue-400",
              isExpanded && "bg-blue-600/10 text-blue-300"
            )}
            aria-label={`Toggle Day ${dayNumber}`}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>

          <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
            Day {dayNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">
            Est. {formatMinutes(totalMinutes)}
          </span>
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-transform duration-150",
              isExpanded && "rotate-90 text-zinc-300"
            )}
          />
        </div>
      </div>

      {/* Tasks List (indented under Day) */}
      {isExpanded && (
        <div className="relative border-l border-zinc-800/80 ml-0.5 pl-3 py-1 space-y-0.5 animate-in fade-in-50 duration-150">
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
            <div className="py-2 text-xs text-zinc-500 italic pl-3">
              No topics scheduled for this day yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
