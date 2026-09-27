import React from "react";
import { Code2, CheckCircle2, AlertTriangle } from "lucide-react";

interface ProblemStatsCardsProps {
  totalProblems: number;
  totalSolved: number;
  totalDue: number;
}

export function ProblemStatsCards({
  totalProblems,
  totalSolved,
  totalDue,
}: ProblemStatsCardsProps) {
  const percent = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="p-4 rounded-2xl bg-card/60 border border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Practice Bank</span>
          <Code2 className="w-4 h-4 text-primary" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{totalProblems}</span>
          <span className="text-xs text-muted-foreground">Curated Problems</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-card/60 border border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Solved & Mastered</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{totalSolved}</span>
          <span className="text-xs text-emerald-400 font-medium">({percent}%)</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-card/60 border border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Spaced Revisions Due</span>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{totalDue}</span>
          <span className="text-xs text-muted-foreground">Ready for Review</span>
        </div>
      </div>
    </div>
  );
}
