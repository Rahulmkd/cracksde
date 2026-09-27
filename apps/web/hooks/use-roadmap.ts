"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  RoadmapSubjectSummaryDto,
  RoadmapSubjectDetailDto,
  TopicQuestionsResponseDto,
  UserRevisionListDto,
  RecordQuestionSolveRequest,
  RecordQuestionSolveResponse,
  PracticeProblemDto,
  PracticeProblemsResponseDto,
} from "@starter/shared";

export function useRoadmapSubjects() {
  return useQuery({
    queryKey: ["roadmap-subjects"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<RoadmapSubjectSummaryDto[]>>("/api/roadmap/subjects");
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch roadmap subjects");
      }
      return res.data;
    },
  });
}

export function usePracticeProblems(params: {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  topic?: string;
  difficulty?: string;
  status?: string;
} = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.search) queryParams.set("search", params.search);
  if (params.subject && params.subject !== "all") queryParams.set("subject", params.subject);
  if (params.topic && params.topic !== "all") queryParams.set("topic", params.topic);
  if (params.difficulty && params.difficulty !== "all") queryParams.set("difficulty", params.difficulty);
  if (params.status && params.status !== "all") queryParams.set("status", params.status);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["practice-problems", params],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PracticeProblemsResponseDto>>(
        `/api/roadmap/practice${queryString ? `?${queryString}` : ""}`
      );
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch practice problems");
      }
      return res.data;
    },
  });
}

export function useRoadmapSubjectDetail(slug: string) {
  return useQuery({
    queryKey: ["roadmap-subject", slug],
    queryFn: async () => {
      const res = await api.get<ApiResponse<RoadmapSubjectDetailDto>>(`/api/roadmap/subjects/${slug}`);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch subject details");
      }
      return res.data;
    },
    enabled: !!slug,
  });
}

export function useTopicQuestions(subjectSlug: string, topicSlug: string) {
  return useQuery({
    queryKey: ["topic-questions", subjectSlug, topicSlug],
    queryFn: async () => {
      const res = await api.get<ApiResponse<TopicQuestionsResponseDto>>(
        `/api/roadmap/subjects/${subjectSlug}/topics/${topicSlug}/questions`
      );
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch topic questions");
      }
      return res.data;
    },
    enabled: !!subjectSlug && !!topicSlug,
  });
}

export function useUserRevisions() {
  return useQuery({
    queryKey: ["user-revisions"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<UserRevisionListDto>>("/api/roadmap/user/revisions");
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch user revisions");
      }
      return res.data;
    },
  });
}

export function useSolveQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      isCorrect,
      notes,
    }: {
      itemId: number;
      isCorrect: boolean;
      notes?: string;
    }) => {
      const res = await api.post<ApiResponse<RecordQuestionSolveResponse>>(
        `/api/roadmap/items/${itemId}/solve`,
        { isCorrect, notes }
      );
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to record question progress");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice-problems"] });
      queryClient.invalidateQueries({ queryKey: ["user-revisions"] });
      queryClient.invalidateQueries({ queryKey: ["topic-questions"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subject"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["study-plan"] });
      queryClient.invalidateQueries({ queryKey: ["revision-list"] });
    },
  });
}
