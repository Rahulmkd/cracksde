import { RevisionStatusCode } from "../enums/index.js";
export interface UserItemProgressDto {
    id?: string;
    userId?: string;
    itemId: number;
    status: string;
    solveCount: number;
    lastSolvedAt?: string | null;
    nextRevisionAt?: string | null;
    lastScore?: boolean | null;
    notes?: string | null;
    completedAt?: string | null;
    revisionStatusText: string;
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
//# sourceMappingURL=progress.dto.d.ts.map