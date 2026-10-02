import { useMemo } from "react";
import type { StudyPlanDto } from "@cracksde/shared";
import type { SmartCatchupResult } from "../types";

export function useSmartCatchup(plan?: StudyPlanDto | null): SmartCatchupResult {
  return useMemo(() => {
    if (!plan || !plan.sprints) {
      return {
        overdueTasksCount: 0,
        overdueMinutes: 0,
        remainingDaysCount: 0,
        extraMinutesPerDay: 0,
        redistributedDays: [],
      };
    }

    const sprints = plan.sprints;
    const allDays = sprints.flatMap((s) => s.days || []);
    
    // Incomplete tasks from days marked in_progress or before current date
    const overdueTasks = allDays
      .filter((d) => d.status === "in_progress" || (d.tasksCompleted || 0) < (d.tasksTotal || 1))
      .flatMap((d) => (d.tasks || []).filter((t) => t.status !== "completed"));

    const overdueTasksCount = overdueTasks.length;
    const overdueMinutes = overdueTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 20), 0);

    const upcomingDays = allDays.filter((d) => d.status === "upcoming");
    const remainingDaysCount = Math.max(1, upcomingDays.length);

    const extraMinutesPerDay = Math.round(overdueMinutes / remainingDaysCount);

    const redistributedDays = upcomingDays.slice(0, 7).map((d) => ({
      dayId: d.dayId,
      dayNumber: d.planDayNo || d.sprintDayNo,
      tasksCount: (d.tasks?.length || 0) + Math.ceil(overdueTasksCount / remainingDaysCount),
      newTotalMinutes: (d.estimatedMinutes || 120) + extraMinutesPerDay,
    }));

    return {
      overdueTasksCount,
      overdueMinutes,
      remainingDaysCount,
      extraMinutesPerDay,
      redistributedDays,
    };
  }, [plan]);
}
