"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Search,
  Filter,
  Check,
  ChevronRight,
  RotateCcw,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TopicOverallBadge } from "./topic-drawer-modal";
import type {
  RoadmapTopicDto,
  RoadmapItemDto,
  RoadmapSubjectSummaryDto,
  TopicQuestionsResponseDto,
  PrepDifficultyFilter,
  PrepRevisionFilter,
  UserItemProgressDto,
} from "../types";

interface TopicQuestionsListProps {
  currentSubject: RoadmapSubjectSummaryDto | null;
  currentTopic: RoadmapTopicDto | null;
  topicQuestionsData: TopicQuestionsResponseDto | undefined;
  isLoading: boolean;
  onBack: () => void;
  onOpenProblem?: (item: RoadmapItemDto) => void;
  onOpenReviewModal?: (item: RoadmapItemDto) => void;
}

const STATUS_FILTERS = [
  { label: "All", val: "all" },
  { label: "Due", val: "due" },
  { label: "Solved", val: "solved" },
  { label: "Unsolved", val: "unsolved" },
] as const;

export function getDifficultyBadge(diff?: string) {
  const d = (diff || "Medium").toLowerCase();
  if (d.includes("basic") || d.includes("easy")) {
    return (
      <Badge variant="success" className="font-medium text-[11px] py-0.5 px-2">
        Easy
      </Badge>
    );
  }
  if (d.includes("pro") || d.includes("hard")) {
    return (
      <Badge variant="destructive" className="font-medium text-[11px] py-0.5 px-2">
        Hard
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="font-medium text-[11px] py-0.5 px-2">
      Medium
    </Badge>
  );
}

export function getRevisionBadge(progress?: UserItemProgressDto | null) {
  if (!progress || (progress.solveCount === 0 && !progress.lastSolvedAt)) {
    return <span className="text-zinc-600 font-mono text-[11px]">—</span>;
  }

  if (progress.isDue || progress.revisionStatusText?.toLowerCase().includes("due")) {
    return (
      <span className="inline-flex items-center rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 font-mono">
        Today
      </span>
    );
  }

  if (progress.revisionStatusText === "Due Tomorrow") {
    return (
      <span className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 font-mono">
        Tomorrow
      </span>
    );
  }

  if (!progress.nextRevisionAt) {
    return (
      <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 font-mono">
        Done
      </span>
    );
  }

  const revDate = new Date(progress.nextRevisionAt);
  if (isNaN(revDate.getTime())) {
    return <span className="text-zinc-600 font-mono text-[11px]">—</span>;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    revDate.getFullYear(),
    revDate.getMonth(),
    revDate.getDate()
  );
  const diffDays = Math.round(
    (targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) {
    return (
      <span className="inline-flex items-center rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 font-mono">
        Today
      </span>
    );
  }

  if (diffDays === 1) {
    return (
      <span className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 font-mono">
        Tomorrow
      </span>
    );
  }

  const formattedDate = revDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  return (
    <span className="inline-flex items-center rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 font-mono">
      {formattedDate}
    </span>
  );
}

// Backward-compatibility export
export function RevisionStatusBadge({
  revisionText,
  isDue,
  solveCount,
  nextRevisionAt,
}: {
  revisionText?: string;
  isDue?: boolean;
  solveCount?: number;
  nextRevisionAt?: string | null;
}) {
  return getRevisionBadge({
    isDue: Boolean(isDue),
    solveCount: solveCount || 0,
    nextRevisionAt: nextRevisionAt || null,
    revisionStatusText: revisionText || "",
    itemId: 0,
    solvedAt: null,
    lastSolvedAt: null,
    notes: null,
  });
}

export function TopicQuestionsList({
  currentSubject,
  currentTopic,
  topicQuestionsData,
  isLoading,
  onBack,
  onOpenProblem,
  onOpenReviewModal,
}: TopicQuestionsListProps) {
  const handleOpen = onOpenProblem || onOpenReviewModal || (() => {});

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<PrepDifficultyFilter>("all");
  const [filterRevision, setFilterRevision] = useState<PrepRevisionFilter>("all");

  const activeTopic = topicQuestionsData?.topic || currentTopic;

  const isFilterActive =
    Boolean(searchQuery.trim()) ||
    filterDifficulty !== "all" ||
    filterRevision !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterDifficulty("all");
    setFilterRevision("all");
  };

  const filteredQuestions = useMemo(() => {
    if (!topicQuestionsData?.questions) return [];
    return topicQuestionsData.questions.filter((q) => {
      const matchSearch =
        !searchQuery.trim() ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchDifficulty =
        filterDifficulty === "all" ||
        (q.difficulty && q.difficulty.toLowerCase() === filterDifficulty.toLowerCase());

      const matchRevision =
        filterRevision === "all" ||
        (filterRevision === "due" && q.progress?.isDue) ||
        (filterRevision === "solved" && (q.progress?.solveCount ?? 0) > 0) ||
        (filterRevision === "unsolved" && (!q.progress || (q.progress.solveCount ?? 0) === 0));

      return matchSearch && matchDifficulty && matchRevision;
    });
  }, [topicQuestionsData?.questions, searchQuery, filterDifficulty, filterRevision]);

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-0.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onBack}
              className="h-6 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 -ml-1.5 border border-zinc-800/60 rounded-md transition-colors"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              <span>{currentSubject?.name || "Topics"}</span>
            </Button>
            <span className="text-zinc-600">&middot;</span>
            <h1 className="text-[20px] font-bold leading-tight tracking-tight text-zinc-100">
              {activeTopic?.name || "Questions"}
            </h1>
            <TopicOverallBadge
              hasRevisionDue={activeTopic?.hasRevisionDue}
              statusText={activeTopic?.revisionStatusText}
              dueCount={activeTopic?.dueQuestions}
            />
          </div>
          <p className="text-[12px] font-normal text-zinc-400 leading-normal">
            Master core concepts with spaced repetition intervals (1d &rarr; 3d &rarr; 7d &rarr; 14d &rarr; 30d).
          </p>
        </div>

        {/* Topic Progress Statistics */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-8 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 text-[12px] flex items-center gap-1.5 shadow-subtle font-mono">
            <span className="text-zinc-400 font-normal">Solved:</span>
            <strong className="text-emerald-400 font-semibold text-[12px]">
              {activeTopic?.solvedQuestions || 0}
            </strong>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400 font-normal">
              {activeTopic?.totalQuestions || 0}
            </span>
          </div>

          {(activeTopic?.dueQuestions ?? 0) > 0 && (
            <div className="h-8 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 text-[12px] flex items-center gap-1.5 text-amber-300 shadow-subtle font-mono">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-[12px] text-amber-300">
                {activeTopic?.dueQuestions}
              </span>
              <span className="text-amber-400/90 text-[11px] font-sans">Due</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-2.5 shadow-subtle">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search question title or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 rounded-lg border border-zinc-800 bg-zinc-950/80 pl-8 pr-7 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 text-[12px]">
          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-zinc-500 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.val}
                type="button"
                onClick={() => setFilterRevision(f.val)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                  filterRevision === f.val
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Selectors: Level & Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty Selector */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[11px]">Level:</span>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as PrepDifficultyFilter)}
                className="h-6.5 rounded-md border border-zinc-800 bg-zinc-950/90 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500/80 transition-colors cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="basic">Easy</option>
                <option value="core">Medium</option>
                <option value="pro">Hard</option>
              </select>
            </div>

            {/* Reset Button */}
            {isFilterActive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6.5 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-zinc-800/60 rounded-md transition-colors flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3 text-zinc-400" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Questions Table (Subtopic column removed) */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 border-b border-zinc-800/80 bg-zinc-950/70 px-4 py-2.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider items-center select-none">
          <div className="col-span-7 sm:col-span-7">Question</div>
          <div className="col-span-2 text-center">Difficulty</div>
          <div className="col-span-2 hidden sm:block text-center">Revision</div>
          <div className="col-span-3 sm:col-span-1 text-right pr-2">Action</div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="divide-y divide-zinc-800/40 p-2 space-y-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center py-2.5 px-3">
                <div className="col-span-7 sm:col-span-7 flex items-center gap-2.5">
                  <Skeleton className="h-4 w-4 rounded-full bg-zinc-800 shrink-0" />
                  <Skeleton className="h-4 w-48 bg-zinc-800 rounded" />
                </div>
                <div className="col-span-2 flex justify-center">
                  <Skeleton className="h-5 w-14 bg-zinc-800 rounded" />
                </div>
                <div className="col-span-2 hidden sm:flex justify-center">
                  <Skeleton className="h-4 w-16 bg-zinc-800 rounded" />
                </div>
                <div className="col-span-3 sm:col-span-1 flex justify-end">
                  <Skeleton className="h-6 w-14 bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredQuestions.length > 0 ? (
          /* Question Rows */
          <div className="divide-y divide-zinc-800/40">
            {filteredQuestions.map((q) => {
              const isSolved = (q.progress?.solveCount ?? 0) > 0;

              return (
                <div
                  key={q.id}
                  onClick={() => handleOpen(q)}
                  className="grid grid-cols-12 gap-3 items-center px-4 py-2.5 text-[13px] transition-colors hover:bg-zinc-900/70 cursor-pointer group select-none border-b border-zinc-800/40 last:border-b-0"
                >
                  {/* 1. Question Column with Check Indicator */}
                  <div className="col-span-7 sm:col-span-7 flex items-center gap-2.5 overflow-hidden pr-2">
                    {isSolved ? (
                      <div className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-emerald-400 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-zinc-800 bg-zinc-950/60 shrink-0" />
                    )}
                    <span className="font-medium text-zinc-200 text-[13px] leading-snug group-hover:text-blue-400 transition-colors truncate">
                      {q.title}
                    </span>
                  </div>

                  {/* 2. Difficulty Column */}
                  <div className="col-span-2 flex justify-center items-center">
                    {getDifficultyBadge(q.difficulty)}
                  </div>

                  {/* 3. Revision Column */}
                  <div className="col-span-2 hidden sm:flex justify-center items-center">
                    {getRevisionBadge(q.progress)}
                  </div>

                  {/* 4. Action Column */}
                  <div className="col-span-3 sm:col-span-1 flex items-center justify-end pr-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(q);
                      }}
                      className="h-6 px-2.5 text-[11px] font-medium border-zinc-800 bg-zinc-900/80 text-zinc-300 group-hover:border-blue-500/40 group-hover:text-blue-400 rounded-md transition-colors"
                    >
                      <span>Solve</span>
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-12 text-center space-y-2">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
              <FileText className="h-4 w-4" />
            </div>
            <p className="text-[12px] font-medium text-zinc-300">
              No matching questions found
            </p>
            <p className="text-[11px] text-zinc-500">
              Try clearing active filters or searching a different term.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearFilters}
              className="text-[11px] h-7 border-zinc-800 bg-zinc-900 text-zinc-300 mt-1"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Table Footer */}
        {!isLoading && filteredQuestions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800/80 bg-zinc-950/60 px-4 py-3 text-[12px] text-zinc-400 font-mono">
            <div>
              Showing {filteredQuestions.length} of {topicQuestionsData?.questions?.length || 0} questions
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-zinc-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {topicQuestionsData?.questions?.filter((q) => (q.progress?.solveCount ?? 0) > 0).length || 0} Solved
                </span>
              </span>
              {(activeTopic?.dueQuestions ?? 0) > 0 && (
                <span className="flex items-center gap-1.5 text-amber-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>{activeTopic?.dueQuestions} Due for Revision</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
