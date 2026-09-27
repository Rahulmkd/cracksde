import React from "react";
import { Check, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RevisionBadge } from "@/components/shared/revision-badge";
import { cn } from "@/lib/utils";
import type { StudyTaskDto } from "@cracksde/shared";

interface TaskRowProps {
  task: StudyTaskDto;
  onToggleTask: (task: StudyTaskDto) => void;
  onToggleRevisionStar: (task: StudyTaskDto) => void;
  isUpdating?: boolean;
}

export function TaskRow({
  task,
  onToggleTask,
  onToggleRevisionStar,
  isUpdating = false,
}: TaskRowProps) {
  const isCompleted = task.status === "completed";
  const item = task.item;
  const title = item?.title || "Scheduled Study Activity";
  const diff = item?.difficulty || "Medium";
  const itemType = item?.type || "Problem";
  const minutes = task.estimatedMinutes || 15;

  const revisionStatusText = item?.progress?.revisionStatusText || "Not Solved Yet";
  const isDue = Boolean(item?.progress?.isDue);

  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all text-xs",
        isCompleted
          ? "bg-card/30 border-border/30 opacity-75"
          : "bg-background/60 hover:bg-card border-border/50 hover:border-primary/30 shadow-xs"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Completion Checkbox */}
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onToggleTask(task)}
          className={cn(
            "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer",
            isCompleted
              ? "bg-primary border-primary text-primary-foreground shadow-xs"
              : "border-border/80 hover:border-primary bg-background/50 hover:bg-background"
          )}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Title & Tags */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "font-medium truncate",
                isCompleted ? "line-through text-muted-foreground" : "text-foreground"
              )}
            >
              {title}
            </span>
            {item?.subjectName && (
              <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted/40 shrink-0">
                {item.subjectName}
              </span>
            )}
          </div>
          {item?.topicName && (
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {item.topicName} {item.subtopicName ? `› ${item.subtopicName}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Meta chips & Revision Status */}
      <div className="flex items-center gap-2 shrink-0">
        <RevisionBadge statusText={revisionStatusText} isDue={isDue} size="sm" />

        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-1.5 py-0.5 font-normal",
            diff.toLowerCase() === "easy"
              ? "text-emerald-400 border-emerald-500/20"
              : diff.toLowerCase() === "hard"
              ? "text-rose-400 border-rose-500/20"
              : "text-amber-400 border-amber-500/20"
          )}
        >
          {diff}
        </Badge>

        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground/70" />
          {minutes}m
        </span>

        {/* Revision Star Bookmark */}
        <button
          type="button"
          onClick={() => onToggleRevisionStar(task)}
          className={cn(
            "p-1 rounded-md transition-colors cursor-pointer",
            task.isRevision
              ? "text-amber-400 hover:text-amber-300"
              : "text-muted-foreground/40 hover:text-amber-400"
          )}
          title={task.isRevision ? "Marked for Spaced Revision" : "Mark for Revision"}
        >
          <Star className={cn("w-3.5 h-3.5", task.isRevision ? "fill-amber-400" : "")} />
        </button>
      </div>
    </div>
  );
}
