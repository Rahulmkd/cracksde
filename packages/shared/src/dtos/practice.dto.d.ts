import { UserItemProgressDto } from "./progress.dto.js";
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
export interface PracticeFilters {
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
    topic?: string;
    difficulty?: string;
    status?: string;
}
//# sourceMappingURL=practice.dto.d.ts.map