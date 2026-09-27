import React from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QuestionRow } from "./question-row";
import { cn } from "@/lib/utils";
import type { RoadmapTopicDto, RoadmapItemDto } from "@cracksde/shared";

interface TopicAccordionProps {
  topic: RoadmapTopicDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOpenSolveDialog: (item: RoadmapItemDto) => void;
}

export function TopicAccordion({
  topic,
  isExpanded,
  onToggleExpand,
  onOpenSolveDialog,
}: TopicAccordionProps) {
  const directItems = topic.items || [];
  const subtopicItems = (topic.subtopics || []).flatMap((s) => s.items || []);
  const allQuestions = [...directItems, ...subtopicItems];

  const totalQuestions = topic.totalQuestions || allQuestions.length;
  const solvedQuestions = topic.solvedQuestions || 0;
  const dueQuestions = topic.dueQuestions || 0;
  const percent = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all mb-3 overflow-hidden shadow-xs",
        isExpanded ? "bg-card/90 border-primary/40" : "bg-card/40 border-border/50 hover:border-border/80"
      )}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/15 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">
            {isExpanded ? <ChevronDown className="w-4 h-4 text-foreground" /> : <ChevronRight className="w-4 h-4" />}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{topic.name}</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>{topic.estimatedMinutes} mins</span>
              <span>•</span>
              <span>{totalQuestions} Problems</span>
              {dueQuestions > 0 && (
                <span className="text-rose-400 font-medium">({dueQuestions} due for review)</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "text-xs px-2.5 py-0.5 font-normal",
              percent === 100
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : percent > 0
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-muted-foreground border-border/40"
            )}
          >
            {solvedQuestions}/{totalQuestions} Solved ({percent}%)
          </Badge>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border/30 space-y-2 bg-background/25">
          {allQuestions.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2 text-center italic">
              No problems found in this topic.
            </p>
          ) : (
            allQuestions.map((item) => (
              <QuestionRow
                key={item.id}
                item={item}
                onOpenSolveDialog={onOpenSolveDialog}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
