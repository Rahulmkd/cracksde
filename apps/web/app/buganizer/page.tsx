"use client";

import React, { useState } from "react";
import {
  CalendarCheck2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Tag,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BugItem {
  id: string;
  title: string;
  category: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "Resolved";
  notes: string;
  solution: string;
}

export default function BuganizerPage() {
  const [bugs, setBugs] = useState<BugItem[]>([
    {
      id: "b1",
      title: "Integer Overflow on Binary Search Mid Point Calculation",
      category: "DSA",
      severity: "High",
      status: "Resolved",
      notes: "Using `(low + high) / 2` can cause signed 32-bit integer overflow when low + high > 2^31 - 1.",
      solution: "Always write `int mid = low + (high - low) / 2;` or bitwise `low + ((high - low) >> 1)`."
    },
    {
      id: "b2",
      title: "Off-by-One in Sliding Window Right Pointer Expansion",
      category: "DSA",
      severity: "Medium",
      status: "Resolved",
      notes: "Condition check `right < n` vs `right <= n` when shrinking left window pointer.",
      solution: "Keep window invariant: `[left, right]` inclusive, update frequencies before incrementing right."
    },
    {
      id: "b3",
      title: "SQL Non-SARGable WHERE clause causing Full Table Scan",
      category: "DBMS",
      severity: "High",
      status: "Open",
      notes: "Query `WHERE YEAR(created_at) = 2026` invalidates index on `created_at`.",
      solution: "Rewrite to `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'` to leverage index range scan."
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("DSA");
  const [newSeverity, setNewSeverity] = useState<"High" | "Medium" | "Low">("Medium");
  const [newNotes, setNewNotes] = useState("");
  const [newSolution, setNewSolution] = useState("");

  const handleCreateBug = () => {
    if (!newTitle.trim()) {
      toast.error("Please provide an issue title");
      return;
    }
    const newBug: BugItem = {
      id: `b-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      severity: newSeverity,
      status: "Open",
      notes: newNotes.trim(),
      solution: newSolution.trim(),
    };
    setBugs((prev) => [newBug, ...prev]);
    toast.success("New tricky edge-case tracked");
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewNotes("");
    setNewSolution("");
  };

  const toggleBugStatus = (id: string) => {
    setBugs((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextStatus = b.status === "Open" ? "Resolved" : "Open";
          if (nextStatus === "Resolved") toast.success(`Resolved: ${b.title}`);
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  const handleDeleteBug = (id: string) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
    toast.info("Issue removed");
  };

  const filteredBugs = bugs.filter(
    (b) =>
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[12px] font-medium text-zinc-300 uppercase tracking-wider">
            <CalendarCheck2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Buganizer</span>
          </div>
          <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
            Interview Edge-Case &amp; Bug Tracker
          </h1>
          <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
            Record recurring coding mistakes, off-by-one errors, and tricky interviewer corner cases to never repeat them.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="h-8 px-3.5 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Track New Bug
        </Button>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search edge cases and bug descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
        </div>
      </div>

      {/* Bug Items List */}
      <div className="space-y-3.5">
        {filteredBugs.map((bug) => (
          <div
            key={bug.id}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Badge variant={bug.category === "DSA" ? "blue" : "success"} className="text-[12px] font-medium">
                  {bug.category}
                </Badge>
                <Badge variant={bug.severity === "High" ? "destructive" : "warning"} className="text-[12px] font-medium">
                  {bug.severity} Severity
                </Badge>
                <Badge variant={bug.status === "Resolved" ? "success" : "secondary"} className="text-[12px] font-medium">
                  {bug.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleBugStatus(bug.id)}
                  className="h-7 text-[12px] font-medium"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {bug.status === "Resolved" ? "Mark Open" : "Mark Resolved"}
                </Button>
                <button
                  onClick={() => handleDeleteBug(bug.id)}
                  className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                  title="Delete Bug"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold leading-[1.35] text-zinc-100">
                {bug.title}
              </h3>
              <p className="text-[13px] font-normal text-zinc-400 mt-1 leading-[1.45]">{bug.notes}</p>
            </div>

            {bug.solution && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 text-[13px] text-emerald-300 space-y-1 font-normal leading-[1.45]">
                <span className="font-semibold text-emerald-200 flex items-center gap-1 text-[13px]">
                  💡 Fix / Preventive Rule:
                </span>
                <p>{bug.solution}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Bug Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold leading-[1.3]">Track Interview Edge Case</DialogTitle>
            <DialogDescription className="text-[13px] text-zinc-400 leading-[1.45]">
              Record tricky bugs or interview traps you encountered so you remember the fix.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-200">Bug / Issue Title</label>
              <input
                type="text"
                placeholder="e.g. Memory leak in cyclical shared_ptr references"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-200">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
                >
                  <option value="DSA">DSA</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-zinc-200">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as "High" | "Medium" | "Low")}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
                >
                  <option value="High">High Severity</option>
                  <option value="Medium">Medium Severity</option>
                  <option value="Low">Low Severity</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-200">Problem / Symptom</label>
              <textarea
                placeholder="Describe why the mistake occurred during testing..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-200">Permanent Fix / Best Practice</label>
              <textarea
                placeholder="Rule of thumb or pattern to prevent this in the future..."
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="text-[13px] font-medium h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateBug}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium h-8"
            >
              Save Bug Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
