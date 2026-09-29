import type { PracticeProblemDto, UserItemProgressDto } from "@starter/shared";

export type { PracticeProblemDto, UserItemProgressDto };

export interface PracticeFilterState {
  search: string;
  subject: string;
  difficulty: string;
  pattern: string;
  status: string;
  page: number;
  pageSize: number;
}

export interface PracticeStats {
  totalProblems: number;
  totalSolved: number;
  totalDue: number;
}

export interface PracticePaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}
