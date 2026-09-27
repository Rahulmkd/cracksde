import { RoadmapItemDto } from "./roadmap.dto.js";

export interface StudyTaskDto {
  taskId: string;
  dayId: string;
  sprintId: string;
  itemId?: number | null;
  taskOrder: number;
  status: string;
  estimatedMinutes: number;
  actualMinutes: number;
  isCarriedForward: boolean;
  isBacklog: boolean;
  isRevision: boolean;
  item?: RoadmapItemDto | null;
}

export interface StudyDayDto {
  dayId: string;
  sprintId: string;
  planDayNo: number;
  sprintDayNo: number;
  calendarDate?: string | null;
  status: string;
  estimatedMinutes: number;
  actualMinutes: number;
  tasksTotal: number;
  tasksCompleted: number;
  isCatchUpDay: boolean;
  tasks: StudyTaskDto[];
}

export interface StudySprintDto {
  sprintId: string;
  planId: number;
  sprintNo: number;
  status: string;
  plannedStartDate?: string | null;
  plannedEndDate?: string | null;
  initialDaysAssigned: number;
  actualDaysTaken: number;
  totalEstimatedMinutes: number;
  totalActualMinutes: number;
  days?: StudyDayDto[];
}

export interface StudyPlanDto {
  id: number;
  slug: string;
  name: string;
  sourceUrl?: string | null;
  role?: string;
  dailyHours?: number;
  startDate?: string | null;
  targetDate?: string | null;
  totalDays?: number;
  totalEstimatedMinutes?: number;
  completedEstimatedMinutes?: number;
  totalTasks?: number;
  completedTasks?: number;
  progressPercent?: number;
  completedDays?: number;
  completedSprints?: number;
  isOnSchedule?: boolean;
  scheduleStatusText?: string;
  sprints?: StudySprintDto[];
}

export interface UpdateTaskDto {
  status?: string;
  isRevision?: boolean;
  actualMinutes?: number;
}

export interface UpdateStudyPlanDto {
  name?: string;
  startDate?: string;
  dailyHours?: number;
}
