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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
      title: "Binary Tree Traversals & Trick Summary",
      subject: "DSA",
      content: "<p><strong>In-order (LNR):</strong> Yields sorted order for BST.</p><p><strong>Morris Traversal:</strong> Enables O(1) space traversal using threaded binary trees.</p>",
      updatedAt: "2 hrs ago",
      tags: ["Trees", "Binary Search Trees", "Morris Traversal"],
    },
    {
      id: "n2",
      title: "ACID Isolation Levels & Phantom Reads",
      subject: "DBMS",
      content: "<p><strong>Read Uncommitted:</strong> Dirty reads possible.</p><p><strong>Read Committed:</strong> Non-repeatable reads possible.</p><p><strong>Repeatable Read:</strong> Phantom reads possible.</p><p><strong>Serializable:</strong> Full MVCC / 2PL isolation.</p>",
      updatedAt: "1 day ago",
      tags: ["Transactions", "ACID", "MVCC"],
    },
    {
      id: "n3",
      title: "Virtual Memory Paging & TLB Miss Handling",
      subject: "Operating Systems",
      content: "<p>Page fault handling flow from hardware trap to OS interrupt handler, disk block fetch, page table update, and process resumption.</p>",
      updatedAt: "3 days ago",
      tags: ["Paging", "TLB", "Virtual Memory"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("DSA");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleOpenCreate = () => {
    setActiveNote(null);
    setEditTitle("");
    setEditSubject("DSA");
    setEditContent("<p>Write your interview revision notes, code templates, or key concepts here...</p>");
    setEditTags("DSA, Quick Revision");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (n: NoteItem) => {
    setActiveNote(n);
    setEditTitle(n.title);
    setEditSubject(n.subject);
    setEditContent(n.content);
    setEditTags(n.tags.join(", "));
    setIsEditorOpen(true);
  };

  const handleSaveNote = () => {
    if (!editTitle.trim()) {
      toast.error("Please enter a note title");
      return;
    }

    const tagsArray = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (activeNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNote.id
            ? {
                ...n,
                title: editTitle.trim(),
                subject: editSubject,
                content: editContent,
                tags: tagsArray,
                updatedAt: "Just now",
              }
            : n
        )
      );
      toast.success("Note updated successfully");
    } else {
      const newNote: NoteItem = {
        id: `n-${Date.now()}`,
        title: editTitle.trim(),
        subject: editSubject,
        content: editContent,
        tags: tagsArray,
        updatedAt: "Just now",
      };
      setNotes((prev) => [newNote, ...prev]);
      toast.success("New note created");
    }

    setIsEditorOpen(false);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.info("Note deleted");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <FileText className="h-3 w-3 text-blue-400" />
            <span>NoteSpace</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            Interview Notes &amp; Cheatsheets
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Write, review, and organize custom technical notes, algorithmic patterns, and system design summaries.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreate}
          className="h-7 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> New Note
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search notes by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[12px]">
          <span className="text-zinc-500 text-[11px] font-medium mr-1">Subject:</span>
          {["all", "DSA", "DBMS", "Operating Systems", "Computer Networks", "System Design"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSubject(s)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                selectedSubject === s
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                  : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              )}
            >
              {s === "all" ? "All Subjects" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleOpenEdit(note)}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2.5 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-subtle"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" className="text-[11px] font-medium py-0 px-2">
                    {note.subject}
                  </Badge>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> {note.updatedAt}
                  </span>
                </div>

                <h3 className="text-[14px] font-semibold leading-snug text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {note.title}
                </h3>

                <div
                  className="text-[12px] font-normal text-zinc-400 line-clamp-3 leading-normal"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </div>

              <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
                <div className="flex flex-wrap gap-1 overflow-hidden">
                  {note.tags.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Note"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center space-y-1.5">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
              <FileText className="h-4 w-4" />
            </div>
            <p className="text-[13px] font-medium text-zinc-300">No notes found</p>
            <p className="text-[12px] text-zinc-500">
              Create your first interview study note to start building your cheatsheet.
            </p>
          </div>
        )}
      </div>

      {/* Note Editor Modal */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-zinc-950">
          <DialogHeader className="p-4 pb-2.5 border-b border-zinc-800 bg-zinc-900/50">
            <DialogTitle className="text-[15px] font-semibold leading-snug">{activeNote ? "Edit Note" : "Create New Note"}</DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Write rich formatted notes, formulas, and pseudocode for rapid interview revision.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[12px] font-medium text-zinc-200">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic Programming - 0/1 Knapsack Pattern"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium text-zinc-200">Subject</label>
                <select
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
                >
                  <option value="DSA">DSA</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. DP, Knapsack, Optimization"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Content</label>
              <TiptapEditor
                value={editContent}
                onChange={setEditContent}
                className="min-h-[220px]"
              />
            </div>
          </div>

          <DialogFooter className="p-3.5 border-t border-zinc-800 bg-zinc-950">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditorOpen(false)}
              className="text-[12px] font-medium h-7"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveNote}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium h-7"
            >
              <Save className="h-3.5 w-3.5 mr-1" /> Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
