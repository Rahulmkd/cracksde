import React from "react";
import { ChevronLeft, ChevronRight, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PracticeProblemDto, RoadmapItemDto } from "@cracksde/shared";

interface QuizDirectoryTableProps {
  problems: PracticeProblemDto[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenSolveDialog: (problem: RoadmapItemDto) => void;
}

export function QuizDirectoryTable({
  problems,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onOpenSolveDialog,
}: QuizDirectoryTableProps) {
  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted-foreground">Loading curriculum directory...</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="py-16 text-center bg-card/30 border border-border/50 rounded-2xl p-6">
        <p className="text-sm font-semibold text-foreground">No questions in directory</p>
        <p className="text-xs text-muted-foreground mt-1">
          Use the "Add Question" button above to insert new interview problems.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">Question Title</th>
              <th className="py-3.5 px-4">Track</th>
              <th className="py-3.5 px-4">Topic / Pattern</th>
              <th className="py-3.5 px-4">Difficulty</th>
              <th className="py-3.5 px-4">Est. Time</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {problems.map((prob) => {
              const diff = prob.difficulty || "Medium";

              return (
                <tr key={prob.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">
                    {prob.itemNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {prob.title}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-muted-foreground font-medium">{prob.subject}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-muted-foreground">
                      {prob.topic} {prob.subtopic ? `› ${prob.subtopic}` : ""}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-2 py-0.5 font-normal",
                        diff.toLowerCase() === "easy"
                          ? "text-emerald-400 border-emerald-500/20"
                          : diff.toLowerCase() === "hard"
                          ? "text-rose-400 border-rose-500/20"
                          : "text-amber-400 border-amber-500/20"
                      )}
                    >
                      {diff}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {prob.estimatedMinutes || 15}m
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onOpenSolveDialog({
                          id: prob.itemId,
                          title: prob.title,
                          slug: prob.slug,
                          subjectName: prob.subject,
                          topicName: prob.topic,
                          subtopicName: prob.subtopic,
                          difficulty: prob.difficulty,
                          type: prob.type,
                          progress: prob.progress,
                        })
                      }
                      className="h-7 text-[11px] px-3 font-medium border-border/70 text-muted-foreground hover:text-foreground"
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-7 text-xs px-2 gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-7 text-xs px-2 gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
