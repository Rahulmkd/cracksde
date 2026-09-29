"use client";

import { useMemo } from "react";
import { useStudyPlan } from "@/features/planly/hooks/use-study-plan";
import { useRoadmapSubjects } from "@/features/prep-hub/hooks/use-roadmap";
import { usePlannerStore } from "@/store/planner-store";
import type { RoadmapSubjectSummaryDto, StudySprintDto, StudyTaskDto } from "@starter/shared";

export interface DashboardStats {
  activeSprint: {
    number: number;
    title: string;
    focusTrack: string;
    completedTasks: number;
    totalTasks: number;
    progressPercentage: number;
    daysRemaining: number;
    status: string;
  };
  overallProgress: {
    completedItems: number;
    totalItems: number;
    percentage: number;
  };
  dailyStats: {
    streakDays: number;
    points: number;
    tasksTodayCount: number;
    completedTodayCount: number;
  };
  subjectBreakdown: Array<{
    slug: string;
    name: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
  isLoading: boolean;
}

export function useDashboardStats(): DashboardStats {
  const { plan, isLoading: isPlanLoading } = useStudyPlan("crack-sde");
  const { data: subjectsData, isLoading: isSubjectsLoading } = useRoadmapSubjects();
  const { streak, points, tasks: dailyTasks } = usePlannerStore();

  const stats = useMemo(() => {
    // Sprints calculation
    const sprints: StudySprintDto[] = plan?.sprints || [];
    const activeSprintData =
      sprints.find((s) => s.status === "in_progress") || sprints[0];

    const allSprintDays = activeSprintData?.days || [];
    const allSprintTasks: StudyTaskDto[] = allSprintDays.flatMap((d) => d.tasks || []);
    const completedTasks = allSprintTasks.filter((t) => t.status === "completed").length;
    const totalTasks = allSprintTasks.length > 0 ? allSprintTasks.length : 1;
    const progressPercentage = Math.round(
      (completedTasks / totalTasks) * 100
    );

    // Subject breakdown
    const subjects: RoadmapSubjectSummaryDto[] = subjectsData || [];
    const subjectBreakdown = subjects.map((sub: RoadmapSubjectSummaryDto) => {
      const completed = sub.totalSolved || 0;
      const total = sub.totalItems || 1;
      const percentage = Math.round((completed / Math.max(1, total)) * 100);
      return {
        slug: sub.slug,
        name: sub.name,
        completed,
        total,
        percentage,
      };
    });

    const totalCompletedItems = subjects.reduce(
      (acc: number, s: RoadmapSubjectSummaryDto) => acc + (s.totalSolved || 0),
      0
    );
    const totalItems = subjects.reduce(
      (acc: number, s: RoadmapSubjectSummaryDto) => acc + (s.totalItems || 0),
      0
    );
    const overallPercentage =
      totalItems > 0
        ? Math.round((totalCompletedItems / totalItems) * 100)
        : 0;

    const completedTodayCount = dailyTasks.filter((t) => t.completed).length;

    return {
      activeSprint: {
        number: activeSprintData?.sprintNo || 1,
        title: `Sprint ${activeSprintData?.sprintNo || 1}: DSA & Core Prep`,
        focusTrack: "DSA (Arrays & Two Pointers)",
        completedTasks,
        totalTasks,
        progressPercentage,
        daysRemaining: 4,
        status: activeSprintData?.status || "in_progress",
      },
      overallProgress: {
        completedItems: totalCompletedItems,
        totalItems: totalItems || 847,
        percentage: overallPercentage,
      },
      dailyStats: {
        streakDays: streak || 1,
        points: points || 0,
        tasksTodayCount: dailyTasks.length,
        completedTodayCount,
      },
      subjectBreakdown,
      isLoading: isPlanLoading || isSubjectsLoading,
    };
  }, [plan, subjectsData, isPlanLoading, isSubjectsLoading, streak, points, dailyTasks]);

  return stats;
}
