"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, X, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapItemDto } from "@cracksde/shared";

interface SolveQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: RoadmapItemDto | null;
  onSolve: (itemId: number, isCorrect: boolean, notes?: string) => void;
  isSubmitting?: boolean;
}

export function SolveQuestionDialog({
  isOpen,
  onClose,
  item,
  onSolve,
  isSubmitting = false,
}: SolveQuestionDialogProps) {
  const [isCorrect, setIsCorrect] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item?.progress?.notes) {
      setNotes(item.progress.notes);
    } else {
      setNotes("");
    }
    setIsCorrect(true);
  }, [item]);

  if (!item) return null;

  const handleConfirm = () => {
    onSolve(item.id, isCorrect, notes.trim() || undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] text-primary border-primary/20 bg-primary/10">
              {item.type || "Problem"} #{item.itemNo}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {item.difficulty || "Medium"}
            </Badge>
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {item.subjectName} › {item.topicName}
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-4">
          {/* Outcome Choice: Got it Right vs Needed Help */}
          <div>
            <label className="text-xs font-medium text-foreground block mb-2">
              How did your practice attempt go?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsCorrect(true)}
                className={cn(
                  "p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer",
                  isCorrect
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-xs ring-1 ring-emerald-500/30"
                    : "bg-background/40 hover:bg-card border-border/60 text-muted-foreground"
                )}
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Solved Correctly
              </button>

              <button
                type="button"
                onClick={() => setIsCorrect(false)}
                className={cn(
                  "p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer",
                  !isCorrect
                    ? "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-xs ring-1 ring-rose-500/30"
                    : "bg-background/40 hover:bg-card border-border/60 text-muted-foreground"
                )}
              >
                <X className="w-4 h-4 text-rose-400" />
                Struggled / Needed Help
              </button>
            </div>
          </div>

          {/* Spaced repetition schedule preview */}
          <div className="p-3 rounded-xl bg-background/50 border border-border/40 text-[11px] text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>
              {isCorrect
                ? "Next revision will be scheduled with spaced repetition expansion."
                : "Scheduled for early revision in 1 day to reinforce understanding."}
            </span>
          </div>

          {/* Quick Notes */}
          <div>
            <label htmlFor="solve-notes-input" className="text-xs font-medium text-foreground block mb-1.5">
              Study Notes / Key Takeaways (Optional)
            </label>
            <textarea
              id="solve-notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Corner case with empty array, O(N) two-pointer technique..."
              rows={3}
              className="w-full bg-background/60 border border-border/70 rounded-xl p-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" disabled={isSubmitting} onClick={handleConfirm}>
            {isSubmitting ? "Recording..." : "Save Progress"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
