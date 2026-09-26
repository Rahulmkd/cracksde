// ============================================================================
// Shared Types — used by both frontend and backend
// ============================================================================

/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** User object returned from auth endpoints */
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Session object */
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

/** Auth session response (user + session) */
export interface AuthSession {
  user: User;
  session: Session;
}

/** Health check response */
export interface HealthCheckResponse {
  status: "ok";
  timestamp: string;
  uptime: number;
}

// ============================================================================
// Roadmap Curriculum (Single Source of Truth)
// ============================================================================

export interface RoadmapItemDto {
  id: number;
  subjectId?: number;
  topicId?: number;
  subtopicId?: number | null;
  itemNo?: number;
  title: string;
  slug: string;
  type?: string | null;
  difficulty?: string | null;
  estimatedMinutes?: number;
  sortOrder?: number;
  subjectSlug?: string;
  subjectName?: string;
  topicName?: string;
  subtopicName?: string | null;
  userProgress?: {
    status: string;
    notes?: string | null;
    completedAt?: string | null;
  } | null;
}

export interface RoadmapSubtopicDto {
  id: number;
  topicId: number;
  slug: string;
  name: string;
  estimatedMinutes: number;
  sortOrder: number;
  items: RoadmapItemDto[];
}

export interface RoadmapTopicDto {
  id: number;
  subjectId: number;
  slug: string;
  name: string;
  estimatedMinutes: number;
  sortOrder: number;
  subtopics: RoadmapSubtopicDto[];
  items: RoadmapItemDto[];
}

export interface RoadmapSubjectSummaryDto {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  estimatedHours: number;
  totalMinutes: number;
  sortOrder: number;
  totalTopics: number;
  totalSubtopics: number;
  totalItems: number;
}

export interface RoadmapSubjectDetailDto {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  estimatedHours: number;
  totalMinutes: number;
  sortOrder: number;
  topics: RoadmapTopicDto[];
}

// ============================================================================
// Study Plan & Sprints (Referencing Roadmap Items)
// ============================================================================

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
}

// ============================================================================
// Constants
// ============================================================================

export const APP_NAME = "Crack SDE";
export const DEFAULT_API_PORT = 5001;
export const DEFAULT_WEB_PORT = 3000;
