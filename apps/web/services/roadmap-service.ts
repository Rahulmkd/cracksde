import { api } from "./api-client";
import type {
  ApiResponse,
  RoadmapSubjectSummaryDto,
  RoadmapSubjectDetailDto,
  TopicQuestionsResponseDto,
  UserRevisionListDto,
  RecordQuestionSolveResponse,
  PracticeProblemsResponseDto,
  CreateRoadmapItemRequest,
  CreateRoadmapItemResponse,
} from "@cracksde/shared";

export interface PracticeProblemsFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  topic?: string;
  difficulty?: string;
  status?: string;
}

export const roadmapService = {
  /**
   * Fetch summary list of all available roadmap subjects (DSA, DBMS, OS, etc.)
   */
  async getSubjects(): Promise<RoadmapSubjectSummaryDto[]> {
    const res = await api.get<ApiResponse<RoadmapSubjectSummaryDto[]>>("/api/roadmap/subjects");
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch roadmap subjects");
    }
    return res.data;
  },

  /**
   * Fetch full subject details including all modules and topic breakdowns
   */
  async getSubjectDetail(slug: string): Promise<RoadmapSubjectDetailDto> {
    const res = await api.get<ApiResponse<RoadmapSubjectDetailDto>>(`/api/roadmap/subjects/${slug}`);
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch subject details");
    }
    return res.data;
  },

  /**
   * Fetch paginated and filtered practice problem bank
   */
  async getPracticeProblems(params: PracticeProblemsFilterParams = {}): Promise<PracticeProblemsResponseDto> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.search) queryParams.set("search", params.search);
    if (params.subject && params.subject !== "all") queryParams.set("subject", params.subject);
    if (params.topic && params.topic !== "all") queryParams.set("topic", params.topic);
    if (params.difficulty && params.difficulty !== "all") queryParams.set("difficulty", params.difficulty);
    if (params.status && params.status !== "all") queryParams.set("status", params.status);

    const queryString = queryParams.toString();
    const endpoint = `/api/roadmap/practice${queryString ? `?${queryString}` : ""}`;

    const res = await api.get<ApiResponse<PracticeProblemsResponseDto>>(endpoint);
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch practice problems");
    }
    return res.data;
  },

  /**
   * Fetch all questions and solution items for a specific topic within a subject
   */
  async getTopicQuestions(subjectSlug: string, topicSlug: string): Promise<TopicQuestionsResponseDto> {
    const res = await api.get<ApiResponse<TopicQuestionsResponseDto>>(
      `/api/roadmap/subjects/${subjectSlug}/topics/${topicSlug}/questions`
    );
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch topic questions");
    }
    return res.data;
  },

  /**
   * Fetch user's spaced repetition revision items (due, upcoming, completed)
   */
  async getUserRevisions(): Promise<UserRevisionListDto> {
    const res = await api.get<ApiResponse<UserRevisionListDto>>("/api/roadmap/user/revisions");
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch user revisions");
    }
    return res.data;
  },

  /**
   * Record a question solve attempt with correctness flag and optional notes
   */
  async solveQuestion(
    itemId: number,
    payload: { isCorrect: boolean; notes?: string }
  ): Promise<RecordQuestionSolveResponse> {
    const res = await api.post<ApiResponse<RecordQuestionSolveResponse>>(
      `/api/roadmap/items/${itemId}/solve`,
      payload
    );
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to record question progress");
    }
    return res.data;
  },

  /**
   * Add a new custom problem / roadmap item to the curriculum catalog
   */
  async createRoadmapItem(data: CreateRoadmapItemRequest): Promise<CreateRoadmapItemResponse> {
    const res = await api.post<ApiResponse<CreateRoadmapItemResponse>>("/api/roadmap/items", data);
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to create question");
    }
    return res.data;
  },
};
