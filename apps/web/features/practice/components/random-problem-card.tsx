"use client";

import React, { useState, useEffect } from "react";
import { Check, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getSubjectBadge, getDifficultyBadge } from "./practice-table-row";
import type { PracticeProblemDto } from "../types";

interface ProblemNoteModalProps {
  problem: PracticeProblemDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes: (markAsSolved: boolean, notes: string) => Promise<void>;
  isPending?: boolean;
}

export function ProblemNoteModal({
  problem,
  isOpen,
  onClose,
  onSaveNotes,
  isPending = false,
}: ProblemNoteModalProps) {
  const [userNotes, setUserNotes] = useState("");

  useEffect(() => {
    if (problem) {
      setUserNotes(problem.progress?.notes || "");
    }
  }, [problem]);

  if (!problem) return null;

  const formatLastSolved = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-zinc-800 bg-zinc-950 text-zinc-100 p-5 shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            {getSubjectBadge(problem.subjectSlug, problem.subject)}
            {getDifficultyBadge(problem.difficulty)}
          </div>
          <DialogTitle className="text-[15px] font-semibold text-zinc-100 leading-snug">
            {problem.title}
          </DialogTitle>
          <DialogDescription className="text-[12px] text-zinc-400">
            Topic:{" "}
            <strong className="text-zinc-300 font-medium">
              {problem.topic || "Core"}
            </strong>
            {problem.subtopic ? ` · ${problem.subtopic}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Quick Status Bar */}
          <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-3 py-2 text-[12px]">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">Status:</span>
              {problem.solved ? (
                <span className="font-medium text-emerald-400 flex items-center gap-1">
                  <Check className="h-3 w-3 stroke-[2.5]" /> Solved
                </span>
              ) : (
                <span className="text-zinc-400 font-normal">Not Solved</span>
              )}
            </div>
            {problem.lastSolvedAt && (
              <div className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
                <Calendar className="h-3 w-3 text-zinc-500" />
                <span>Last: {formatLastSolved(problem.lastSolvedAt)}</span>
              </div>
            )}
          </div>

          {/* Simple Notes Area */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-zinc-300 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              <span>Problem Notes &amp; Insights</span>
            </label>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Add your optimal approach, time/space complexity, or edge cases to remember..."
              rows={4}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 p-2.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/80 focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-normal resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between gap-2 pt-1 border-t border-zinc-800/80 mt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 px-3 text-[12px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {problem.solved ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onSaveNotes(false, userNotes)}
                  disabled={isPending}
                  className="h-8 px-2.5 text-[11px] text-zinc-400 border-zinc-800 hover:text-rose-400 hover:border-rose-500/30"
                >
                  Unmark Solved
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onSaveNotes(true, userNotes)}
                  disabled={isPending}
                  className="h-8 px-3 text-[12px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isPending ? "Saving..." : "Save Notes"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => onSaveNotes(true, userNotes)}
                disabled={isPending}
                className="h-8 px-3 text-[12px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isPending ? "Saving..." : "Mark Solved & Save"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ProblemNoteModal as RandomProblemCard };
