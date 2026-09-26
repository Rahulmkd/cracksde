"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse, StudyTaskDto } from "@starter/shared";

export function useRevisionList() {
  return useQuery({
    queryKey: ["revision-list"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<StudyTaskDto[]>>("/api/study-plans/revision-list");
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to fetch revision list");
      }
      return res.data;
    },
  });
}
