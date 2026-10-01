"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  SquarePen,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DailyPlanner } from "@/components/layout/daily-planner";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerStore } from "@/store/planner-store";
import { useSmartCatchup } from "../hooks/use-smart-catchup";
import { SprintMetricsPanel } from "./sprint-metrics-panel";
import { SprintTimelineCard } from "./sprint-timeline-card";
import { SmartCatchupModal } from "./smart-catchup-modal";
import { SprintEditDialog } from "./sprint-edit-dialog";
import { toast } from "sonner";
import type { StudyTaskDto } from "@starter/shared";

export function PlanlySprintPlanner() {
  const { user } = useAuth();
  const userId = user?.id ?? "anonymous";

  const {
    plan,
    isLoading,
    isError,
    error,
    refetch,
    updateTask,
    isUpdatingTask,
    updatePlan,
    isUpdatingPlan,
  } = useStudyPlan("crack-sde");

  const { addPoints } = usePlannerStore();
  const catchupData = useSmartCatchup(plan);

  // User-isolated expand/collapse states for sprints and days
  const [expandedSprintIds, setExpandedSprintIds] = useState<Record<string, boolean>>({});
  const [expandedDayIds, setExpandedDayIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedSprints = localStorage.getItem(`cracksde_planly_expanded_sprints_${userId}`);
      setExpandedSprintIds(savedSprints ? JSON.parse(savedSprints) : {});
      const savedDays = localStorage.getItem(`cracksde_planly_expanded_days_${userId}`);
      setExpandedDayIds(savedDays ? JSON.parse(savedDays) : {});
    } catch {
      setExpandedSprintIds({});
      setExpandedDayIds({});
    }
  }, [userId]);

  const [isCatchupModalOpen, setIsCatchupModalOpen] = useState(false);
  const [isAdjustPlanModalOpen, setIsAdjustPlanModalOpen] = useState(false);

  const handleToggleSprintExpand = (sprintId: string) => {
    setExpandedSprintIds((prev) => {
      const next = {
        ...prev,
        [sprintId]: !prev[sprintId],
      };
      try {
        localStorage.setItem(`cracksde_planly_expanded_sprints_${userId}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToggleDayExpand = (dayId: string) => {
    setExpandedDayIds((prev) => {
      const next = {
        ...prev,
        [dayId]: !prev[dayId],
      };
      try {
        localStorage.setItem(`cracksde_planly_expanded_days_${userId}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToggleTaskStatus = (task: StudyTaskDto) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    updateTask(
      {
        taskId: task.taskId,
        status: nextStatus,
        actualMinutes: nextStatus === "completed" ? task.estimatedMinutes || 20 : 0,
      },
      {
        onSuccess: () => {
          if (nextStatus === "completed") {
            addPoints(15);
            toast.success(`🎉 Completed task! (+15 pts)`);
          }
        },
      }
    );
  };

  const handleSavePlan = (name: string, dailyHours: number, startDate?: string) => {
    updatePlan(
      { name, dailyHours, startDate },
      {
        onSuccess: () => {
          setIsAdjustPlanModalOpen(false);
          toast.success("Study plan updated successfully");
        },
      }
    );
  };

  const handleApplyCatchup = () => {
    setIsCatchupModalOpen(false);
    toast.success("🚀 Smart Catch-Up applied! Tasks redistributed across upcoming sprint days.");
  };

  const sprints = plan?.sprints || [];

  const baseStartDate = plan?.startDate ? new Date(plan.startDate) : new Date(2026, 9, 1);
  const formattedScheduledDate = !isNaN(baseStartDate.getTime())
    ? baseStartDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "1 Oct 2026";

  const planTitle = plan?.name || "Crack SDE";

  if (isError) {
    return (
      <div className="py-16 text-center space-y-3 select-none">
        <AlertTriangle className="h-9 w-9 text-rose-400 mx-auto" />
        <h2 className="text-base font-semibold text-zinc-100">Failed to load study plan</h2>
        <p className="text-xs text-zinc-400">
          {error instanceof Error ? error.message : "Error connecting to the database."}
        </p>
        <Button
          size="sm"
          onClick={() => refetch()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 mt-2"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* 2-Column Responsive Layout matching Prep Hub & Practice proportions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8-9 COLS): PLANLY SPRINT PLANNER */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* 1. Header Section: Breadcrumb + Title + Date controls + Adjust Plan button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-0.5">
            <div className="space-y-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[12px] text-zinc-400">
                <Link href="/planly" className="hover:text-zinc-200 transition-colors">
                  Planly
                </Link>
                <span className="text-zinc-600">/</span>
                <span className="font-semibold text-zinc-100">{planTitle}</span>
              </div>

              {/* Title + Edit Icon */}
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-bold leading-tight tracking-tight text-zinc-100">
                  {planTitle}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsAdjustPlanModalOpen(true)}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors p-0.5 rounded hover:bg-zinc-800/60"
                  aria-label="Edit plan title and settings"
                >
                  <SquarePen className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Sub-row: Edit start date button · Status pill · Scheduled date */}
              <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-[11px] text-zinc-400">
                <button
                  type="button"
                  onClick={() => setIsAdjustPlanModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:text-zinc-100 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors shadow-subtle"
                >
                  <CalendarIcon className="h-3 w-3 text-zinc-400" />
                  <span>Edit start date</span>
                </button>

                <div className="inline-flex items-center gap-1.5 text-blue-400 font-medium text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Upcoming</span>
                </div>

                <div className="flex items-center gap-1 text-zinc-400 text-[11px] font-mono">
                  <CalendarIcon className="h-3 w-3 text-zinc-500" />
                  <span>Scheduled: {formattedScheduledDate}</span>
                </div>
              </div>
            </div>

            {/* Adjust Plan Action Button */}
            <div className="shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAdjustPlanModalOpen(true)}
                className="h-8 px-3 text-[12px] font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:text-white text-zinc-200 rounded-lg shadow-subtle transition-all"
              >
                Adjust plan
              </Button>
            </div>
          </div>

          {/* 2. Compact Progress Summary Card */}
          <SprintMetricsPanel plan={plan} />

          {/* 3. Sprint Timeline Cards List */}
          <div className="space-y-3">
            {sprints.length > 0 ? (
              sprints.map((sprint) => (
                <SprintTimelineCard
                  key={sprint.sprintId}
                  sprint={sprint}
                  isExpanded={Boolean(expandedSprintIds[sprint.sprintId])}
                  expandedDayIds={expandedDayIds}
                  onToggleSprintExpand={() => handleToggleSprintExpand(sprint.sprintId)}
                  onToggleDayExpand={handleToggleDayExpand}
                  onToggleTaskStatus={handleToggleTaskStatus}
                  isUpdatingTask={isUpdatingTask}
                />
              ))
            ) : isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl border border-zinc-800/80 bg-zinc-900/30 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-zinc-400 text-xs">
                No sprints found in this study schedule.
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT SIDEBAR (4 COLS / 3 COLS XL): DAILY PLANNER */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3 w-full">
          <div className="sticky top-20 space-y-6">
            <DailyPlanner showProblemOfTheDay={false} />
          </div>
        </aside>
      </div>

      {/* 4. Modals */}
      <SmartCatchupModal
        open={isCatchupModalOpen}
        onOpenChange={setIsCatchupModalOpen}
        catchupData={catchupData}
        onApplyCatchup={handleApplyCatchup}
      />

      <SprintEditDialog
        open={isAdjustPlanModalOpen}
        onOpenChange={setIsAdjustPlanModalOpen}
        initialName={plan?.name}
        initialHours={plan?.dailyHours}
        initialStartDate={plan?.startDate || "2026-10-01"}
        onSave={handleSavePlan}
        isSaving={isUpdatingPlan}
      />
    </div>
  );
}
