"use client";

import React from "react";
import { Check, Clock, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatMinutes } from "@/lib/formatters";
import type { StudyTaskDto } from "@starter/shared";

interface TaskItemRowProps {
  task: StudyTaskDto;
  onToggleStatus: (task: StudyTaskDto) => void;
  isUpdating?: boolean;
}

export function TaskItemRow({ task, onToggleStatus, isUpdating }: TaskItemRowProps) {
  const isCompleted = task.status === "completed";

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2.5 rounded-lg border border-zinc-800/60 bg-zinc-950/60 text-[12px] hover:bg-zinc-900/60 transition-all select-none group",
        isCompleted && "opacity-60 bg-zinc-950/30"
      )}
    >
      <div className="flex items-center gap-2.5 overflow-hidden flex-1">
        {/* Toggle completion checkbox */}
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onToggleStatus(task)}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
            isCompleted
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-zinc-700 bg-zinc-900 hover:border-blue-500"
          )}
          aria-label={`Mark task ${task.item?.title || "study task"} as ${isCompleted ? "incomplete" : "complete"}`}
        >
          {isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
        </button>

        <div className="truncate flex-1">
          <span
            onClick={() => onToggleStatus(task)}
            className={cn(
              "font-medium text-zinc-200 cursor-pointer hover:text-blue-400 transition-colors block truncate",
              isCompleted && "line-through text-zinc-500"
            )}
          >
            {task.item?.title || "Study Topic Task"}
          </span>

          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-normal">
            {task.item?.topicName && (
              <span className="truncate">{task.item.topicName}</span>
            )}
            {task.item?.difficulty && (
              <span className="font-mono text-[10px]">&middot; {task.item.difficulty}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {task.isRevision && (
          <Badge variant="warning" className="text-[10px] py-0 px-1.5 font-mono">
            <RotateCcw className="h-2.5 w-2.5 mr-1" /> Revision
          </Badge>
        )}

        <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
          <Clock className="h-3 w-3 text-zinc-500" />
          {formatMinutes(task.estimatedMinutes || 20)}
        </span>
      </div>
    </div>
  );
}
