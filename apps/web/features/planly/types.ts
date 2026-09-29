import type { StudySprintDto, StudyDayDto, StudyTaskDto, StudyPlanDto } from "@starter/shared";

export type PlanlyTab = "active" | "completed";
export type PlanlyViewMode = "tree" | "calendar";

export interface SprintMetrics {
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
  totalDays: number;
  completedDays: number;
  totalMinutes: number;
  completedMinutes: number;
  totalHours: number;
  completedHours: number;
}

export interface SmartCatchupResult {
  overdueTasksCount: number;
  overdueMinutes: number;
  remainingDaysCount: number;
  extraMinutesPerDay: number;
  redistributedDays: Array<{
    dayId: string;
    dayNumber: number;
    tasksCount: number;
    newTotalMinutes: number;
  }>;
}
