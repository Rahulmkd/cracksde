"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit3,
  BookOpen,
  FolderPlus,
  Clock,
  Save,
  Check,
  Tag,
  Copy,
  Download,
  Share2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TiptapEditor from "@/components/tiptap-editor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NoteItem {
  id: string;
  title: string;
  subject: string;
  content: string;
  updatedAt: string;
  tags: string[];
}

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: "n1",
      title: "Binary Tree Traversals & Morris Traversal Cheatsheet",
      subject: "DSA",
      content: `<h3>Binary Tree Traversal Invariants</h3><p><strong>In-order (Left, Root, Right):</strong> Yields strictly ascending elements when performed on a Binary Search Tree (BST).</p><p><strong>Pre-order (Root, Left, Right):</strong> Ideal for cloning trees and serializing hierarchical expressions.</p><p><strong>Post-order (Left, Right, Root):</strong> Essential for bottom-up evaluations like Maximum Path Sum and Tree Diameter.</p><blockquote><strong>Morris Traversal:</strong> Traverses binary trees in <code>O(N)</code> time and <code>O(1)</code> space using threaded binary pointers.</blockquote>`,
      updatedAt: "2 hrs ago",
      tags: ["Trees", "BST", "Morris Traversal", "Recursion"],
    },
    {
      id: "n2",
      title: "ACID Isolation Levels & MVCC Snapshot Isolation",
      subject: "DBMS",
      content: `<h3>SQL ANSI Transaction Isolation Anomalies</h3><ul><li><strong>Read Uncommitted:</strong> Subject to Dirty Reads, Non-repeatable Reads, and Phantom Reads.</li><li><strong>Read Committed:</strong> Prevents Dirty Reads via short-lived shared read locks.</li><li><strong>Repeatable Read:</strong> Snapshot isolation using Multi-Version Concurrency Control (MVCC) undo logs.</li><li><strong>Serializable:</strong> Strict two-phase locking (2PL) or Serializable Snapshot Isolation (SSI).</li></ul>`,
      updatedAt: "1 day ago",
      tags: ["Transactions", "ACID", "MVCC", "PostgreSQL"],
    },
    {
      id: "n3",
      title: "Virtual Memory Paging & TLB Miss Handling Flow",
      subject: "Operating Systems",
      content: `<h3>Memory Management Unit (MMU) Resolution Flow</h3><ol><li>CPU issues Virtual Address containing Virtual Page Number (VPN) and Page Offset.</li><li>MMU checks Translation Lookaside Buffer (TLB) cache.</li><li>On <em>TLB Miss</em>: Multi-level page table walk is executed in DRAM.</li><li>On <em>Page Fault</em>: Hardware raises interrupt trap 14; OS fetches page from disk swap.</li></ol>`,
      updatedAt: "3 days ago",
      tags: ["Virtual Memory", "Paging", "TLB", "Linux"],
    },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState<string>("n1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `n-${Date.now()}`,
      title: "Untitled Interview Cheatsheet",
      subject: "DSA",
      content: "<p>Write formulas, code templates, edge cases, and time complexity notes here...</p>",
      updatedAt: "Just now",
      tags: ["Quick Notes"],
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    toast.success("New cheatsheet created");
  };

  const handleUpdateActiveTitle = (title: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNoteId ? { ...n, title, updatedAt: "Just now" } : n))
    );
  };

  const handleUpdateActiveSubject = (subject: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNoteId ? { ...n, subject, updatedAt: "Just now" } : n))
    );
  };

  const handleUpdateActiveContent = (content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNoteId ? { ...n, content, updatedAt: "Just now" } : n))
    );
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (selectedNoteId === id && remaining.length > 0) {
      setSelectedNoteId(remaining[0].id);
    }
    toast.info("Cheatsheet removed");
  };

  const handleCopyMarkdown = () => {
    if (activeNote) {
      const plainText = activeNote.content.replace(/<[^>]+>/g, "");
      navigator.clipboard.writeText(`# ${activeNote.title}\n\n${plainText}`);
      toast.success("Copied note to clipboard");
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100 flex items-center gap-2">
            <span>NoteSpace</span>
            <Badge variant="blue" className="text-[10px] font-medium py-0 px-1.5 font-mono">
              IDE Cheatsheets
            </Badge>
          </h1>
          <p className="text-[12px] font-normal text-zinc-400 leading-normal">
            Organize algorithmic templates, system design architectures, and interview summaries in split-pane view.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleCreateNote}
            className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> New Note
          </Button>
        </div>
      </div>

      {/* Split Pane Interface: Left (Notes List) + Right (Full Tiptap Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[600px]">
        {/* ======================================================================= */}
        {/* LEFT COLUMN (4-5 COLS): NOTES SIDEBAR */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle flex flex-col max-h-[700px]">
          {/* Search & Subject Filters */}
          <div className="p-3 border-b border-zinc-800/80 space-y-2 bg-zinc-950/60">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search cheatsheets & tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-8 pr-3 py-1 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            {/* Subject Filters */}
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              {["all", "DSA", "DBMS", "OS", "CN"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s === "OS" ? "Operating Systems" : s === "CN" ? "Computer Networks" : s)}
                  className={cn(
                    "rounded px-2 py-0.5 font-medium transition-colors",
                    (selectedSubject === s || (s === "OS" && selectedSubject === "Operating Systems") || (s === "CN" && selectedSubject === "Computer Networks"))
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 p-1.5 space-y-1">
            {filteredNotes.map((note) => {
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
                    <Badge variant="blue" className="text-[10px] py-0 px-1.5 font-medium">
                      {note.subject}
                    </Badge>
                    <span className="text-[10px] text-zinc-500 font-mono">{note.updatedAt}</span>
                  </div>

                  <h4 className={cn("text-[13px] font-semibold leading-snug truncate", isSelected ? "text-blue-400" : "text-zinc-200")}>
                    {note.title}
                  </h4>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <div className="flex gap-1 overflow-hidden truncate">
                      {note.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-zinc-500 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>

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
            })}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (7-8 COLS): FULL-HEIGHT TIPTAP CANVAS */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-card flex flex-col min-h-[600px]">
          {activeNote ? (
            <>
              {/* Note Header & Metadata */}
              <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => handleUpdateActiveTitle(e.target.value)}
                    className="text-[16px] font-semibold text-zinc-100 bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-blue-500 focus:outline-none w-full pb-0.5 font-sans"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={activeNote.subject}
                      onChange={(e) => handleUpdateActiveSubject(e.target.value)}
                      className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none font-medium"
                    >
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
                      className="h-6 px-2 text-[11px] font-medium"
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy Note
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
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
              <p className="text-[13px] font-medium text-zinc-400">Select or create a cheatsheet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
