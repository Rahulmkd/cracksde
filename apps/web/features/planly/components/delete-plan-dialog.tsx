"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

interface DeletePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => Promise<void> | void;
  isDeleting?: boolean;
}

export function DeletePlanDialog({
  open,
  onOpenChange,
  onConfirmDelete,
  isDeleting = false,
}: DeletePlanDialogProps) {
  const handleClose = () => {
    if (isDeleting) return;
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (isDeleting) return;
    await onConfirmDelete();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-rose-950/60 bg-zinc-950 text-zinc-100 p-6 shadow-2xl select-none">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-rose-400">
                Delete Study Plan
              </DialogTitle>
              <span className="text-[11px] text-zinc-400">
                Reset your roadmap schedule and progress tracking
              </span>
            </div>
          </div>
          <DialogDescription className="text-xs text-zinc-300 leading-relaxed pt-1">
            Are you sure you want to delete this study plan? This will reset all your sprint progress, daily schedules, and task completions for this roadmap.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
              <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              What will be reset:
            </div>
            <ul className="text-[11px] text-zinc-400 space-y-1.5 pl-5 list-disc">
              <li>All completed tasks, study hours, and sprint progress</li>
              <li>Your personalized schedule start dates and catch-up redistribution</li>
              <li>Spaced repetition queue linked to this study plan</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="w-full sm:w-auto h-8 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto h-8 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting Plan...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Delete Study Plan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
