"use client";

import React from "react";
import { Zap, Clock, Calendar, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatMinutes } from "@/lib/formatters";
import type { SmartCatchupResult } from "../types";

interface SmartCatchupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catchupData: SmartCatchupResult;
  onApplyCatchup: () => void;
}

export function SmartCatchupModal({
  open,
  onOpenChange,
  catchupData,
  onApplyCatchup,
}: SmartCatchupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 shadow-dialog select-none">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="h-4 w-4" />
            <DialogTitle className="text-base font-semibold">Smart Catch-Up Redistribution</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            Reallocate overdue and missed sprint tasks across your remaining study days smoothly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Overdue summary card */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="space-y-0.5">
              <span className="text-[11px] text-zinc-500 font-medium">Overdue Tasks</span>
              <div className="text-lg font-bold text-zinc-100 font-mono">
                {catchupData.overdueTasksCount} tasks
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] text-zinc-500 font-medium">Estimated Backlog</span>
              <div className="text-lg font-bold text-amber-400 font-mono">
                {formatMinutes(catchupData.overdueMinutes)}
              </div>
            </div>
          </div>

          {/* Redistribution plan description */}
          <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-950/20 text-xs text-zinc-300 space-y-1.5 leading-relaxed">
            <div className="font-semibold text-blue-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Optimized Plan Adjustment</span>
            </div>
            <p className="text-zinc-300">
              Adding <strong className="text-blue-300 font-mono">+{catchupData.extraMinutesPerDay}m</strong> study time across your next{" "}
              <strong className="text-blue-300 font-mono">{catchupData.remainingDaysCount} days</strong> will get your roadmap back on schedule without burning out.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onApplyCatchup}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-medium"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" /> Apply Catch-Up Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
