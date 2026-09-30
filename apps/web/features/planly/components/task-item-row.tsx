"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudyTaskDto } from "@starter/shared";

interface TaskItemRowProps {
  task: StudyTaskDto;
  onToggleStatus: (task: StudyTaskDto) => void;
  isUpdating?: boolean;
}

export function TaskItemRow({ task, onToggleStatus, isUpdating }: TaskItemRowProps) {
  const isCompleted = task.status === "completed";
  const [isStarred, setIsStarred] = useState(false);

  const title = task.item?.title || "Study Topic Task";
  const minutes = task.estimatedMinutes || 20;

  return (
    <div
      onClick={() => onToggleStatus(task)}
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors group select-none cursor-pointer",
        "hover:bg-zinc-900/60",
        isCompleted && "opacity-60"
      )}
    >
      {/* Left: Status circle & Topic name */}
      <div className="flex items-center gap-3 overflow-hidden flex-1 pr-2">
        <button
          type="button"
          disabled={isUpdating}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(task);
          }}
          className="shrink-0 text-zinc-600 hover:text-blue-400 transition-colors"
          aria-label={`Toggle completion for ${title}`}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/10" />
          ) : (
            <Circle className="h-4 w-4 text-zinc-600 hover:text-zinc-400" />
          )}
        </button>

        <span
          className={cn(
            "font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors truncate text-[13px]",
            isCompleted && "line-through text-zinc-500"
          )}
        >
          {title}
        </span>
      </div>

      {/* Right: Star icon, Estimated duration, and Arrow */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsStarred(!isStarred);
          }}
          className="text-zinc-600 hover:text-amber-400 transition-colors p-0.5"
          aria-label="Star topic"
        >
          <Star
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              isStarred
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-600 hover:text-amber-400"
            )}
          />
        </button>

        <span className="text-xs font-mono text-zinc-500 min-w-[55px] text-right">
          Est. {minutes} min
        </span>

        <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>
    </div>
  );
}
