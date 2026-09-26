"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse, RoadmapSubjectSummaryDto, RoadmapSubjectDetailDto } from "@starter/shared";

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
