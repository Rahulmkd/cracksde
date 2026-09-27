"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useRoadmapSubjects,
  useRoadmapSubjectDetail,
  useSolveQuestion,
} from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

import { SubjectCard } from "./components/subject-card";
import { SubjectDetailView } from "./components/subject-detail-view";
import { SolveQuestionDialog } from "./components/modals/solve-question-dialog";

import type { RoadmapItemDto } from "@cracksde/shared";

export function PrepHubView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectSlugParam = searchParams.get("subject") || "";

  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>(subjectSlugParam);
  const [activeSolveItem, setActiveSolveItem] = useState<RoadmapItemDto | null>(null);

  const { data: subjects, isLoading: isLoadingSubjects } = useRoadmapSubjects();
  const {
    data: subjectDetail,
    isLoading: isLoadingDetail,
  } = useRoadmapSubjectDetail(selectedSubjectSlug);

  const solveMutation = useSolveQuestion();

  const handleSelectSubject = (slug: string) => {
    setSelectedSubjectSlug(slug);
    router.push(`/prep-hub?subject=${slug}`, { scroll: false });
  };

  const handleBackToGrid = () => {
    setSelectedSubjectSlug("");
    router.push("/prep-hub", { scroll: false });
  };

  const handleSolveQuestion = (itemId: number, isCorrect: boolean, notes?: string) => {
    solveMutation.mutate(
      { itemId, isCorrect, notes },
      {
        onSuccess: (data) => {
          setActiveSolveItem(null);
          toast.success(data?.message || "Progress updated! 🎯");
        },
        onError: () => {
          toast.error("Failed to save progress. Please try again.");
        },
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {selectedSubjectSlug && subjectDetail ? (
        <SubjectDetailView
          subject={subjectDetail}
          onBack={handleBackToGrid}
          onOpenSolveDialog={(item) => setActiveSolveItem(item)}
        />
      ) : (
        <div>
          {/* Main Prep Hub Grid Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Prep Hub Curriculum Tracks
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Structured learning roadmaps from foundational Data Structures to High-Level Distributed Systems.
            </p>
          </div>

          {isLoadingSubjects ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs text-muted-foreground">Loading curriculum tracks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(subjects || []).map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onSelectSubject={handleSelectSubject}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Solve Question Modal */}
      <SolveQuestionDialog
        isOpen={Boolean(activeSolveItem)}
        onClose={() => setActiveSolveItem(null)}
        item={activeSolveItem}
        onSolve={handleSolveQuestion}
        isSubmitting={solveMutation.isPending}
      />
    </div>
  );
}
