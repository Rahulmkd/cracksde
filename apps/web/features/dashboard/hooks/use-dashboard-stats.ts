"use client";

import { useMemo } from "react";
import { useStudyPlan } from "@/features/planly/hooks/use-study-plan";
import { useRoadmapSubjects } from "@/features/prep-hub/hooks/use-roadmap";
import { useProfileStats } from "@/features/profile/hooks/use-profile";
import { usePlannerStore } from "@/store/planner-store";
import type { RoadmapSubjectSummaryDto, StudySprintDto, StudyTaskDto } from "@cracksde/shared";

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
  const { data: profileStatsData, isLoading: isProfileLoading } = useProfileStats();
  const { streak: storeStreak, points: storePoints, tasks: dailyTasks } = usePlannerStore();

  const stats = useMemo(() => {
    // Sprints calculation
    const sprints: StudySprintDto[] = plan?.sprints || [];
    const activeSprintData =
      sprints.find((s) => s.status === "in_progress") || sprints[0];

    const allSprintDays = activeSprintData?.days || [];
    const allSprintTasks: StudyTaskDto[] = allSprintDays.flatMap((d) => d.tasks || []);
    const completedTasks = allSprintTasks.filter((t) => t.status === "completed").length;
    const totalTasks = allSprintTasks.length > 0 ? allSprintTasks.length : 1;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

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

    const totalCompletedItems =
      profileStatsData?.totalSolved ??
      subjects.reduce((acc: number, s: RoadmapSubjectSummaryDto) => acc + (s.totalSolved || 0), 0);
    const totalItems =
      profileStatsData?.totalCurriculumItems ??
      (subjects.reduce((acc: number, s: RoadmapSubjectSummaryDto) => acc + (s.totalItems || 0), 0) || 847);
    const overallPercentage =
      profileStatsData?.overallPercentage ??
      (totalItems > 0 ? Math.round((totalCompletedItems / totalItems) * 100) : 0);

    const completedTodayCount = dailyTasks.filter((t) => t.completed).length;

    const dynamicPoints = profileStatsData?.studyPoints ?? storePoints ?? 0;
    const dynamicStreak = profileStatsData?.streakDays ?? storeStreak ?? 0;

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
        totalItems,
        percentage: overallPercentage,
      },
      dailyStats: {
        streakDays: dynamicStreak,
        points: dynamicPoints,
        tasksTodayCount: dailyTasks.length,
        completedTodayCount,
      },
      subjectBreakdown,
      isLoading: isPlanLoading || isSubjectsLoading || isProfileLoading,
    };
  }, [
    plan,
    subjectsData,
    profileStatsData,
    isPlanLoading,
    isSubjectsLoading,
    isProfileLoading,
    storeStreak,
    storePoints,
    dailyTasks,
  ]);

  return stats;
}
