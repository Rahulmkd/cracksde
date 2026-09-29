"use client";

import React, { useState, useMemo } from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  usePracticeProblems,
  useRoadmapSubjects,
  useRoadmapSubjectDetail,
  useSolveQuestion,
} from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerStore } from "@/store/planner-store";
import { CURRICULUM_TOPICS } from "@/constants/curriculum-topics";
import { toast } from "sonner";
import { usePracticeFilters } from "../hooks/use-practice-filters";
import { PracticeFilterBar } from "./practice-filter-bar";
import { PracticeTable } from "./practice-table";
import { ProblemNoteModal } from "./random-problem-card";
import type { PracticeProblemDto } from "../types";

export function PracticeQuestionBank() {
  const { isAuthenticated } = useAuth();
  const { addPoints } = usePlannerStore();
  const solveMutation = useSolveQuestion();

  const {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    selectedSubject,
    setSelectedSubject,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedPattern,
    setSelectedPattern,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    isFilterActive,
    clearFilters,
  } = usePracticeFilters(50);

  // Fetch Practice Problems from database
  const {
    data: practiceData,
    isLoading,
    isError,
    error,
    refetch,
  } = usePracticeProblems({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    subject: selectedSubject,
    topic: selectedPattern,
    difficulty: selectedDifficulty,
    status: selectedStatus,
  });

  // Fetch subjects & topic metadata for dynamic filters
  const { data: roadmapSubjects } = useRoadmapSubjects();
  const { data: subjectDetail } = useRoadmapSubjectDetail(
    selectedSubject !== "all" ? selectedSubject : ""
  );

  // Active Problem Note Modal State
  const [activeProblem, setActiveProblem] = useState<PracticeProblemDto | null>(null);

  const problems = practiceData?.problems || [];
  const pagination = practiceData?.pagination || {
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
    hasMore: false,
  };
  const stats = practiceData?.stats || {
    totalProblems: 847,
    totalSolved: 0,
    totalDue: 0,
  };

  // Generate dynamic pattern options from roadmap topics
  const availablePatterns = useMemo(() => {
    const patterns = new Set<string>();

    if (selectedSubject !== "all") {
      const staticTopics = CURRICULUM_TOPICS[selectedSubject];
      if (staticTopics) {
        staticTopics.forEach((t) => patterns.add(t));
      }
      if (subjectDetail?.topics) {
        subjectDetail.topics.forEach((t) => {
          patterns.add(t.name);
          if (t.subtopics) {
            t.subtopics.forEach((st) => patterns.add(st.name));
          }
        });
      }
    } else {
      Object.values(CURRICULUM_TOPICS).forEach((topicList) => {
        topicList.forEach((t) => patterns.add(t));
      });
    }

    problems.forEach((p) => {
      if (p.topic) patterns.add(p.topic);
      if (p.subtopic) patterns.add(p.subtopic);
    });

    return Array.from(patterns);
  }, [selectedSubject, subjectDetail, problems]);

  const handleOpenProblem = (problem: PracticeProblemDto) => {
    setActiveProblem(problem);
  };

  const handleSaveProblemNotes = async (markAsSolved: boolean, notes: string) => {
    if (!activeProblem) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to record question progress.");
      return;
    }

    try {
      await solveMutation.mutateAsync({
        itemId: activeProblem.itemId,
        isCorrect: markAsSolved,
        notes,
      });

      if (markAsSolved && !activeProblem.solved) {
        addPoints(15);
        toast.success(`🎉 Problem solved! Notes saved (+15 pts!)`);
      } else if (!markAsSolved && activeProblem.solved) {
        toast.info("Problem marked as unsolved.");
      } else {
        toast.success("Notes saved successfully!");
      }
      setActiveProblem(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save question notes");
    }
  };

  const handleRandomProblem = () => {
    if (problems.length === 0) {
      toast.error("No problems available to select.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * problems.length);
    const randomProb = problems[randomIndex];
    handleOpenProblem(randomProb);
    toast.success(`🎯 Selected: ${randomProb.title}`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Practice Problems</span>
            <Badge variant="blue" className="text-[10px] font-medium py-0 px-1.5 font-mono">
              {stats.totalProblems} Curated Qs
            </Badge>
          </h1>
          <p className="text-[12px] font-normal text-zinc-400 leading-normal">
            Master pattern-based algorithms, system design questions, and core subject problems from the real curriculum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRandomProblem}
            className="h-8 px-3 text-[12px] font-medium border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200"
          >
            <Shuffle className="h-3.5 w-3.5 mr-1 text-blue-400" />
            <span>Random Problem</span>
          </Button>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-1.5 text-[12px] flex items-center gap-1.5 shadow-subtle">
            <span className="text-zinc-400 font-normal">Solved:</span>
            <strong className="text-zinc-100 font-semibold font-mono text-[12px]">
              {stats.totalSolved} / {stats.totalProblems}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <PracticeFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedPattern={selectedPattern}
        setSelectedPattern={setSelectedPattern}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        availablePatterns={availablePatterns}
        isFilterActive={isFilterActive}
        onClearFilters={clearFilters}
        onFilterChange={() => setCurrentPage(1)}
      />

      {/* 3. Problem List Table */}
      <PracticeTable
        problems={problems}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        onOpenProblem={handleOpenProblem}
        onClearFilters={clearFilters}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* 4. Compact Problem Note Modal */}
      <ProblemNoteModal
        problem={activeProblem}
        isOpen={Boolean(activeProblem)}
        onClose={() => setActiveProblem(null)}
        onSaveNotes={handleSaveProblemNotes}
        isPending={solveMutation.isPending}
      />
    </div>
  );
}
