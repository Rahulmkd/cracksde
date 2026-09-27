import React from "react";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StudyPlanDto, StudyDayDto } from "@cracksde/shared";

interface PlanCalendarViewProps {
  plan: StudyPlanDto;
  onSelectDay: (sprintId: string, dayId: string) => void;
}

export function PlanCalendarView({ plan, onSelectDay }: PlanCalendarViewProps) {
  const sprints = plan.sprints || [];
  const allDays = sprints.flatMap((s) =>
    (s.days || []).map((d) => ({
      ...d,
      sprintNo: s.sprintNo,
      parentSprintId: s.sprintId,
    }))
  );

  return (
    <div className="bg-card/40 border border-border/60 rounded-2xl p-5 md:p-6 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-foreground">Timeline Calendar Matrix</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview of all sprint days, task loads, and completion milestones
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {allDays.length} Scheduled Days
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2.5">
        {allDays.map((day) => {
          const isCompleted = day.status === "completed";
          const isInProgress = day.status === "in_progress";
          const tasksTotal = day.tasksTotal || day.tasks?.length || 0;
          const tasksCompleted = day.tasksCompleted || 0;

          const dateStr = day.calendarDate
            ? new Date(day.calendarDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : `Day ${day.planDayNo}`;

          return (
            <button
              key={day.dayId}
              type="button"
              onClick={() => onSelectDay(day.parentSprintId, day.dayId)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between min-h-[95px]",
                isCompleted
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : isInProgress
                  ? "bg-primary/10 border-primary/40 text-primary shadow-xs"
                  : "bg-background/40 hover:bg-card border-border/40 text-foreground"
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold">
                    D{day.planDayNo}
                  </span>
                  <span className="text-[10px] opacity-70">
                    S{day.sprintNo}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{dateStr}</p>
              </div>

              <div className="mt-2 pt-1 border-t border-border/20 flex items-center justify-between">
                <span className="text-[10px] font-medium">
                  {tasksCompleted}/{tasksTotal}
                </span>
                {day.isCatchUpDay ? (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Clock className="w-3 h-3 text-muted-foreground/60" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
