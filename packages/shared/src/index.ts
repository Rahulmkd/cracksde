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

export interface UserItemProgressDto {
  id?: string;
  userId?: string;
  itemId: number;
  status: string; // "not_started" | "completed" | "needs_revision" | "mastered"
  solveCount: number;
  lastSolvedAt?: string | null;
  nextRevisionAt?: string | null;
  lastScore?: boolean | null;
  notes?: string | null;
  completedAt?: string | null;
  revisionStatusText: string; // "Revision Due" | "Due Tomorrow" | "Next Revision: 5 Oct" | "Not Solved Yet"
  isDue: boolean;
}

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
  topicSlug?: string;
  topicName?: string;
  subtopicName?: string | null;
  userProgress?: {
    status: string;
    notes?: string | null;
    completedAt?: string | null;
  } | null;
  progress?: UserItemProgressDto | null;
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
  totalQuestions?: number;
  solvedQuestions?: number;
  dueQuestions?: number;
  hasRevisionDue?: boolean;
  revisionStatusText?: string;
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
  totalSolved?: number;
  totalDue?: number;
  hasRevisionDue?: boolean;
}

export interface RoadmapSubjectDetailDto {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  estimatedHours: number;
  totalMinutes: number;
  sortOrder: number;
  totalSolved?: number;
  totalDue?: number;
  hasRevisionDue?: boolean;
  topics: RoadmapTopicDto[];
}

export interface TopicQuestionsResponseDto {
  subject: {
    id: number;
    slug: string;
    name: string;
  };
  topic: {
    id: number;
    slug: string;
    name: string;
    estimatedMinutes: number;
    totalQuestions: number;
    solvedQuestions: number;
    dueQuestions: number;
    hasRevisionDue: boolean;
    revisionStatusText: string;
  };
  questions: RoadmapItemDto[];
}

export interface UserRevisionItemDto extends RoadmapItemDto {
  topicSlug?: string;
  progress: UserItemProgressDto;
}

export interface UserRevisionListDto {
  dueCount: number;
  totalCount: number;
  items: UserRevisionItemDto[];
}

export interface RecordQuestionSolveRequest {
  isCorrect: boolean;
  notes?: string;
}

export interface RecordQuestionSolveResponse {
  progress: UserItemProgressDto;
  message: string;
}

export interface PracticeProblemDto {
  id: string;
  itemId: number;
  itemNo: number;
  title: string;
  slug: string;
  type: string;
  difficulty: string;
  estimatedMinutes: number;
  subject: string;
  subjectSlug: string;
  topic: string;
  topicSlug: string;
  subtopic?: string | null;
  subtopicSlug?: string | null;
  solved: boolean;
  bookmarked: boolean;
  userStatus: "not_solved" | "solved" | "due" | "upcoming";
  userStatusText: string;
  lastSolvedAt?: string | null;
  nextRevisionAt?: string | null;
  solveCount: number;
  revisionStatusText: string;
  isDue: boolean;
  progress?: UserItemProgressDto | null;
}

export interface PracticeProblemsResponseDto {
  problems: PracticeProblemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  stats: {
    totalProblems: number;
    totalSolved: number;
    totalDue: number;
  };
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

// ============================================================================
// Constants
// ============================================================================

export const APP_NAME = "Crack SDE";
export const DEFAULT_API_PORT = 5001;
export const DEFAULT_WEB_PORT = 3000;
