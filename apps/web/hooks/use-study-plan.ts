"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse, StudyPlanDto, StudyTaskDto } from "@starter/shared";
import { toast } from "sonner";

export function useStudyPlan(slug: string = "crack-sde") {
  const queryClient = useQueryClient();

  const planQuery = useQuery({
    queryKey: ["study-plan", slug],
    queryFn: async () => {
      const res = await api.get<ApiResponse<StudyPlanDto>>(`/api/study-plans/${slug}`);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load study plan");
      }
      return res.data;
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      status,
      isRevision,
      actualMinutes,
    }: {
      taskId: string;
      status?: string;
      isRevision?: boolean;
      actualMinutes?: number;
    }) => {
      const res = await api.patch<ApiResponse<StudyTaskDto>>(
        `/api/study-plans/tasks/${taskId}`,
        { status, isRevision, actualMinutes }
      );
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to update task");
      }
      return res.data;
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<StudyPlanDto>(["study-plan", slug], (oldPlan) => {
        if (!oldPlan || !oldPlan.sprints) return oldPlan;

        const newSprints = oldPlan.sprints.map((sprint) => {
          if (!sprint.days) return sprint;
          const newDays = sprint.days.map((day) => {
            if (!day.tasks) return day;
            const newTasks = day.tasks.map((task) =>
              task.taskId === updatedTask.taskId ? { ...task, ...updatedTask } : task
            );
            const completedCount = newTasks.filter((t) => t.status === "completed").length;
            return {
              ...day,
              tasks: newTasks,
              tasksCompleted: completedCount,
            };
          });
          return {
            ...sprint,
            days: newDays,
          };
        });

        return {
          ...oldPlan,
          sprints: newSprints,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["revision-list"] });
      queryClient.invalidateQueries({ queryKey: ["user-revisions"] });
      queryClient.invalidateQueries({ queryKey: ["topic-questions"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subject"] });
      queryClient.invalidateQueries({ queryKey: ["study-plan", slug] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update task");
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({
      name,
      startDate,
      dailyHours,
    }: {
      name?: string;
      startDate?: string;
      dailyHours?: number;
    }) => {
      const res = await api.patch<ApiResponse<StudyPlanDto>>(
        `/api/study-plans/${slug}`,
        { name, startDate, dailyHours }
      );
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to update study plan");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-plan", slug] });
      toast.success("Study plan updated successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update plan");
    },
  });

  return {
    plan: planQuery.data,
    isLoading: planQuery.isLoading,
    isError: planQuery.isError,
    error: planQuery.error,
    refetch: planQuery.refetch,
    updateTask: updateTaskMutation.mutate,
    isUpdatingTask: updateTaskMutation.isPending,
    updatePlan: updatePlanMutation.mutate,
    isUpdatingPlan: updatePlanMutation.isPending,
  };
}
