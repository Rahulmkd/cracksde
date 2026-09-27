"use client";

import React, { useState } from "react";
import {
  usePracticeProblems,
  useRoadmapSubjects,
  useCreateRoadmapItem,
  useSolveQuestion,
} from "@/hooks/use-roadmap";
import { toast } from "sonner";

import { QuizFilterBar } from "./components/quiz-filter-bar";
import { QuizDirectoryTable } from "./components/quiz-directory-table";
import { AddQuestionModal } from "./components/modals/add-question-modal";
import { SolveQuestionDialog } from "@/features/prep-hub/components/modals/solve-question-dialog";

import type { RoadmapItemDto, CreateRoadmapItemRequest } from "@cracksde/shared";

export function QuizLogView() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeSolveItem, setActiveSolveItem] = useState<RoadmapItemDto | null>(null);

  const { data: subjects = [] } = useRoadmapSubjects();
  const { data: problemsData, isLoading } = usePracticeProblems({
    page,
    limit: pageSize,
    search,
    subject: selectedSubject,
    difficulty: selectedDifficulty,
  });

  const createMutation = useCreateRoadmapItem();
  const solveMutation = useSolveQuestion();

  const handleCreateQuestion = (payload: CreateRoadmapItemRequest) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        toast.success("Question created and added to knowledge tree! 🎉");
      },
      onError: () => {
        toast.error("Failed to create question. Please check inputs.");
      },
    });
  };

  const handleSolveQuestion = (itemId: number, isCorrect: boolean, notes?: string) => {
    solveMutation.mutate(
      { itemId, isCorrect, notes },
      {
        onSuccess: (data) => {
          setActiveSolveItem(null);
          toast.success(data?.message || "Progress updated! 🎯");
        },
      }
    );
  };

  const problems = problemsData?.problems || [];
  const pagination = problemsData?.pagination || { totalPages: 1 };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Curriculum Quiz & Question Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Catalog and manage all curriculum questions, topics, difficulty levels, and knowledge modules.
        </p>
      </div>

      {/* Filter Bar */}
      <QuizFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedSubject={selectedSubject}
        onSubjectChange={(val) => {
          setSelectedSubject(val);
          setPage(1);
        }}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={(val) => {
          setSelectedDifficulty(val);
          setPage(1);
        }}
        subjects={subjects}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetFilters={() => {
          setSearch("");
          setSelectedSubject("all");
          setSelectedDifficulty("all");
          setPage(1);
        }}
      />

      {/* Questions Directory Table */}
      <QuizDirectoryTable
        problems={problems}
        isLoading={isLoading}
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        onOpenSolveDialog={(item) => setActiveSolveItem(item)}
      />

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        subjects={subjects}
        onCreate={handleCreateQuestion}
        isCreating={createMutation.isPending}
      />

      {/* Solve / Inspect Dialog */}
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
