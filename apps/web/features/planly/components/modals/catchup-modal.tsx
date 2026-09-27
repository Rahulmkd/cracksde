import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

interface CatchupModalProps {
  isOpen: boolean;
  onClose: () => void;
  catchupDaysCount: number;
}

export function CatchupModal({ isOpen, onClose, catchupDaysCount }: CatchupModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Catch-up Day Optimization
          </DialogTitle>
          <DialogDescription>
            Your curriculum automatically schedules designated Catch-up & Revision buffer days.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3 text-xs text-muted-foreground">
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-foreground flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{catchupDaysCount} Buffer Days Included</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Catch-up days are zero-task days strategically placed at the end of each sprint for backlog resolution and deep spaced reviews.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>Unfinished tasks carry forward automatically</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>Spaced repetition items sync automatically with your study sprint</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button size="sm" onClick={onClose}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
