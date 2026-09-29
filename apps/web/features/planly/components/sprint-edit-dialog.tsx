"use client";

import React, { useState, useEffect } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SprintEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  initialHours?: number;
  initialStartDate?: string;
  onSave: (name: string, dailyHours: number, startDate?: string) => void;
  isSaving?: boolean;
}

export function SprintEditDialog({
  open,
  onOpenChange,
  initialName = "Crack SDE Master Study Plan",
  initialHours = 4,
  initialStartDate = "",
  onSave,
  isSaving,
}: SprintEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [dailyHours, setDailyHours] = useState(initialHours);
  const [startDate, setStartDate] = useState(initialStartDate);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDailyHours(initialHours);
      setStartDate(initialStartDate);
    }
  }, [open, initialName, initialHours, initialStartDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, dailyHours, startDate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 shadow-dialog select-none">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2 text-zinc-200">
            <Settings2 className="h-4 w-4 text-blue-400" />
            <DialogTitle className="text-base font-semibold">Adjust Study Plan</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            Reconfigure study hours per day, plan title, or start date milestone.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Plan Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Crack SDE 9-Sprint Mastery"
              className="h-8 text-xs bg-zinc-900 border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-zinc-300">Daily Study Target</span>
              <span className="font-mono text-blue-400 font-semibold">{dailyHours} hours/day</span>
            </div>
            <Slider
              value={dailyHours}
              onChange={(val: number) => setDailyHours(val)}
              min={1}
              max={10}
              step={0.5}
              className="py-1"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 text-xs bg-zinc-900 border-zinc-800 font-mono"
            />
          </div>

          <DialogFooter className="pt-3">
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
              type="submit"
              size="sm"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-medium"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
