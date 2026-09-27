import React from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Layers,
  MoreVertical,
  RotateCcw,
  Sparkles,
  CalendarDays,
  ListTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { StudyPlanDto } from "@cracksde/shared";

interface PlanStatsHeaderProps {
  plan: StudyPlanDto;
  viewMode: "tree" | "calendar";
  onViewModeChange: (mode: "tree" | "calendar") => void;
  onOpenStartDateModal: () => void;
  onOpenAdjustPlanModal: () => void;
  onOpenRevisionModal: () => void;
  onOpenRenameModal: () => void;
  onOpenCatchupModal: () => void;
  isActionMenuOpen: boolean;
  setIsActionMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PlanStatsHeader({
  plan,
  viewMode,
  onViewModeChange,
  onOpenStartDateModal,
  onOpenAdjustPlanModal,
  onOpenRevisionModal,
  onOpenRenameModal,
  onOpenCatchupModal,
  isActionMenuOpen,
  setIsActionMenuOpen,
}: PlanStatsHeaderProps) {
  const totalTasksCount = plan.totalTasks || 0;
  const completedTasksCount = plan.completedTasks || 0;
  const progressPercent = plan.progressPercent || 0;
  const totalDaysCount = plan.totalDays || 0;
  const completedDaysCount = plan.completedDays || 0;
  const totalMinutes = plan.totalEstimatedMinutes || 0;
  const totalHours = Math.round(totalMinutes / 60);

  const startDateFormatted = plan.startDate
    ? new Date(plan.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not Set";

  const targetDateFormatted = plan.targetDate
    ? new Date(plan.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Calculating...";

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-5 md:p-6 mb-8 relative shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{plan.name}</h1>
            <Badge
              variant="outline"
              className={cn(
                "text-xs px-2.5 py-0.5 font-medium",
                plan.isOnSchedule
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              )}
            >
              {plan.scheduleStatusText || "On Track"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span>Target: Software Engineer</span>
            <span>•</span>
            <span>{plan.dailyHours || 4}h/day Pace</span>
            <span>•</span>
            <span>{totalHours} Total Hours</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-background/80 border border-border/60 rounded-lg p-1 flex items-center">
            <Button
              variant={viewMode === "tree" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("tree")}
              className={cn("h-8 text-xs font-medium gap-1.5", viewMode === "tree" ? "shadow-sm" : "text-muted-foreground")}
            >
              <ListTree className="w-3.5 h-3.5" />
              Sprints
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("calendar")}
              className={cn("h-8 text-xs font-medium gap-1.5", viewMode === "calendar" ? "shadow-sm" : "text-muted-foreground")}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Timeline
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenRevisionModal}
            className="h-9 gap-1.5 text-xs border-border/80 bg-background/50 hover:bg-background"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            Revision Queue
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAdjustPlanModal}
            className="h-9 gap-1.5 text-xs border-border/80 bg-background/50 hover:bg-background"
          >
            <Sliders className="w-3.5 h-3.5 text-primary" />
            Adjust Plan
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsActionMenuOpen((prev) => !prev)}
              className="h-9 w-9 border-border/80 bg-background/50 hover:bg-background"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {isActionMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-card border border-border/80 rounded-xl shadow-xl py-1.5 z-30"
                onMouseLeave={() => setIsActionMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    onOpenStartDateModal();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-muted/60 flex items-center gap-2 text-foreground"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  Change Start Date
                </button>
                <button
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    onOpenRenameModal();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-muted/60 flex items-center gap-2 text-foreground"
                >
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  Rename Study Plan
                </button>
                <button
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    onOpenCatchupModal();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-muted/60 flex items-center gap-2 text-foreground"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  Catch-up Optimizer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        <div className="bg-background/40 border border-border/40 rounded-xl p-3.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Overall Progress
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-foreground">{progressPercent}%</span>
            <span className="text-xs text-muted-foreground">
              {completedTasksCount} / {totalTasksCount} tasks
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5 mt-2 bg-muted/60" />
        </div>

        <div className="bg-background/40 border border-border/40 rounded-xl p-3.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" /> Schedule Duration
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-foreground">
              {completedDaysCount} <span className="text-xs font-normal text-muted-foreground">/ {totalDaysCount} days</span>
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {totalDaysCount - completedDaysCount} left
            </span>
          </div>
          <Progress value={totalDaysCount > 0 ? (completedDaysCount / totalDaysCount) * 100 : 0} className="h-1.5 mt-2 bg-muted/60" />
        </div>

        <div className="bg-background/40 border border-border/40 rounded-xl p-3.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" /> Start Date
          </span>
          <div className="mt-1">
            <span className="text-sm font-semibold text-foreground">{startDateFormatted}</span>
            <p className="text-[11px] text-muted-foreground">Day 1 kick-off</p>
          </div>
        </div>

        <div className="bg-background/40 border border-border/40 rounded-xl p-3.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Target Completion
          </span>
          <div className="mt-1">
            <span className="text-sm font-semibold text-foreground">{targetDateFormatted}</span>
            <p className="text-[11px] text-muted-foreground">Sprint finale</p>
          </div>
        </div>
      </div>
    </div>
  );
}
