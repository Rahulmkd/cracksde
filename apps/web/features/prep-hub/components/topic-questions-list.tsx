"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Calendar,
  Search,
  Filter,
  Check,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TopicOverallBadge } from "./topic-drawer-modal";
import type {
  RoadmapTopicDto,
  RoadmapItemDto,
  RoadmapSubjectSummaryDto,
  TopicQuestionsResponseDto,
  PrepDifficultyFilter,
  PrepRevisionFilter,
} from "../types";

interface TopicQuestionsListProps {
  currentSubject: RoadmapSubjectSummaryDto | null;
  currentTopic: RoadmapTopicDto | null;
  topicQuestionsData: TopicQuestionsResponseDto | undefined;
  isLoading: boolean;
  onBack: () => void;
  onOpenReviewModal: (item: RoadmapItemDto) => void;
  onQuickSolve: (item: RoadmapItemDto, e: React.MouseEvent) => void;
  isSolvePending?: boolean;
}

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
  if (isDue) {
    return (
      <Badge
        variant="destructive"
        className="font-medium text-[11px] py-0 px-2 flex items-center gap-1 animate-pulse"
      >
        <AlertTriangle className="h-3 w-3" />
        <span>Revision Due</span>
      </Badge>
    );
  }

  if (!solveCount || solveCount === 0 || revisionText === "Not Solved Yet") {
    return (
      <Badge
        variant="outline"
        className="font-normal text-[11px] py-0 px-2 text-zinc-500 border-zinc-800 bg-zinc-950/40"
      >
        Not Solved Yet
      </Badge>
    );
  }

  if (revisionText === "Due Tomorrow") {
    return (
      <Badge
        variant="warning"
        className="font-medium text-[11px] py-0 px-2 flex items-center gap-1"
      >
        <Clock className="h-3 w-3 text-amber-400" />
        <span>Due Tomorrow</span>
      </Badge>
    );
  }

  let upcomingDateStr = "";
  if (nextRevisionAt) {
    const d = new Date(nextRevisionAt);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    upcomingDateStr = `Next: ${day} ${month}`;
  } else if (revisionText?.startsWith("Next Revision: ")) {
    upcomingDateStr = revisionText.replace("Next Revision: ", "Next: ");
  } else {
    upcomingDateStr = revisionText || "Upcoming";
  }

  return (
    <Badge
      variant="outline"
      className="font-medium text-[11px] py-0 px-2 text-blue-400 border-blue-500/20 bg-blue-500/10 flex items-center gap-1"
    >
      <Calendar className="h-3 w-3" />
      <span>{upcomingDateStr}</span>
    </Badge>
  );
}

