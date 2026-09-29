"use client";

import React from "react";
import { FileText, Copy, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import type { NoteItem } from "../types";

interface NoteEditorPanelProps {
  activeNote: NoteItem | undefined;
  onUpdateTitle: (title: string) => void;
  onUpdateSubject: (subject: string) => void;
  onUpdateContent: (content: string) => void;
  onCopyMarkdown: () => void;
  onDeleteNote: (id: string) => void;
}

const SUBJECT_OPTIONS = [
  "General",
  "DSA",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "System Design",
];

export function NoteEditorPanel({
  activeNote,
  onUpdateTitle,
  onUpdateSubject,
  onUpdateContent,
  onCopyMarkdown,
  onDeleteNote,
}: NoteEditorPanelProps) {
  return (
    <div className="lg:col-span-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden flex flex-col min-h-[600px]">
      {activeNote ? (
        <>
          {/* Note Header */}
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/70 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                placeholder="Note title..."
                className="text-[16px] font-semibold text-zinc-100 bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-blue-500 focus:outline-none w-full pb-0.5 font-sans"
              />

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={activeNote.subject || "General"}
                  onChange={(e) => onUpdateSubject(e.target.value)}
                  className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 focus:outline-none font-medium"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCopyMarkdown}
                  className="h-7 px-2 text-[11px] font-medium"
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteNote(activeNote.id)}
                  className="h-7 px-2 text-[11px] font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
              <Clock className="h-3 w-3" />
              <span>Last edited: {activeNote.updatedAt}</span>
            </div>
          </div>

          {/* Tiptap Canvas */}
          <div className="flex-1 p-4 bg-zinc-950">
            <TiptapEditor
              value={activeNote.content}
              onChange={onUpdateContent}
              className="min-h-[480px] bg-transparent border-0"
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-2 text-zinc-500">
          <FileText className="h-8 w-8 text-zinc-600" />
          <p className="text-[13px] font-medium text-zinc-400">Select or create a note</p>
        </div>
      )}
    </div>
  );
}
