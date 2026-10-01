"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
  HelpCircle,
  Plus,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  PracticeProblemDto,
  RoadmapSubjectSummaryDto,
} from "@cracksde/shared";

interface QuizInventoryTableProps {
  stats: {
    totalProblems: number;
    totalSolved: number;
    totalDue: number;
  };
  subjects: RoadmapSubjectSummaryDto[] | undefined;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedSubject: string;
  setSelectedSubject: (val: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (val: string) => void;
  problems: PracticeProblemDto[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onOpenAddModal: () => void;
}

export function QuizInventoryTable({
  stats,
  subjects,
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  selectedDifficulty,
  setSelectedDifficulty,
  problems,
  isLoading,
  pagination,
  onPageChange,
  onOpenAddModal,
}: QuizInventoryTableProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-blue-400" /> Total Questions
          </span>
          <div className="text-[20px] font-bold text-zinc-100 font-mono">
            {stats.totalProblems}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Solved
            Questions
          </span>
          <div className="text-[20px] font-bold text-emerald-400 font-mono">
            {stats.totalSolved}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" /> Due for Revision
          </span>
          <div className="text-[20px] font-bold text-amber-400 font-mono">
            {stats.totalDue}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-purple-400" /> Active Tracks
          </span>
          <div className="text-[20px] font-bold text-purple-400 font-mono">
            {subjects?.length || 5}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search questions by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 text-[12px]">
          {/* Track Filters */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-zinc-500 text-[11px] font-medium mr-1">
              Track:
            </span>
            <button
              onClick={() => setSelectedSubject("all")}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                selectedSubject === "all"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200",
              )}
            >
              All
            </button>
            {subjects?.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.slug)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                  selectedSubject === s.slug
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200",
                )}
              >
                {s.slug === "dsa"
                  ? "DSA"
                  : s.slug === "dbms"
                    ? "DBMS"
                    : s.slug === "operating-systems"
                      ? "OS"
                      : s.slug === "computer-networks"
                        ? "CN"
                        : s.name}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[11px]">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List Table */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-[12px] text-zinc-400">Loading...</p>
          </div>
        ) : problems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HelpCircle className="h-8 w-8 text-zinc-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-[14px] font-semibold text-zinc-200">
                No questions found
              </h3>
              <p className="text-[12px] text-zinc-500 max-w-sm mx-auto">
                No questions match your filter criteria. Try changing your
                search or add a new question.
              </p>
            </div>
            <Button
              size="sm"
              onClick={onOpenAddModal}
              className="h-7 px-3 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <Plus className="h-3 w-3 mr-1" /> Add New Question
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {problems.map((problem) => {
              const isSolved = problem.solved;
              const diffColor =
                problem.difficulty === "Easy"
                  ? "success"
                  : problem.difficulty === "Medium"
                    ? "warning"
                    : "destructive";

              return (
                <div
                  key={problem.id}
                  className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/70 transition-colors group"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono text-zinc-500 font-medium">
                        #{problem.itemNo}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-medium py-0 px-1.5 border-zinc-800 text-zinc-400"
                      >
                        {problem.subject}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium py-0 px-1.5 bg-zinc-800/60 text-zinc-300"
                      >
                        {problem.topic}
                      </Badge>
                      {problem.subtopic && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          • {problem.subtopic}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[13px] font-medium text-zinc-100 group-hover:text-blue-400 transition-colors leading-snug">
                      {problem.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      <span>{problem.estimatedMinutes}m</span>
                    </div>

                    <Badge
                      variant={diffColor}
                      className="text-[10px] font-medium py-0 px-1.5"
                    >
                      {problem.difficulty}
                    </Badge>

                    {isSolved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        <Check className="h-3 w-3" /> Solved
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-md">
                        Unsolved
                      </span>
                    )}

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      <Link href="/practice" title="View in Practice Mode">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-[12px] text-zinc-400">
            <span>
              Page {pagination.page} of {pagination.totalPages} (
              {pagination.total} total)
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page <= 1}
                className="h-7 px-2 text-[11px]"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange(
                    Math.min(pagination.totalPages, pagination.page + 1),
                  )
                }
                disabled={pagination.page >= pagination.totalPages}
                className="h-7 px-2 text-[11px]"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
