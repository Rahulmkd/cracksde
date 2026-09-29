"use client";

import React, { useMemo } from "react";
import { Search } from "lucide-react";
import { NoteCardItem } from "./note-card-item";
import type { NoteItem } from "../types";

interface NotesSidebarProps {
  notes: NoteItem[];
  selectedNoteId: string;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function NotesSidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  searchQuery,
  setSearchQuery,
}: NotesSidebarProps) {
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter((n) => {
      const titleMatch = n.title.toLowerCase().includes(query);
      const contentMatch = n.content.toLowerCase().includes(query);
      const tagsMatch = n.tags?.some((t) => t.toLowerCase().includes(query));
      return titleMatch || contentMatch || tagsMatch;
    });
  }, [notes, searchQuery]);

  return (
    <div className="lg:col-span-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden flex flex-col max-h-[700px]">
      {/* Search */}
      <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/60">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-8 pr-3 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 p-1.5 space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="p-6 text-center text-[12px] text-zinc-500">
            No matching notes found
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCardItem
              key={note.id}
              note={note}
              isSelected={note.id === selectedNoteId}
              onSelect={() => onSelectNote(note.id)}
              onDelete={(id, e) => onDeleteNote(id, e)}
            />
          ))
        )}
      </div>
    </div>
  );
}
