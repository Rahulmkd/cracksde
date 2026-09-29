"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PracticePaginationInfo } from "../types";

interface PracticePaginationProps {
  pagination: PracticePaginationInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PracticePagination({
  pagination,
  currentPage,
  onPageChange,
}: PracticePaginationProps) {
  if (pagination.total <= 0) return null;

  const startCount = Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total);
  const endCount = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800/80 bg-zinc-950/60 px-4 py-3 text-[12px] text-zinc-400 font-mono">
      <div>
        Showing {startCount} – {endCount} of {pagination.total} problems
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="h-7 px-2.5 text-[11px] font-mono border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
        </Button>

        <span className="text-[11px] text-zinc-300 px-1 font-mono">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage >= pagination.totalPages}
          onClick={() => onPageChange(Math.min(pagination.totalPages, currentPage + 1))}
          className="h-7 px-2.5 text-[11px] font-mono border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40"
        >
          Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
