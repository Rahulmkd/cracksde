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
import { Edit2 } from "lucide-react";

interface RenamePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
  isSaving?: boolean;
}

export function RenamePlanModal({
  isOpen,
  onClose,
  currentName,
  onSave,
  isSaving = false,
}: RenamePlanModalProps) {
  const [name, setName] = useState(currentName || "");

  useEffect(() => {
    setName(currentName || "");
  }, [currentName]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-primary" />
            Rename Study Plan
          </DialogTitle>
          <DialogDescription>
            Give your preparation roadmap a customized title.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <label htmlFor="plan-name-input" className="text-xs font-medium text-foreground">
            Study Plan Name
          </label>
          <Input
            id="plan-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., FAANG SDE 60-Day Sprint"
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!name.trim() || isSaving}
            onClick={() => onSave(name.trim())}
          >
            {isSaving ? "Saving..." : "Save Title"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
