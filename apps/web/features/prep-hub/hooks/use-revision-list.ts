"use client";

import { useQuery } from "@tanstack/react-query";
import { studyPlanService } from "@/services/study-plan-service";
import { useAuth } from "@/hooks/use-auth";

export function useRevisionList() {
  const { user } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useQuery({
    queryKey: ["revision-list", userId],
    queryFn: () => studyPlanService.getRevisionList(),
    staleTime: 1000 * 60 * 2,
  });
}
