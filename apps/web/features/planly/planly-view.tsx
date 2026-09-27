"use client";

import React, { useState, useEffect } from "react";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useRevisionList } from "@/hooks/use-revision-list";
import { useUserRevisions, useSolveQuestion } from "@/hooks/use-roadmap";
import { usePlannerStore } from "@/store/planner-store";
import { toast } from "sonner";

import { PlanStatsHeader } from "./components/plan-stats-header";
import { SprintItem } from "./components/sprint-item";
import { PlanCalendarView } from "./components/plan-calendar-view";
import { AdjustPlanModal } from "./components/modals/adjust-plan-modal";
import { StartDateModal } from "./components/modals/start-date-modal";
import { RevisionQueueModal } from "./components/modals/revision-queue-modal";
import { RenamePlanModal } from "./components/modals/rename-plan-modal";
import { CatchupModal } from "./components/modals/catchup-modal";

import type { StudyTaskDto, UserRevisionItemDto } from "@cracksde/shared";

export function PlanlyView() {
  const {
    plan,
    isLoading,
    isError,
    updateTask,
    isUpdatingTask,
    updatePlan,
    isUpdatingPlan,
  } = useStudyPlan("crack-sde");

  const { data: userRevisionsData } = useUserRevisions();
  const solveMutation = useSolveQuestion();
  const { addPoints } = usePlannerStore();

  const [viewMode, setViewMode] = useState<"tree" | "calendar">("tree");
  const [expandedSprintId, setExpandedSprintId] = useState<string>("");
  const [expandedDayId, setExpandedDayId] = useState<string>("");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  // Modals state
  const [isStartDateModalOpen, setIsStartDateModalOpen] = useState(false);
  const [isAdjustPlanModalOpen, setIsAdjustPlanModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isCatchupModalOpen, setIsCatchupModalOpen] = useState(false);

  useEffect(() => {
    if (plan?.sprints && plan.sprints.length > 0 && !expandedSprintId) {
      const activeSprint = plan.sprints.find((s) => s.status === "in_progress") || plan.sprints[0];
      setExpandedSprintId(activeSprint.sprintId);

      if (activeSprint.days && activeSprint.days.length > 0) {
        const activeDay =
          activeSprint.days.find((d) => d.status === "in_progress" || d.tasksCompleted < d.tasksTotal) ||
          activeSprint.days[0];
        setExpandedDayId(activeDay.dayId);
      }
    }
  }, [plan, expandedSprintId]);

  const handleToggleTask = (task: StudyTaskDto) => {
    const isCompleted = task.status === "completed";
    const nextStatus = isCompleted ? "not_started" : "completed";

    updateTask(
      { taskId: task.taskId, status: nextStatus },
      {
        onSuccess: () => {
          if (!isCompleted) {
            addPoints(10);
            toast.success("Task completed! +10 XP earned 🚀");
          }
        },
      }
    );
  };

  const handleToggleRevisionStar = (task: StudyTaskDto) => {
    const nextRevision = !task.isRevision;
    updateTask(
      { taskId: task.taskId, isRevision: nextRevision },
      {
        onSuccess: () => {
          toast.success(nextRevision ? "Added to Revision Queue 🌟" : "Removed from Revision Queue");
        },
      }
    );
  };

  const handleSolveRevisionQuestion = (itemId: number, isCorrect: boolean) => {
    solveMutation.mutate(
      { itemId, isCorrect },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "Revision recorded! 🎯");
        },
      }
    );
  };

  const handleSaveStartDate = (startDate: string) => {
    updatePlan(
      { startDate },
      {
        onSuccess: () => {
          setIsStartDateModalOpen(false);
          toast.success("Schedule recalculated with new start date!");
        },
      }
    );
  };

  const handleSavePace = (dailyHours: number) => {
    updatePlan(
      { dailyHours },
      {
        onSuccess: () => {
          setIsAdjustPlanModalOpen(false);
          toast.success(`Study pace adjusted to ${dailyHours}h/day!`);
        },
      }
    );
  };

  const handleSavePlanName = (name: string) => {
    updatePlan(
      { name },
      {
        onSuccess: () => {
          setIsRenameModalOpen(false);
          toast.success("Study plan renamed successfully!");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted-foreground font-medium">Loading Study Plan & Sprints...</p>
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="py-16 text-center">
        <p className="text-base font-semibold text-rose-400">Failed to load study plan.</p>
        <p className="text-xs text-muted-foreground mt-1">Please ensure the backend API server is active.</p>
      </div>
    );
  }

  const catchupDaysCount = (plan.sprints || [])
    .flatMap((s) => s.days || [])
    .filter((d) => d.isCatchUpDay).length;

  const revisionItems: UserRevisionItemDto[] = userRevisionsData?.items || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Plan Header */}
      <PlanStatsHeader
        plan={plan}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenStartDateModal={() => setIsStartDateModalOpen(true)}
        onOpenAdjustPlanModal={() => setIsAdjustPlanModalOpen(true)}
        onOpenRevisionModal={() => setIsRevisionModalOpen(true)}
        onOpenRenameModal={() => setIsRenameModalOpen(true)}
        onOpenCatchupModal={() => setIsCatchupModalOpen(true)}
        isActionMenuOpen={isActionMenuOpen}
        setIsActionMenuOpen={setIsActionMenuOpen}
      />

      {/* Main View: Sprint Tree vs Calendar */}
      {viewMode === "calendar" ? (
        <PlanCalendarView
          plan={plan}
          onSelectDay={(sprintId, dayId) => {
            setExpandedSprintId(sprintId);
            setExpandedDayId(dayId);
            setViewMode("tree");
          }}
        />
      ) : (
        <div className="space-y-4">
          {(plan.sprints || []).map((sprint) => (
            <SprintItem
              key={sprint.sprintId}
              sprint={sprint}
              isExpanded={expandedSprintId === sprint.sprintId}
              onToggleExpand={() =>
                setExpandedSprintId((prev) => (prev === sprint.sprintId ? "" : sprint.sprintId))
              }
              expandedDayId={expandedDayId}
              onToggleDayExpand={(dayId) =>
                setExpandedDayId((prev) => (prev === dayId ? "" : dayId))
              }
              onToggleTask={handleToggleTask}
              onToggleRevisionStar={handleToggleRevisionStar}
              isUpdatingTask={isUpdatingTask}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AdjustPlanModal
        isOpen={isAdjustPlanModalOpen}
        onClose={() => setIsAdjustPlanModalOpen(false)}
        dailyHours={plan.dailyHours || 4}
        onSave={handleSavePace}
        isSaving={isUpdatingPlan}
      />

      <StartDateModal
        isOpen={isStartDateModalOpen}
        onClose={() => setIsStartDateModalOpen(false)}
        initialStartDate={plan.startDate}
        onSave={handleSaveStartDate}
        isSaving={isUpdatingPlan}
      />

      <RevisionQueueModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        revisionItems={revisionItems}
        onSolveQuestion={handleSolveRevisionQuestion}
      />

      <RenamePlanModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        currentName={plan.name}
        onSave={handleSavePlanName}
        isSaving={isUpdatingPlan}
      />

      <CatchupModal
        isOpen={isCatchupModalOpen}
        onClose={() => setIsCatchupModalOpen(false)}
        catchupDaysCount={catchupDaysCount}
      />
    </div>
  );
}
