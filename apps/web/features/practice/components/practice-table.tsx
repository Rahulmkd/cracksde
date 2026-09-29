"use client";

import React from "react";
import { AlertTriangle, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PracticeTableRow } from "./practice-table-row";
import { PracticePagination } from "./practice-pagination";
import type { PracticeProblemDto, PracticePaginationInfo } from "../types";

interface PracticeTableProps {
  problems: PracticeProblemDto[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onOpenProblem: (problem: PracticeProblemDto) => void;
  onClearFilters: () => void;
  pagination: PracticePaginationInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PracticeTable({
  problems,
  isLoading,
  isError,
  error,
  onRetry,
  onOpenProblem,
  onClearFilters,
  pagination,
  currentPage,
  onPageChange,
}: PracticeTableProps) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-2.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider items-center">
        <div className="col-span-7 sm:col-span-5">Problem</div>
        <div className="col-span-3 hidden sm:block">Subject</div>
        <div className="col-span-2 text-center">Difficulty</div>
        <div className="col-span-1 hidden sm:block text-center">Revision</div>
        <div className="col-span-3 sm:col-span-1 text-right pr-2">Action</div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="divide-y divide-zinc-800/40 p-2 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 px-3">
              <Skeleton className="h-4 w-64 bg-zinc-800 rounded" />
              <Skeleton className="h-4 w-32 bg-zinc-800 rounded hidden sm:block" />
              <Skeleton className="h-4 w-16 bg-zinc-800 rounded" />
              <Skeleton className="h-4 w-16 bg-zinc-800 rounded hidden sm:block" />
              <Skeleton className="h-6 w-14 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        /* Error State */
        <div className="py-12 text-center space-y-2">
          <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
          <p className="text-[13px] font-medium text-zinc-200">
            Failed to load problems
          </p>
          <p className="text-[11px] text-zinc-500">
            {error instanceof Error ? error.message : "Error connecting to the database."}
          </p>
          <Button
            size="sm"
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] h-7 mt-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        </div>
      ) : problems.length > 0 ? (
        /* Problem Rows */
        <div className="divide-y divide-zinc-800/40">
          {problems.map((problem) => (
            <PracticeTableRow
              key={problem.id}
              problem={problem}
              onOpenProblem={onOpenProblem}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 text-center space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
            <FileText className="h-4 w-4" />
          </div>
          <p className="text-[12px] font-medium text-zinc-300">
            No matching problems found
          </p>
          <p className="text-[11px] text-zinc-500">
            Try clearing active filters or searching a different term.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onClearFilters}
            className="text-[11px] h-7 border-zinc-800 bg-zinc-900 text-zinc-300 mt-1"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && pagination.total > 0 && (
        <PracticePagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
