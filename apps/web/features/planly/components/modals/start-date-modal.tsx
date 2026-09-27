"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

interface StartDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStartDate?: string | null;
  onSave: (startDate: string) => void;
  isSaving?: boolean;
}

export function StartDateModal({
  isOpen,
  onClose,
  initialStartDate,
  onSave,
  isSaving = false,
}: StartDateModalProps) {
  const [date, setDate] = useState("");

  useEffect(() => {
    if (initialStartDate) {
      try {
        const d = new Date(initialStartDate);
        if (!isNaN(d.getTime())) {
          setDate(d.toISOString().split("T")[0]);
        }
      } catch {
        // fallback
      }
    }
  }, [initialStartDate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Set Kick-off Start Date
          </DialogTitle>
          <DialogDescription>
            Setting a new start date cascades calendar dates across all sprints and daily study targets.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <label htmlFor="start-date-input" className="text-xs font-medium text-foreground">
            Calendar Start Date
          </label>
          <Input
            id="start-date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!date || isSaving}
            onClick={() => onSave(date)}
          >
            {isSaving ? "Updating Schedule..." : "Recalculate Dates"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
