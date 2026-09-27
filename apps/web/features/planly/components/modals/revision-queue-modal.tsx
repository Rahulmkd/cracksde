"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RevisionBadge } from "@/components/shared/revision-badge";
import { RotateCcw, Check, Sparkles, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRevisionItemDto } from "@cracksde/shared";

interface RevisionQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  revisionItems: UserRevisionItemDto[];
  onSolveQuestion: (itemId: number, isCorrect: boolean) => void;
}

export function RevisionQueueModal({
  isOpen,
  onClose,
  revisionItems,
  onSolveQuestion,
}: RevisionQueueModalProps) {
  const [tab, setTab] = useState<"due" | "upcoming" | "all">("due");

  const dueItems = revisionItems.filter((it) => it.progress?.isDue);
  const upcomingItems = revisionItems.filter((it) => !it.progress?.isDue);

  const activeItems = tab === "due" ? dueItems : tab === "upcoming" ? upcomingItems : revisionItems;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Spaced Repetition Queue
            </DialogTitle>
            <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30 bg-amber-500/10">
              {dueItems.length} Due for Review
            </Badge>
          </div>
          <DialogDescription>
            Review questions at scientifically spaced intervals (1d, 3d, 7d, 14d, 30d) to solidify long-term memory.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Filter */}
        <div className="flex items-center gap-2 border-b border-border/40 pb-3 pt-2">
          <Button
            variant={tab === "due" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("due")}
            className="h-8 text-xs font-medium gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Due Now ({dueItems.length})
          </Button>
          <Button
            variant={tab === "upcoming" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("upcoming")}
            className="h-8 text-xs font-medium gap-1.5"
          >
            Upcoming ({upcomingItems.length})
          </Button>
          <Button
            variant={tab === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("all")}
            className="h-8 text-xs font-medium"
          >
            All Scheduled ({revisionItems.length})
          </Button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
          {activeItems.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">No questions in this revision queue</p>
              <p className="text-xs text-muted-foreground mt-1">
                {tab === "due" ? "Great job! All spaced reviews are up to date." : "Solve questions in Prep Hub or Practice to schedule revisions."}
              </p>
            </div>
          ) : (
            activeItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-border/50 bg-card/40 hover:bg-card flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{item.title}</span>
                    {item.subjectName && (
                      <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted/40">
                        {item.subjectName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {item.topicName} • Solved {item.progress?.solveCount || 0} times
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <RevisionBadge
                    statusText={item.progress?.revisionStatusText || "Not Solved"}
                    isDue={Boolean(item.progress?.isDue)}
                    size="sm"
                  />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSolveQuestion(item.id, true)}
                    className="h-7 text-[11px] gap-1 px-2.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Check className="w-3 h-3" />
                    Reviewed
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
