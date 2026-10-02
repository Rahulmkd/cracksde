"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studyPlanService } from "@/services/study-plan-service";
import { useAuth } from "@/hooks/use-auth";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import type { StudyPlanDto } from "@cracksde/shared";
import { toast } from "sonner";

export function useStudyPlan(slug: string = "crack-sde") {
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  const planQuery = useQuery({
    queryKey: ["study-plan", slug, userId],
    queryFn: () => studyPlanService.getStudyPlan(slug),
    enabled: !isAuthLoading && !!slug,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      status,
      isRevision,
      actualMinutes,
    }: {
      taskId: string;
      status?: string;
      isRevision?: boolean;
      actualMinutes?: number;
    }) => studyPlanService.updateTask(taskId, { status, isRevision, actualMinutes }),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<StudyPlanDto | null>(["study-plan", slug, userId], (oldPlan) => {
        if (!oldPlan || !oldPlan.sprints) return oldPlan;

        let totalCompletedTasks = 0;
        let totalPlanTasks = 0;

        const newSprints = oldPlan.sprints.map((sprint) => {
          if (!sprint.days) return sprint;

          let sprintDaysCompleted = 0;

          const newDays = sprint.days.map((day) => {
            if (!day.tasks) return day;

            const newTasks = day.tasks.map((task) =>
              task.taskId === updatedTask.taskId ? { ...task, ...updatedTask } : task
            );

            const completedCount = newTasks.filter((t) => t.status === "completed").length;
            totalCompletedTasks += completedCount;
            totalPlanTasks += newTasks.length;

            const isDayDone = newTasks.length > 0 && completedCount >= newTasks.length;
            if (isDayDone) {
              sprintDaysCompleted++;
            }

            return {
              ...day,
              tasks: newTasks,
              tasksCompleted: completedCount,
              status: isDayDone
                ? ("completed" as const)
                : completedCount > 0
                ? ("in_progress" as const)
                : ("upcoming" as const),
            };
          });

          const isSprintDone = sprint.days.length > 0 && sprintDaysCompleted >= sprint.days.length;
          const anyTaskDone = newDays.some((d) => (d.tasksCompleted || 0) > 0);

          return {
            ...sprint,
            days: newDays,
            status: isSprintDone
              ? ("completed" as const)
              : anyTaskDone
              ? ("in_progress" as const)
              : ("upcoming" as const),
          };
        });

        const completedSprints = newSprints.filter((s) => s.status === "completed").length;
        const progressPercent =
          totalPlanTasks > 0 ? Math.round((totalCompletedTasks / totalPlanTasks) * 100) : 0;

        return {
          ...oldPlan,
          completedTasks: totalCompletedTasks,
          progressPercent,
          completedSprints,
          sprints: newSprints,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["study-plan"] });
      queryClient.invalidateQueries({ queryKey: ["revision-list"] });
      queryClient.invalidateQueries({ queryKey: ["user-revisions"] });
      queryClient.invalidateQueries({ queryKey: ["topic-questions"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subject"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile-stats"] });
      queryClient.invalidateQueries({ queryKey: ["practice-problems"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update task");
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({
      name,
      startDate,
      dailyHours,
    }: {
      name?: string;
      startDate?: string;
      dailyHours?: number;
    }) => studyPlanService.updatePlan(slug, { name, startDate, dailyHours }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-plan"] });
      toast.success("Study plan updated successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update plan");
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: () => studyPlanService.deletePlan(slug),
    onSuccess: () => {
      // Immediately set cached plan to null to prevent stale plan flash
      queryClient.setQueryData(["study-plan", slug, userId], null);

      queryClient.invalidateQueries({ queryKey: ["study-plan"] });
      queryClient.invalidateQueries({ queryKey: ["revision-list"] });
      queryClient.invalidateQueries({ queryKey: ["user-revisions"] });
      queryClient.invalidateQueries({ queryKey: ["topic-questions"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subject"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile-stats"] });
      queryClient.invalidateQueries({ queryKey: ["practice-problems"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(`cracksde_planly_expanded_sprints_${userId}`);
          localStorage.removeItem(`cracksde_planly_expanded_days_${userId}`);
          localStorage.removeItem("cracksde_planly_expanded_sprints");
          localStorage.removeItem("cracksde_planly_expanded_days");
        } catch {}
      }

      useOnboardingStore.getState().resetOnboarding();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete study plan");
    },
  });

  const isActuallyLoading =
    isAuthLoading ||
    planQuery.isLoading ||
    (planQuery.isPending && !planQuery.isError) ||
    (planQuery.fetchStatus === "fetching" && planQuery.data === undefined) ||
    deletePlanMutation.isPending;

  return {
    plan: planQuery.data,
    isLoading: isActuallyLoading,
    isAuthLoading,
    isPlanLoading: planQuery.isLoading || planQuery.isPending,
    isError: !isActuallyLoading && planQuery.isError,
    error: planQuery.error,
    refetch: planQuery.refetch,
    updateTask: updateTaskMutation.mutate,
    isUpdatingTask: updateTaskMutation.isPending,
    updatePlan: updatePlanMutation.mutate,
    isUpdatingPlan: updatePlanMutation.isPending,
    deletePlan: deletePlanMutation.mutateAsync,
    isDeletingPlan: deletePlanMutation.isPending,
  };
}

