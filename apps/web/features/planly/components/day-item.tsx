import React from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TaskRow } from "./task-row";
import { cn } from "@/lib/utils";
import type { StudyDayDto, StudyTaskDto } from "@cracksde/shared";

interface DayItemProps {
  day: StudyDayDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleTask: (task: StudyTaskDto) => void;
  onToggleRevisionStar: (task: StudyTaskDto) => void;
  isUpdatingTask?: boolean;
}

export function DayItem({
  day,
  isExpanded,
  onToggleExpand,
  onToggleTask,
  onToggleRevisionStar,
  isUpdatingTask = false,
}: DayItemProps) {
  const isCompleted = day.status === "completed";
  const isInProgress = day.status === "in_progress";
  const tasksTotal = day.tasksTotal || day.tasks.length || 0;
  const tasksCompleted = day.tasksCompleted || day.tasks.filter((t) => t.status === "completed").length;
  const percent = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  const dateFormatted = day.calendarDate
    ? new Date(day.calendarDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : `Day ${day.planDayNo}`;

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all mb-3 overflow-hidden",
        isCompleted
          ? "bg-card/40 border-border/40"
          : isInProgress
          ? "bg-card/80 border-primary/40 shadow-xs"
          : "bg-card/30 border-border/40 hover:border-border/70"
      )}
    >
      {/* Day Header Bar */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">
            {isExpanded ? <ChevronDown className="w-4 h-4 text-foreground" /> : <ChevronRight className="w-4 h-4" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Day {day.planDayNo}
                <span className="text-muted-foreground font-normal text-xs ml-1.5">
                  (Sprint Day {day.sprintDayNo})
                </span>
              </span>
              {day.isCatchUpDay && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-400 border-amber-500/30 bg-amber-500/10">
                  <Sparkles className="w-2.5 h-2.5 mr-1" /> Catch-up Day
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3" />
              {dateFormatted}
            </p>
          </div>
        </div>

        {/* Day Stats & Progress */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium text-foreground">
              {tasksCompleted} / {tasksTotal} tasks
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Progress value={percent} className="w-16 h-1.5 bg-muted/60" />
              <span className="text-[10px] text-muted-foreground">{percent}%</span>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "text-xs px-2 py-0.5 font-normal",
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : isInProgress
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-muted-foreground border-border/40"
            )}
          >
            {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming"}
          </Badge>
        </div>
      </button>

      {/* Expanded Tasks List */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border/30 space-y-2 bg-background/20">
          {day.tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2 text-center italic">
              No tasks scheduled for this day. Free study or catch-up time!
            </p>
          ) : (
            day.tasks.map((task) => (
              <TaskRow
                key={task.taskId}
                task={task}
                onToggleTask={onToggleTask}
                onToggleRevisionStar={onToggleRevisionStar}
                isUpdating={isUpdatingTask}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
