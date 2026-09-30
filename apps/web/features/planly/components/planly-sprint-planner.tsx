"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  SquarePen,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { usePlannerStore } from "@/store/planner-store";
import { useSmartCatchup } from "../hooks/use-smart-catchup";
import { SprintMetricsPanel } from "./sprint-metrics-panel";
import { SprintTimelineCard } from "./sprint-timeline-card";
import { PlanlyScheduleSidebar } from "./planly-schedule-sidebar";
import { SmartCatchupModal } from "./smart-catchup-modal";
import { SprintEditDialog } from "./sprint-edit-dialog";
import { toast } from "sonner";
import type { StudyTaskDto } from "@starter/shared";

export function PlanlySprintPlanner() {
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

  const [expandedSprintId, setExpandedSprintId] = useState<string>("");
  const [expandedDayId, setExpandedDayId] = useState<string>("");

  const [isCatchupModalOpen, setIsCatchupModalOpen] = useState(false);
  const [isAdjustPlanModalOpen, setIsAdjustPlanModalOpen] = useState(false);

  // Initialize first expanded sprint and day
  useEffect(() => {
    if (plan?.sprints && plan.sprints.length > 0 && !expandedSprintId) {
      const activeSprint =
        plan.sprints.find((s) => s.status === "in_progress") || plan.sprints[0];
      setExpandedSprintId(activeSprint.sprintId);

      if (activeSprint.days && activeSprint.days.length > 0) {
        const activeDay =
          activeSprint.days.find(
            (d) => d.status === "in_progress" || (d.tasksCompleted || 0) < (d.tasksTotal || 1)
          ) || activeSprint.days[0];
        setExpandedDayId(activeDay.dayId);
      }
    }
  }, [plan, expandedSprintId]);

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
    <div className="space-y-5 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* 1. Top Header Section: Breadcrumb + Title + Date controls + Adjust Plan button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-1">
        <div className="space-y-1.5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Link href="/planly" className="hover:text-zinc-200 transition-colors">
              Planly
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="font-semibold text-zinc-100">{planTitle}</span>
          </div>

          {/* Title + Edit Icon */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-zinc-100">
              {planTitle}
            </h1>
            <button
              type="button"
              onClick={() => setIsAdjustPlanModalOpen(true)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
              aria-label="Edit plan title and settings"
            >
              <SquarePen className="h-4 w-4" />
            </button>
          </div>

          {/* Sub-row: Edit start date button · Status pill · Scheduled date */}
          <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-zinc-400">
            <button
              type="button"
              onClick={() => setIsAdjustPlanModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/70 hover:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 transition-colors shadow-xs"
            >
              <CalendarIcon className="h-3.5 w-3.5 text-zinc-400" />
              <span>Edit start date</span>
            </button>

            <div className="inline-flex items-center gap-1.5 text-blue-400 font-medium text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>Upcoming</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-400 text-xs">
              <CalendarIcon className="h-3 w-3 text-zinc-500" />
              <span>Scheduled: {formattedScheduledDate}</span>
            </div>
          </div>
        </div>

        {/* Adjust Plan Action Button */}
        <div className="shrink-0 pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdjustPlanModalOpen(true)}
            className="h-8 px-3.5 text-xs font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:text-white text-zinc-200 rounded-lg shadow-subtle transition-all"
          >
            Adjust plan
          </Button>
        </div>
      </div>

      {/* 2. Compact Progress Summary Card */}
      <SprintMetricsPanel plan={plan} />

      {/* 3. Main 2-Column Responsive Layout: Sprint Roadmap Tree (Left) + Schedule Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8 COLS): SPRINT → DAY → TOPIC ROADMAP TREE */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {sprints.length > 0 ? (
            sprints.map((sprint) => (
              <SprintTimelineCard
                key={sprint.sprintId}
                sprint={sprint}
                isExpanded={expandedSprintId === sprint.sprintId}
                expandedDayId={expandedDayId}
                onToggleSprintExpand={() =>
                  setExpandedSprintId(expandedSprintId === sprint.sprintId ? "" : sprint.sprintId)
                }
                onToggleDayExpand={setExpandedDayId}
                onToggleTaskStatus={handleToggleTaskStatus}
                isUpdatingTask={isUpdatingTask}
              />
            ))
          ) : isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-36 rounded-xl border border-zinc-800/80 bg-zinc-900/30 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-zinc-400 text-xs">
              No sprints found in this study schedule.
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* RIGHT SIDEBAR (4 COLS): REVISION LIST & SCHEDULE PREVIEW */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 w-full">
          <PlanlyScheduleSidebar plan={plan} />
        </div>
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
