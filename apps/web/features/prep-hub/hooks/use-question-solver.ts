"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roadmapService } from "@/services/roadmap-service";
import { toast } from "sonner";

export interface SolveQuestionVariables {
  itemId: number;
  isCorrect: boolean;
  notes?: string;
}

export function useQuestionSolver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      isCorrect,
      notes,
    }: SolveQuestionVariables) => roadmapService.solveQuestion(itemId, { isCorrect, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice-problems"] });
      queryClient.invalidateQueries({ queryKey: ["user-revisions"] });
      queryClient.invalidateQueries({ queryKey: ["topic-questions"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subject"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["study-plan"] });
      queryClient.invalidateQueries({ queryKey: ["revision-list"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Progress saved successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save question solve progress");
    },
  });
}

export const useSolveQuestion = useQuestionSolver;
