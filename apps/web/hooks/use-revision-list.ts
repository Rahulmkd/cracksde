"use client";

import { useQuery } from "@tanstack/react-query";
import { studyPlanService } from "@/services/study-plan-service";

export function useRevisionList() {
  return useQuery({
    queryKey: ["revision-list"],
    queryFn: () => studyPlanService.getRevisionList(),
  });
}
