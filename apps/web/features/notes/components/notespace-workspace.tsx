"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotesStorage } from "../hooks/use-notes-storage";
import { NotesSidebar } from "./notes-sidebar";
import { NoteEditorPanel } from "./note-editor-panel";

export function NotespaceWorkspace() {
  const {
    isMounted,
    notes,
    selectedNoteId,
    setSelectedNoteId,
    activeNote,
    createNote,
    updateActiveTitle,
    updateActiveSubject,
    updateActiveContent,
    deleteNote,
    copyMarkdown,
  } = useNotesStorage();

  const [searchQuery, setSearchQuery] = useState("");

  // Prevent hydration mismatch during initial mount
  if (!isMounted) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // When there are no notes, render the centered empty state
  if (notes.length === 0) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-140px)] select-none">
        {/* Top Header with New Note Action */}
        <div className="flex items-center justify-between pb-4">
          <div className="space-y-0.5">
            <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
              NoteSpace
            </h1>
            <p className="text-[12px] font-normal text-zinc-400 leading-normal">
              Quick insights, formulas, and cheatsheets.
            </p>
          </div>

          <Button
            size="sm"
            onClick={createNote}
            className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Note
          </Button>
        </div>

        {/* Centered Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
          {/* Glassmorphic Dark Folder Graphic */}
          <div className="relative flex items-center justify-center w-28 h-24 mb-4">
            <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <svg
              width="120"
              height="96"
              viewBox="0 0 120 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-20 sm:w-28 sm:h-24 select-none drop-shadow-2xl"
            >
              <defs>
                <radialGradient id="folderGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>

                <linearGradient
                  id="folderBackGrad"
                  x1="16"
                  y1="12"
                  x2="104"
                  y2="84"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#1e2536" />
                  <stop offset="100%" stopColor="#0f131d" />
                </linearGradient>

                <linearGradient
                  id="folderFrontGrad"
                  x1="12"
                  y1="30"
                  x2="108"
                  y2="86"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#334155" stopOpacity="0.72" />
                  <stop offset="100%" stopColor="#172033" stopOpacity="0.88" />
                </linearGradient>

                <linearGradient
                  id="folderFrontBorder"
                  x1="12"
                  y1="30"
                  x2="108"
                  y2="86"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
                  <stop offset="40%" stopColor="#475569" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.1" />
                </linearGradient>

                <linearGradient
                  id="folderBackBorder"
                  x1="16"
                  y1="12"
                  x2="104"
                  y2="84"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Ambient light glow */}
              <ellipse cx="60" cy="52" rx="44" ry="32" fill="url(#folderGlow)" />

              {/* Folder Back Body with Tab */}
              <path
                d="M18 18C18 13.5817 21.5817 10 26 10H46C49.0305 10 51.8906 11.4361 53.7145 13.8679L57.2855 18.6321C59.1094 21.0639 61.9695 22.5 65 22.5H94C98.4183 22.5 102 26.0817 102 30.5V70C102 74.4183 98.4183 78 94 78H26C21.5817 78 18 74.4183 18 70V18Z"
                fill="url(#folderBackGrad)"
                stroke="url(#folderBackBorder)"
                strokeWidth="1.2"
              />

              {/* Inner dark pocket cavity */}
              <rect
                x="22"
                y="28"
                width="76"
                height="44"
                rx="6"
                fill="#0b0e17"
                fillOpacity="0.5"
              />

              {/* Folder Front Translucent Glass Flap */}
              <rect
                x="12"
                y="32"
                width="96"
                height="48"
                rx="12"
                fill="url(#folderFrontGrad)"
                stroke="url(#folderFrontBorder)"
                strokeWidth="1.2"
              />

              {/* Subtle top edge highlight on front pocket */}
              <path
                d="M24 33.5H96"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h2 className="text-[16px] sm:text-[17px] font-semibold tracking-tight text-zinc-100">
              &quot;Notespace&quot; is empty.
            </h2>
            <p className="text-[12px] sm:text-[13px] text-zinc-400 font-normal leading-relaxed">
              Notes you save on problems will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100 flex items-center gap-2">
            <span>NoteSpace</span>
            <Badge variant="blue" className="text-[10px] font-medium py-0 px-1.5 font-mono">
              {notes.length} {notes.length === 1 ? "Note" : "Notes"}
            </Badge>
          </h1>
          <p className="text-[12px] font-normal text-zinc-400 leading-normal">
            Quick insights, formulas, and cheatsheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={createNote}
            className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Note
          </Button>
        </div>
      </div>

      {/* Split Pane: Notes List + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[600px]">
        <NotesSidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onDeleteNote={deleteNote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <NoteEditorPanel
          activeNote={activeNote}
          onUpdateTitle={updateActiveTitle}
          onUpdateSubject={updateActiveSubject}
          onUpdateContent={updateActiveContent}
          onCopyMarkdown={copyMarkdown}
          onDeleteNote={deleteNote}
        />
      </div>
    </div>
  );
}
