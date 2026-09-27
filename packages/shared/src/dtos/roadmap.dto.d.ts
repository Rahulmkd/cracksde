import { UserItemProgressDto } from "./progress.dto.js";
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
export interface CreateRoadmapItemRequest {
    title: string;
    subjectId: number;
    topicId: number;
    subtopicId?: number | null;
    difficulty?: string;
    estimatedMinutes?: number;
    type?: string;
}
export interface CreateRoadmapItemResponse {
    item: RoadmapItemDto;
    message: string;
}
//# sourceMappingURL=roadmap.dto.d.ts.map