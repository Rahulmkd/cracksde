"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Check, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { RoadmapItemDto, RoadmapTopicDto } from "../types";

interface QuestionSolveModalProps {
  item: RoadmapItemDto | null;
  subjectSlug: string | null;
  currentTopic: RoadmapTopicDto | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordSolve: (isCorrect: boolean, notes: string) => Promise<void>;
  isPending?: boolean;
}

export function QuestionSolveModal({
  item,
  subjectSlug,
  currentTopic,
  isOpen,
  onClose,
  onRecordSolve,
  isPending = false,
}: QuestionSolveModalProps) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setNotes(item.progress?.notes || "");
    }
  }, [item]);

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100 shadow-dialog">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="blue" className="text-[10px] font-mono py-0 px-1.5">
              {subjectSlug?.toUpperCase() || "SUBJECT"}
            </Badge>
            <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400">
              {item.subtopicName || currentTopic?.name}
            </Badge>
          </div>

          <DialogTitle className="text-[16px] font-semibold leading-tight text-zinc-100">
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-[12px] text-zinc-400">
            Record your practice result to automatically advance your spaced repetition schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-[12px]">
          {/* Spaced Repetition Roadmap Timeline */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-zinc-300 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                Spaced Repetition Schedule
              </span>
              <span className="text-zinc-500 font-mono">
                Current: {item.progress?.solveCount || 0} solves
              </span>
            </div>

            {/* 5-Step Interval Badges */}
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
              {[
                { step: 1, interval: "1 Day" },
                { step: 2, interval: "3 Days" },
                { step: 3, interval: "7 Days" },
                { step: 4, interval: "14 Days" },
                { step: 5, interval: "30 Days" },
              ].map((s) => {
                const currentCount = item.progress?.solveCount || 0;
                const isPassed = currentCount >= s.step;
                const isCurrent = currentCount + 1 === s.step;

                return (
                  <div
                    key={s.step}
                    className={cn(
                      "rounded-lg border p-1.5 transition-colors",
                      isCurrent
                        ? "border-blue-500 bg-blue-500/10 text-blue-300 font-semibold"
                        : isPassed
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-500"
                    )}
                  >
                    <div className="font-mono">{s.step}st</div>
                    <div className="text-[9px] mt-0.5 opacity-90">{s.interval}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">
              Notes / Key Learnings (Optional):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Remember to handle edge cases with negative numbers..."
              rows={3}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-[12px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 resize-none font-normal"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => onRecordSolve(true, notes)}
              disabled={isPending}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-all cursor-pointer text-center group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-[13px]">
                <Check className="h-4 w-4" />
                <span>Got it Correct</span>
              </div>
              <span className="text-[10px] text-emerald-400/80 mt-0.5">
                Advance to next revision interval
              </span>
            </button>

            <button
              type="button"
              onClick={() => onRecordSolve(false, notes)}
              disabled={isPending}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all cursor-pointer text-center group"
            >
              <div className="flex items-center gap-1.5 font-semibold text-[13px]">
                <RotateCcw className="h-4 w-4" />
                <span>Needs Review</span>
              </div>
              <span className="text-[10px] text-amber-400/80 mt-0.5">
                Schedule earlier revision (1 day)
              </span>
            </button>
          </div>
        </div>

        <DialogFooter className="border-t border-zinc-800/80 pt-3 flex justify-between sm:justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 text-[12px] text-zinc-400 hover:text-zinc-200"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