export function TopicQuestionsList({
  currentSubject,
  currentTopic,
  topicQuestionsData,
  isLoading,
  onBack,
  onOpenReviewModal,
  onQuickSolve,
  isSolvePending = false,
}: TopicQuestionsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<PrepDifficultyFilter>("all");
  const [filterRevision, setFilterRevision] = useState<PrepRevisionFilter>("all");

  const filteredQuestions = useMemo(() => {
    if (!topicQuestionsData?.questions) return [];
    return topicQuestionsData.questions.filter((q) => {
      const matchSearch =
        !searchQuery ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.subtopicName && q.subtopicName.toLowerCase().includes(searchQuery.toLowerCase()));

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

  const activeTopic = topicQuestionsData?.topic || currentTopic;

  return (
    <div className="space-y-6">
      {/* Topic Header & Revision Status Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onBack}
                className="h-7 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 -ml-2"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                <span>Back to {currentSubject?.name || "Topics"}</span>
              </Button>
              <span className="text-zinc-700">&middot;</span>
              <span className="text-[12px] font-mono text-zinc-400">
                {activeTopic?.estimatedMinutes || 0} mins
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-semibold text-zinc-100">
                {activeTopic?.name || "Questions"}
              </h1>
              <TopicOverallBadge
                hasRevisionDue={activeTopic?.hasRevisionDue}
                statusText={activeTopic?.revisionStatusText}
                dueCount={activeTopic?.dueQuestions}
              />
            </div>
            <p className="text-[12px] text-zinc-400 leading-normal">
              Solve and review questions to advance your spaced repetition intervals (1d → 3d → 7d → 14d → 30d).
            </p>
          </div>

          {/* Topic Progress Statistics */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[12px] flex items-center gap-2 shadow-subtle">
              <span className="text-zinc-400">Solved:</span>
              <span className="font-mono font-semibold text-zinc-100">
                {activeTopic?.solvedQuestions || 0} / {activeTopic?.totalQuestions || 0}
              </span>
            </div>

            {(activeTopic?.dueQuestions ?? 0) > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[12px] flex items-center gap-1.5 text-amber-300 shadow-subtle">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-semibold font-mono">
                  {activeTopic?.dueQuestions}
                </span>
                <span className="text-amber-400/90 text-[11px]">Due for Review</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-3 shadow-subtle">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search question title or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
          {/* Revision Filter */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-zinc-500 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            {(
              [
                { label: "All", val: "all" },
                { label: "Due for Revision", val: "due" },
                { label: "Solved", val: "solved" },
                { label: "Unsolved", val: "unsolved" },
              ] as const
            ).map((f) => (
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

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[11px]">Level:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as PrepDifficultyFilter)}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Difficulties</option>
              <option value="basic">Basic / Easy</option>
              <option value="core">Core / Medium</option>
              <option value="pro">Pro / Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Table / List */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-6 sm:col-span-5">Question / Concept</div>
          <div className="col-span-3 sm:col-span-4">Revision Status</div>
          <div className="col-span-2 text-right pr-2">Action</div>
        </div>

        {/* Table Rows */}
        {isLoading ? (
          <div className="divide-y divide-zinc-800/40">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-14 bg-zinc-900/20 animate-pulse" />
            ))}
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="divide-y divide-zinc-800/40">
            {filteredQuestions.map((q) => {
              const isSolved = (q.progress?.solveCount ?? 0) > 0;
              const isDue = q.progress?.isDue ?? false;

              return (
                <div
                  key={q.id}
                  className={cn(
                    "grid grid-cols-12 gap-3 items-center px-4 py-3 text-[13px] transition-colors hover:bg-zinc-900/70 group",
                    isDue && "bg-amber-500/[0.03]",
                    isSolved && !isDue && "bg-zinc-950/20"
                  )}
                >
                  {/* 1. Status Checkbox / Quick Toggle */}
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => onQuickSolve(q, e)}
                      disabled={isSolvePending}
                      title={
                        isSolved
                          ? `Solved ${q.progress?.solveCount}x (Click to review)`
                          : "Mark as solved"
                      }
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                        isSolved
                          ? isDue
                            ? "border-amber-500 bg-amber-500 text-black font-bold"
                            : "border-emerald-500 bg-emerald-500 text-white"
                          : "border-zinc-700 bg-zinc-900 hover:border-blue-500"
                      )}
                    >
                      {isSolved && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                  </div>

                  {/* 2. Title & Subtopic */}
                  <div className="col-span-6 sm:col-span-5 flex flex-col justify-center overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-medium text-zinc-100 text-[13px] truncate group-hover:text-blue-400 transition-colors",
                          isSolved && !isDue && "text-zinc-300"
                        )}
                      >
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono py-0 px-1 border-zinc-800 text-zinc-400 hidden sm:inline"
                        >
                          {q.difficulty}
                        </Badge>
                      )}
                    </div>

                    <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      {q.subtopicName && (
                        <span className="text-zinc-400 truncate">{q.subtopicName}</span>
                      )}
                      {q.type && (
                        <>
                          <span>&middot;</span>
                          <span>{q.type}</span>
                        </>
                      )}
                      {q.progress && q.progress.solveCount > 0 && (
                        <>
                          <span>&middot;</span>
                          <span className="text-zinc-400 font-mono">
                            {q.progress.solveCount}x reviewed
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 3. Revision Status Column */}
                  <div className="col-span-3 sm:col-span-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <RevisionStatusBadge
                        revisionText={q.progress?.revisionStatusText}
                        isDue={q.progress?.isDue}
                        solveCount={q.progress?.solveCount}
                        nextRevisionAt={q.progress?.nextRevisionAt}
                      />
                    </div>
                    {q.progress?.lastSolvedAt && (
                      <span className="text-[10px] text-zinc-500 mt-0.5">
                        Last:{" "}
                        {new Date(q.progress.lastSolvedAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>

                  {/* 4. Action Button */}
                  <div className="col-span-2 flex items-center justify-end pr-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenReviewModal(q)}
                      className={cn(
                        "h-6 px-2.5 text-[11px] font-medium border-zinc-800 bg-zinc-900 group-hover:border-blue-500/40 group-hover:text-blue-400",
                        isDue && "border-amber-500/40 text-amber-300 bg-amber-500/10"
                      )}
                    >
                      <span>{isSolved ? "Review" : "Solve"}</span>
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center space-y-1.5">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
              <HelpCircle className="h-4 w-4" />
            </div>
            <p className="text-[12px] font-medium text-zinc-300">No questions found</p>
            <p className="text-[11px] text-zinc-500">
              Try clearing active search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
