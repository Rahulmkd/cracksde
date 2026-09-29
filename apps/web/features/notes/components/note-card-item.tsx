"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NoteItem } from "../types";

interface NoteCardItemProps {
  note: NoteItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function NoteCardItem({
  note,
  isSelected,
  onSelect,
  onDelete,
}: NoteCardItemProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-2.5 rounded-lg cursor-pointer transition-all space-y-1 group",
        isSelected
          ? "bg-zinc-900 border border-zinc-700/80 text-white shadow-sm"
          : "hover:bg-zinc-900/60 text-zinc-400 border border-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        {note.subject && (
          <Badge variant="blue" className="text-[10px] py-0 px-1.5 font-medium">
            {note.subject}
          </Badge>
        )}
        <span className="text-[10px] text-zinc-500 font-mono">{note.updatedAt}</span>
      </div>

      <h4
        className={cn(
          "text-[13px] font-semibold leading-snug truncate",
          isSelected ? "text-blue-400" : "text-zinc-200"
        )}
      >
        {note.title || "Untitled Note"}
      </h4>

      <div className="flex items-center justify-end pt-1 text-[10px]">
        <button
          onClick={(e) => onDelete(note.id, e)}
          className="text-zinc-600 hover:text-red-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete Note"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
