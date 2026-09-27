import React from "react";
import { Search, Plus, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RoadmapSubjectSummaryDto } from "@cracksde/shared";

interface QuizFilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  subjects: RoadmapSubjectSummaryDto[];
  onOpenAddModal: () => void;
  onResetFilters: () => void;
}

export function QuizFilterBar({
  search,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedDifficulty,
  onDifficultyChange,
  subjects,
  onOpenAddModal,
  onResetFilters,
}: QuizFilterBarProps) {
  const hasFilters = search.trim() !== "" || selectedSubject !== "all" || selectedDifficulty !== "all";

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-4 md:p-5 mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search curriculum questions..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-xs bg-background/50 border-border/70 rounded-xl"
            />
          </div>

          <div>
            <select
              value={selectedSubject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Tracks</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
          <Button
            size="sm"
            onClick={onOpenAddModal}
            className="h-9 text-xs gap-1.5 font-semibold w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
}
