"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Copy,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NoteItem {
  id: string;
  title: string;
  subject?: string;
  content: string;
  updatedAt: string;
  tags?: string[];
}

const STORAGE_KEY = "cracksde_notespace_notes";

export default function NotesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Load user notes from localStorage on mount (never auto-seed demo notes)
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
          setSelectedNoteId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load notes from localStorage", e);
    }
  }, []);

  // Sync user notes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes to localStorage", e);
    }
  }, [notes, isMounted]);

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = n.title.toLowerCase().includes(query);
    const contentMatch = n.content.toLowerCase().includes(query);
    const tagsMatch = n.tags?.some((t) => t.toLowerCase().includes(query));
    return titleMatch || contentMatch || tagsMatch;
  });

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `note_${Date.now()}`,
      title: "Untitled Note",
      subject: "General",
      content: "<p></p>",
      updatedAt: "Just now",
      tags: [],
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    toast.success("New note created");
  };

  const handleUpdateActiveTitle = (title: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, title, updatedAt: "Just now" } : n
      )
    );
  };

  const handleUpdateActiveSubject = (subject: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, subject, updatedAt: "Just now" } : n
      )
    );
  };

  const handleUpdateActiveContent = (content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, content, updatedAt: "Just now" } : n
      )
    );
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (selectedNoteId === id) {
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : "");
    }
    toast.info("Note removed");
  };

  const handleCopyMarkdown = () => {
    if (activeNote) {
      const plainText = activeNote.content.replace(/<[^>]+>/g, "");
      navigator.clipboard.writeText(`# ${activeNote.title}\n\n${plainText}`);
      toast.success("Copied note to clipboard");
    }
  };

  // Prevent hydration mismatch during initial mount
  if (!isMounted) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // When there are no notes, render the centered empty state exactly as in the reference screenshot
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
            onClick={handleCreateNote}
            className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Note
          </Button>
        </div>

        {/* Centered Empty State matching screenshot */}
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

          {/* Reference Screenshot Message */}
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

  // When notes exist, render the clean NoteSpace editor
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
            onClick={handleCreateNote}
            className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Note
          </Button>
        </div>
      </div>

      {/* Split Pane: Notes List + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[600px]">
        {/* Left Sidebar: Notes List */}
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
              filteredNotes.map((note) => {
                const isSelected = note.id === selectedNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
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
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="text-zinc-600 hover:text-red-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Editor Canvas */}
        <div className="lg:col-span-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden flex flex-col min-h-[600px]">
          {activeNote ? (
            <>
              {/* Note Header */}
              <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => handleUpdateActiveTitle(e.target.value)}
                    placeholder="Note title..."
                    className="text-[16px] font-semibold text-zinc-100 bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-blue-500 focus:outline-none w-full pb-0.5 font-sans"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={activeNote.subject || "General"}
                      onChange={(e) => handleUpdateActiveSubject(e.target.value)}
                      className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 focus:outline-none font-medium"
                    >
                      <option value="General">General</option>
                      <option value="DSA">DSA</option>
                      <option value="DBMS">DBMS</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Computer Networks">Computer Networks</option>
                      <option value="System Design">System Design</option>
                    </select>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyMarkdown}
                      className="h-7 px-2 text-[11px] font-medium"
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(activeNote.id)}
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
                  onChange={handleUpdateActiveContent}
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
      </div>
    </div>
  );
}
