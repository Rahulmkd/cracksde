import React from "react";
import { CheckCircle2, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RevisionBadge } from "@/components/shared/revision-badge";
import { cn } from "@/lib/utils";
import type { RoadmapItemDto } from "@cracksde/shared";

interface QuestionRowProps {
  item: RoadmapItemDto;
  onOpenSolveDialog: (item: RoadmapItemDto) => void;
}

export function QuestionRow({ item, onOpenSolveDialog }: QuestionRowProps) {
  const isSolved = (item.progress?.solveCount || 0) > 0 || item.progress?.status === "completed";
  const diff = item.difficulty || "Medium";
  const minutes = item.estimatedMinutes || 15;
  const revisionStatusText = item.progress?.revisionStatusText || "Not Solved Yet";
  const isDue = Boolean(item.progress?.isDue);

  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all text-xs",
        isSolved
          ? "bg-card/40 border-border/40 hover:bg-card/70"
          : "bg-background/50 hover:bg-card border-border/50 hover:border-primary/30 shadow-xs"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
            isSolved
              ? "bg-emerald-500/15 text-emerald-400"
              : "border border-border/70 text-muted-foreground/40"
          )}
        >
          {isSolved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px]">#{item.itemNo}</span>}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "font-medium truncate",
                isSolved ? "text-foreground" : "text-foreground"
              )}
            >
              {item.title}
            </span>
            {item.subtopicName && (
              <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted/40 shrink-0">
                {item.subtopicName}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <RevisionBadge statusText={revisionStatusText} isDue={isDue} size="sm" />

        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-1.5 py-0.5 font-normal",
            diff.toLowerCase() === "easy"
              ? "text-emerald-400 border-emerald-500/20"
              : diff.toLowerCase() === "hard"
              ? "text-rose-400 border-rose-500/20"
              : "text-amber-400 border-amber-500/20"
          )}
        >
          {diff}
        </Badge>

        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground/70" />
          {minutes}m
        </span>

        <Button
          size="sm"
          variant={isSolved ? "outline" : "default"}
          onClick={() => onOpenSolveDialog(item)}
          className={cn(
            "h-7 text-[11px] px-2.5 gap-1 font-medium",
            isSolved
              ? "border-border/70 text-muted-foreground hover:text-foreground"
              : "bg-primary text-primary-foreground shadow-xs"
          )}
        >
          {isSolved ? "Review" : "Solve"}
        </Button>
      </div>
    </div>
  );
}
