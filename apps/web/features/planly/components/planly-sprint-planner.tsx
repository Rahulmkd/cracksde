"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Sparkles,
  GitBranch,
  Layers,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { usePlannerStore } from "@/store/planner-store";
import { useSmartCatchup } from "../hooks/use-smart-catchup";
import { SprintMetricsPanel } from "./sprint-metrics-panel";
import { SprintTimelineCard } from "./sprint-timeline-card";
import { SmartCatchupModal } from "./smart-catchup-modal";
import { SprintEditDialog } from "./sprint-edit-dialog";
import { toast } from "sonner";
import type { StudyTaskDto, StudySprintDto } from "@starter/shared";

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

  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [expandedSprintId, setExpandedSprintId] = useState<string>("");
  const [expandedDayId, setExpandedDayId] = useState<string>("");

  const [isCatchupModalOpen, setIsCatchupModalOpen] = useState(false);
  const [isAdjustPlanModalOpen, setIsAdjustPlanModalOpen] = useState(false);

  // Initialize expanded IDs
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
  const filteredSprints = sprints.filter((s) => {
    if (activeTab === "completed") return s.status === "completed";
    return s.status !== "completed";
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <GitBranch className="h-3 w-3 text-blue-400" />
            <span>Planly Sprint Roadmap</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            {plan?.name || "9-Sprint Study Schedule"}
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Paced curriculum timeline for software engineering preparation. Track daily sprint progress.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-zinc-800 bg-zinc-900/60">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "active"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Active Sprints
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "completed"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Completed Sprints
          </button>
        </div>
      </div>

      {/* Metrics Ribbon & Overview */}
      <SprintMetricsPanel
        plan={plan}
        onOpenCatchupModal={() => setIsCatchupModalOpen(true)}
        onOpenAdjustPlanModal={() => setIsAdjustPlanModalOpen(true)}
      />

      {/* Sprint Timeline Cards List */}
      <div className="space-y-4">
        {filteredSprints.length > 0 ? (
          filteredSprints.map((sprint) => (
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
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-zinc-400 text-xs">
            {activeTab === "completed"
              ? "No completed sprints yet. Keep studying to finish Sprint 1!"
              : "All sprints completed! Excellent work."}
          </div>
        )}
      </div>

      {/* Modals */}
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
        onSave={handleSavePlan}
        isSaving={isUpdatingPlan}
      />
    </div>
  );
}
