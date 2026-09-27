import { RevisionStatusCode } from "../enums/index.js";

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

export interface RevisionStatusInfo {
  text: string;
  isDue: boolean;
  code: RevisionStatusCode;
}

export interface RevisionCalculationResult {
  solveCount: number;
  lastSolvedAt: Date;
  nextRevisionAt: Date;
  lastScore: boolean;
  status: "completed" | "needs_revision" | "mastered";
  revisionStatusText: string;
  isDue: boolean;
}
