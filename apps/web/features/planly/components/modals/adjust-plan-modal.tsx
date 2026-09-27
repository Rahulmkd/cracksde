"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Clock, Sliders } from "lucide-react";

interface AdjustPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyHours: number;
  onSave: (dailyHours: number) => void;
  isSaving?: boolean;
}

export function AdjustPlanModal({
  isOpen,
  onClose,
  dailyHours: initialDailyHours,
  onSave,
  isSaving = false,
}: AdjustPlanModalProps) {
  const [hours, setHours] = useState(initialDailyHours || 4);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            Adjust Daily Study Pace
          </DialogTitle>
          <DialogDescription>
            Modify your daily preparation hours to recalculate your target completion pace.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Daily Study Time</span>
            <span className="text-sm font-bold text-primary">{hours} Hours / Day</span>
          </div>

          <Slider
            min={1}
            max={12}
            step={1}
            value={[hours]}
            onValueChange={(val) => setHours(val[0])}
            className="py-2"
          />

          <div className="flex justify-between text-[11px] text-muted-foreground px-1">
            <span>1h (Light)</span>
            <span>4h (Standard)</span>
            <span>8h (Intensive)</span>
            <span>12h (Full-time)</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isSaving}
            onClick={() => onSave(hours)}
          >
            {isSaving ? "Saving..." : "Apply Pace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
