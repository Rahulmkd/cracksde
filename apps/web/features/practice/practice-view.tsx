"use client";

import React, { useState, useEffect } from "react";
import {
  usePracticeProblems,
  useRoadmapSubjects,
  useSolveQuestion,
} from "@/hooks/use-roadmap";
import { toast } from "sonner";

import { ProblemStatsCards } from "./components/problem-stats-cards";
import { ProblemFilterBar } from "./components/problem-filter-bar";
import { ProblemTable } from "./components/problem-table";
import { SolveQuestionDialog } from "@/features/prep-hub/components/modals/solve-question-dialog";

import type { RoadmapItemDto } from "@cracksde/shared";

export function PracticeView() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const [activeSolveItem, setActiveSolveItem] = useState<RoadmapItemDto | null>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: subjects = [] } = useRoadmapSubjects();
  const { data: problemsData, isLoading } = usePracticeProblems({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    subject: selectedSubject,
    difficulty: selectedDifficulty,
    status: selectedStatus,
  });

  const solveMutation = useSolveQuestion();

  const handleSolveQuestion = (itemId: number, isCorrect: boolean, notes?: string) => {
    solveMutation.mutate(
      { itemId, isCorrect, notes },
      {
        onSuccess: (data) => {
          setActiveSolveItem(null);
          toast.success(data?.message || "Progress saved! 🚀");
        },
      }
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedSubject("all");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const problems = problemsData?.problems || [];
  const stats = problemsData?.stats || { totalProblems: 0, totalSolved: 0, totalDue: 0 };
  const pagination = problemsData?.pagination || { totalPages: 1 };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Practice Problem Bank
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive coding, system design, and computer science interview question repository.
        </p>
      </div>

      {/* Stats Cards */}
      <ProblemStatsCards
        totalProblems={stats.totalProblems}
        totalSolved={stats.totalSolved}
        totalDue={stats.totalDue}
      />

      {/* Filter Toolbar */}
      <ProblemFilterBar
        search={search}
        onSearchChange={setSearch}
        selectedSubject={selectedSubject}
        onSubjectChange={(val) => {
          setSelectedSubject(val);
          setCurrentPage(1);
        }}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={(val) => {
          setSelectedDifficulty(val);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setCurrentPage(1);
        }}
        subjects={subjects}
        onResetFilters={handleResetFilters}
      />

      {/* Problems Table */}
      <ProblemTable
        problems={problems}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
        onOpenSolveDialog={(item) => setActiveSolveItem(item)}
      />

      {/* Solve / Review Dialog */}
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
