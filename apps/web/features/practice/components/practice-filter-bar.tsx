"use client";

import React from "react";
import { Search, Filter, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PracticeFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedSubject: string;
  setSelectedSubject: (val: string) => void;
  selectedPattern: string;
  setSelectedPattern: (val: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  availablePatterns: string[];
  isFilterActive: boolean;
  onClearFilters: () => void;
  onFilterChange?: () => void;
}

const SUBJECT_TRACKS = [
  { label: "All", val: "all" },
  { label: "DSA", val: "dsa" },
  { label: "DBMS", val: "dbms" },
  { label: "OS", val: "operating-systems" },
  { label: "CN", val: "computer-networks" },
  { label: "OOPs", val: "oops" },
  { label: "LLD", val: "lld" },
];

export function PracticeFilterBar({
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  selectedPattern,
  setSelectedPattern,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedStatus,
  setSelectedStatus,
  availablePatterns,
  isFilterActive,
  onClearFilters,
  onFilterChange,
}: PracticeFilterBarProps) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-3 shadow-subtle">
      {/* Search Bar - Compact */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by problem title, topic (Arrays, Two Pointers, Indexing, Sockets)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-8 rounded-lg border border-zinc-800 bg-zinc-950/80 pl-8 pr-7 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 text-[12px]">
        {/* Subject Track Filter */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-zinc-500 text-[11px] font-medium mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Track:
          </span>
          {SUBJECT_TRACKS.map((f) => (
            <button
              key={f.val}
              type="button"
              onClick={() => {
                setSelectedSubject(f.val);
                setSelectedPattern("all");
                onFilterChange?.();
              }}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                selectedSubject === f.val
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                  : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Selectors: Pattern, Level, Status & Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pattern Selector */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 text-[11px]">Pattern:</span>
            <select
              value={selectedPattern}
              onChange={(e) => {
                setSelectedPattern(e.target.value);
                onFilterChange?.();
              }}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Patterns</option>
              {availablePatterns.map((p) => (
                <option key={p} value={p.toLowerCase()}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 text-[11px]">Level:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                onFilterChange?.();
              }}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="basic">Easy</option>
              <option value="core">Medium</option>
              <option value="pro">Hard</option>
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 text-[11px]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                onFilterChange?.();
              }}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="unsolved">Not Solved</option>
              <option value="solved">Solved</option>
              <option value="due">Revision Due</option>
              <option value="upcoming">Upcoming Revision</option>
              <option value="bookmarked">Bookmarked</option>
            </select>
          </div>

          {/* Reset Button */}
          {isFilterActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors flex items-center gap-1 ml-0.5"
            >
              <RotateCcw className="h-3 w-3 text-zinc-400" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
