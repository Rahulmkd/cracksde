import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RoadmapSubjectSummaryDto } from "@cracksde/shared";

interface ProblemFilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  subjects: RoadmapSubjectSummaryDto[];
  onResetFilters: () => void;
}

export function ProblemFilterBar({
  search,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedStatus,
  onStatusChange,
  subjects,
  onResetFilters,
}: ProblemFilterBarProps) {
  const difficulties = ["all", "Easy", "Medium", "Hard"];
  const statuses = [
    { value: "all", label: "All Status" },
    { value: "unsolved", label: "Unsolved" },
    { value: "solved", label: "Solved" },
    { value: "due", label: "Revision Due" },
    { value: "upcoming", label: "Upcoming Revision" },
  ];

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedSubject !== "all" ||
    selectedDifficulty !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-4 md:p-5 mb-6 space-y-4">
      {/* Search and Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search problems, topics..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs bg-background/50 border-border/70 rounded-xl"
          />
        </div>

        {/* Subject Filter */}
        <div>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Tracks / Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Difficulty Pills & Reset */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/40 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground font-medium mr-1">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => onDifficultyChange(diff)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                selectedDifficulty === diff
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-background/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40"
              )}
            >
              {diff === "all" ? "All Levels" : diff}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}
