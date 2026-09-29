"use client";

import React from "react";
import { ChevronDown, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const isCompleted = (day.tasksCompleted || 0) >= (day.tasksTotal || 1) && (day.tasksTotal || 0) > 0;
  const isInProgress = day.status === "in_progress" || ((day.tasksCompleted || 0) > 0 && !isCompleted);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden shadow-subtle">
      {/* Day Header Trigger */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-800/40 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : isInProgress ? (
            <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shrink-0" />
          ) : (
            <Circle className="h-4 w-4 text-zinc-600 shrink-0" />
          )}

          <div>
            <div className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
              <span>Day {day.planDayNo || day.sprintDayNo}</span>
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              {day.tasksCompleted || 0}/{day.tasksTotal || 0} tasks &middot; {formatMinutes(day.estimatedMinutes || 120)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <Badge variant="success" className="text-[10px] py-0 px-1.5 font-mono">
              Completed
            </Badge>
          ) : isInProgress ? (
            <Badge variant="blue" className="text-[10px] py-0 px-1.5 font-mono">
              In Progress
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono text-zinc-500">
              Upcoming
            </Badge>
          )}

          <ChevronDown
            className={cn(
              "h-4 w-4 text-zinc-500 transition-transform duration-200",
              isExpanded && "rotate-180 text-zinc-200"
            )}
          />
        </div>
      </button>

      {/* Accordion Tasks Content */}
      {isExpanded && (
        <div className="border-t border-zinc-800/60 p-3 bg-zinc-950/40 space-y-2 animate-in fade-in-0 duration-150">
          {(day.tasks && day.tasks.length > 0) ? (
            day.tasks.map((task) => (
              <TaskItemRow
                key={task.taskId}
                task={task}
                onToggleStatus={onToggleTaskStatus}
                isUpdating={isUpdatingTask}
              />
            ))
          ) : (
            <div className="py-4 text-center text-xs text-zinc-500 italic">
              No specific tasks assigned for this day yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
