"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roadmapService, type PracticeProblemsFilterParams } from "@/services/roadmap-service";
import { useAuth } from "@/hooks/use-auth";
import type { CreateRoadmapItemRequest } from "@starter/shared";

export function useRoadmapSubjects() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useQuery({
    queryKey: ["roadmap-subjects", userId],
    queryFn: () => roadmapService.getSubjects(),
    enabled: !isAuthLoading,
    staleTime: 1000 * 60 * 2,
  });
}

export function usePracticeProblems(params: PracticeProblemsFilterParams = {}) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useQuery({
    queryKey: ["practice-problems", params, userId],
    queryFn: () => roadmapService.getPracticeProblems(params),
    enabled: !isAuthLoading,
    staleTime: 1000 * 60 * 2,
  });
}

export function useRoadmapSubjectDetail(slug: string) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useQuery({
    queryKey: ["roadmap-subject", slug, userId],
    queryFn: () => roadmapService.getSubjectDetail(slug),
    enabled: !isAuthLoading && !!slug,
    staleTime: 1000 * 60 * 2,
  });
}

export function useTopicQuestions(subjectSlug: string, topicSlug: string) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useQuery({
    queryKey: ["topic-questions", subjectSlug, topicSlug, userId],
    queryFn: () => roadmapService.getTopicQuestions(subjectSlug, topicSlug),
    enabled: !isAuthLoading && !!subjectSlug && !!topicSlug,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUserRevisions() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useQuery({
    queryKey: ["user-revisions", userId],
    queryFn: () => roadmapService.getUserRevisions(),
    enabled: !isAuthLoading,
    staleTime: 1000 * 60 * 2,
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
