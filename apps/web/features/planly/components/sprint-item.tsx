import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Layers,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DayItem } from "./day-item";
import { cn } from "@/lib/utils";
import type { StudySprintDto, StudyTaskDto } from "@cracksde/shared";

interface SprintItemProps {
  sprint: StudySprintDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
  expandedDayId: string;
  onToggleDayExpand: (dayId: string) => void;
  onToggleTask: (task: StudyTaskDto) => void;
  onToggleRevisionStar: (task: StudyTaskDto) => void;
  isUpdatingTask?: boolean;
}

export function SprintItem({
  sprint,
  isExpanded,
  onToggleExpand,
  expandedDayId,
  onToggleDayExpand,
  onToggleTask,
  onToggleRevisionStar,
  isUpdatingTask = false,
}: SprintItemProps) {
  const isCompleted = sprint.status === "completed";
  const isInProgress = sprint.status === "in_progress";

  const days = sprint.days || [];
  const allTasks = days.flatMap((d) => d.tasks || []);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === "completed").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const startFormatted = sprint.plannedStartDate
    ? new Date(sprint.plannedStartDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";
  const endFormatted = sprint.plannedEndDate
    ? new Date(sprint.plannedEndDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";
  const dateRangeText = startFormatted && endFormatted ? `${startFormatted} – ${endFormatted}` : `Sprint ${sprint.sprintNo}`;

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all mb-5 overflow-hidden shadow-xs",
        isCompleted
          ? "bg-card/50 border-border/60"
          : isInProgress
          ? "bg-card/90 border-primary/50 shadow-md ring-1 ring-primary/20"
          : "bg-card/40 border-border/60"
      )}
    >
      {/* Sprint Header */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-muted/15 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Layers className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-foreground">
                Sprint {sprint.sprintNo}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-2.5 py-0.5 font-medium",
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : isInProgress
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "text-muted-foreground border-border/40"
                )}
              >
                {isCompleted ? "Completed" : isInProgress ? "Active Sprint" : "Upcoming"}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateRangeText}</span>
              <span>•</span>
              <span>{days.length} Days</span>
              <span>•</span>
              <span>{totalTasks} Tasks</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-foreground">
              {completedTasks} / {totalTasks} tasks ({progressPercent}%)
            </span>
            <Progress value={progressPercent} className="w-24 h-2 mt-1 bg-muted/60" />
          </div>

          <div className="text-muted-foreground">
            {isExpanded ? <ChevronDown className="w-5 h-5 text-foreground" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Expanded Days Tree */}
      {isExpanded && (
        <div className="p-4 md:p-5 pt-0 border-t border-border/30 bg-background/30">
          <div className="space-y-3 mt-4">
            {days.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center italic">
                No days mapped in this sprint yet.
              </p>
            ) : (
              days.map((day) => (
                <DayItem
                  key={day.dayId}
                  day={day}
                  isExpanded={expandedDayId === day.dayId}
                  onToggleExpand={() => onToggleDayExpand(day.dayId)}
                  onToggleTask={onToggleTask}
                  onToggleRevisionStar={onToggleRevisionStar}
                  isUpdatingTask={isUpdatingTask}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
