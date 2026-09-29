"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roadmapService, type PracticeProblemsFilterParams } from "@/services/roadmap-service";
import type {
  CreateRoadmapItemRequest,
} from "@starter/shared";

export function useRoadmapSubjects() {
  return useQuery({
    queryKey: ["roadmap-subjects"],
    queryFn: () => roadmapService.getSubjects(),
  });
}

export function usePracticeProblems(params: PracticeProblemsFilterParams = {}) {
  return useQuery({
    queryKey: ["practice-problems", params],
    queryFn: () => roadmapService.getPracticeProblems(params),
  });
}

export function useRoadmapSubjectDetail(slug: string) {
  return useQuery({
    queryKey: ["roadmap-subject", slug],
    queryFn: () => roadmapService.getSubjectDetail(slug),
    enabled: !!slug,
  });
}

export function useTopicQuestions(subjectSlug: string, topicSlug: string) {
  return useQuery({
    queryKey: ["topic-questions", subjectSlug, topicSlug],
    queryFn: () => roadmapService.getTopicQuestions(subjectSlug, topicSlug),
    enabled: !!subjectSlug && !!topicSlug,
  });
}

export function useUserRevisions() {
  return useQuery({
    queryKey: ["user-revisions"],
    queryFn: () => roadmapService.getUserRevisions(),
  });
}

export function useSolveQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      isCorrect,
      notes,
    }: {
      itemId: number;
      isCorrect: boolean;
      notes?: string;
    }) => roadmapService.solveQuestion(itemId, { isCorrect, notes }),
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

export function useCreateRoadmapItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoadmapItemRequest) => roadmapService.createRoadmapItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice-problems"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subject"] });
      queryClient.invalidateQueries({ queryKey: ["topic-questions"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-summary"] });
      queryClient.invalidateQueries({ queryKey: ["study-plan"] });
    },
  });
}
