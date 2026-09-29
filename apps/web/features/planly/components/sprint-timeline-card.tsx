"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { DayTaskDrawer } from "./day-task-drawer";
import type { StudySprintDto, StudyTaskDto } from "@starter/shared";

interface SprintTimelineCardProps {
  sprint: StudySprintDto;
  isExpanded: boolean;
  expandedDayId: string;
  onToggleSprintExpand: () => void;
  onToggleDayExpand: (dayId: string) => void;
  onToggleTaskStatus: (task: StudyTaskDto) => void;
  isUpdatingTask?: boolean;
}

export function SprintTimelineCard({
  sprint,
  isExpanded,
  expandedDayId,
  onToggleSprintExpand,
  onToggleDayExpand,
  onToggleTaskStatus,
  isUpdatingTask,
}: SprintTimelineCardProps) {
  const isCompleted = sprint.status === "completed";
  const isInProgress = sprint.status === "in_progress";
  const days = sprint.days || [];
  const allTasks = days.flatMap((d) => d.tasks || []);
  const completedTasks = allTasks.filter((t) => t.status === "completed").length;
  const progressPercent =
    allTasks.length > 0
      ? Math.round((completedTasks / allTasks.length) * 100)
      : isCompleted
        ? 100
        : 0;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-card">
      {/* Sprint Header */}
      <div
        onClick={onToggleSprintExpand}
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-800/30 transition-colors select-none"
      >
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="blue" className="text-[11px] font-mono py-0 px-2">
              Sprint {sprint.sprintNo}
            </Badge>

            {isCompleted ? (
              <Badge variant="success" className="text-[10px] py-0 px-1.5 font-mono">
                Completed
              </Badge>
            ) : isInProgress ? (
              <Badge variant="warning" className="text-[10px] py-0 px-1.5 font-mono">
                Active Sprint
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono text-zinc-500">
                Upcoming
              </Badge>
            )}

            <span className="text-[12px] text-zinc-400 font-mono">
              {days.length} Days &middot; {allTasks.length} Tasks
            </span>
          </div>

          <h3 className="text-[16px] font-semibold text-zinc-100 flex items-center gap-2">
            <span>Sprint {sprint.sprintNo} Study Milestone</span>
          </h3>
        </div>

        <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
          <div className="w-full sm:w-36 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
              <span>{progressPercent}%</span>
              <span>{completedTasks}/{allTasks.length}</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>

          <div className="flex items-center gap-1.5 text-zinc-500">
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180 text-zinc-200"
              )}
            />
          </div>
        </div>
      </div>

      {/* Days List Container */}
      {isExpanded && (
        <div className="border-t border-zinc-800/80 p-4 bg-zinc-950/50 space-y-2.5 animate-in fade-in-0 duration-150">
          {days.length > 0 ? (
            days.map((day) => (
              <DayTaskDrawer
                key={day.dayId}
                day={day}
                isExpanded={expandedDayId === day.dayId}
                onToggleExpand={() =>
                  onToggleDayExpand(expandedDayId === day.dayId ? "" : day.dayId)
                }
                onToggleTaskStatus={onToggleTaskStatus}
                isUpdatingTask={isUpdatingTask}
              />
            ))
          ) : (
            <div className="py-6 text-center text-xs text-zinc-500 italic">
              No day intervals assigned for this sprint.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
