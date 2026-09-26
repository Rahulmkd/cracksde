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
  Code2,
  Filter,
  Check,
  XCircle,
  Lightbulb,
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
  mistakeSnippet?: string;
  solutionSnippet?: string;
  notes: string;
  solution: string;
}

export default function BuganizerPage() {
  const [bugs, setBugs] = useState<BugItem[]>([
    {
      id: "b1",
      title: "Integer Overflow on Binary Search Mid Calculation",
      category: "DSA",
      severity: "High",
      status: "Resolved",
      mistakeSnippet: "int mid = (low + high) / 2; // ❌ Overflows if low + high > 2^31 - 1",
      solutionSnippet: "int mid = low + (high - low) / 2; // ✅ Safe from 32-bit overflow",
      notes: "In C++ and Java, signed 32-bit integers overflow into negative values when their sum exceeds 2,147,483,647.",
      solution: "Always calculate mid using subtraction offset: `low + (high - low) / 2` or bitwise `low + ((high - low) >> 1)`.",
    },
    {
      id: "b2",
      title: "Off-by-One in Sliding Window Right Pointer Expansion",
      category: "DSA",
      severity: "Medium",
      status: "Resolved",
      mistakeSnippet: "while (right < n) {\n    if (freq[nums[right++]] > k) left++; // ❌ Updates after increment\n}",
      solutionSnippet: "while (right < n) {\n    freq[nums[right]]++;\n    while (freq[nums[right]] > k) freq[nums[left++]]--; // ✅ Invariant preserved\n    right++;\n}",
      notes: "Post-increment inside condition check breaks window boundary invariants during contraction.",
      solution: "Keep clear invariants: process `nums[right]`, shrink `left` while condition violated, then increment `right` at loop end.",
    },
    {
      id: "b3",
      title: "Non-SARGable WHERE Clause Causing Full Table Scans",
      category: "DBMS",
      severity: "High",
      status: "Open",
      mistakeSnippet: "-- ❌ Function on indexed column disables B+ Tree index scan:\nSELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = 2026;",
      solutionSnippet: "-- ✅ SARGable range scan uses B+ Tree index perfectly:\nSELECT * FROM orders WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01';",
      notes: "Applying functions or math operators directly to indexed columns in SQL prevents the optimizer from executing an index seek.",
      solution: "Isolate the column by shifting expressions to the literal comparison side.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("DSA");
  const [newSeverity, setNewSeverity] = useState<"High" | "Medium" | "Low">("Medium");
  const [newMistakeSnippet, setNewMistakeSnippet] = useState("");
  const [newSolutionSnippet, setNewSolutionSnippet] = useState("");
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
      mistakeSnippet: newMistakeSnippet.trim() || undefined,
      solutionSnippet: newSolutionSnippet.trim() || undefined,
      notes: newNotes.trim(),
      solution: newSolution.trim(),
    };
    setBugs((prev) => [newBug, ...prev]);
    toast.success("New interview edge-case logged");
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewMistakeSnippet("");
    setNewSolutionSnippet("");
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

  const filteredBugs = bugs.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || b.category === selectedCategory;
    const matchesSeverity = selectedSeverity === "all" || b.severity === selectedSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <CalendarCheck2 className="h-3 w-3 text-blue-400" />
            <span>Buganizer</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            Interview Edge-Case &amp; Bug Tracker
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Record recurring coding traps, off-by-one errors, and anti-patterns with before/after code diffs.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Log Edge Case
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search edge cases by description or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 text-[12px]">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-zinc-500 text-[11px] font-medium mr-1">Category:</span>
            {["all", "DSA", "DBMS", "Operating Systems", "System Design"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                  selectedCategory === c
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200"
                )}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[11px]">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bug Cards List */}
      <div className="space-y-3">
        {filteredBugs.map((bug) => (
          <div
            key={bug.id}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={bug.category === "DSA" ? "blue" : "success"} className="text-[11px] font-medium py-0 px-2">
                  {bug.category}
                </Badge>
                <Badge variant={bug.severity === "High" ? "destructive" : "warning"} className="text-[11px] font-medium py-0 px-2">
                  {bug.severity} Severity
                </Badge>
                <Badge variant={bug.status === "Resolved" ? "success" : "secondary"} className="text-[11px] font-medium py-0 px-2">
                  {bug.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleBugStatus(bug.id)}
                  className="h-6 text-[11px] font-medium"
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
              <h3 className="text-[14px] font-semibold leading-snug text-zinc-100">
                {bug.title}
              </h3>
              <p className="text-[12px] font-normal text-zinc-400 mt-1 leading-normal">{bug.notes}</p>
            </div>

            {/* Code Comparison Diffs (Mistake vs Fix) */}
            {(bug.mistakeSnippet || bug.solutionSnippet) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                {bug.mistakeSnippet && (
                  <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-2.5 space-y-1">
                    <span className="text-red-400 font-sans font-semibold text-[11px] flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> Anti-Pattern / Bug:
                    </span>
                    <pre className="text-zinc-300 whitespace-pre-wrap">{bug.mistakeSnippet}</pre>
                  </div>
                )}

                {bug.solutionSnippet && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5 space-y-1">
                    <span className="text-emerald-400 font-sans font-semibold text-[11px] flex items-center gap-1">
                      <Check className="h-3 w-3" /> Correct Solution:
                    </span>
                    <pre className="text-zinc-200 whitespace-pre-wrap">{bug.solutionSnippet}</pre>
                  </div>
                )}
              </div>
            )}

            {bug.solution && (
              <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-2.5 text-[12px] text-blue-300 space-y-0.5 font-normal leading-normal">
                <span className="font-semibold text-blue-200 flex items-center gap-1 text-[12px]">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" /> Preventative Rule of Thumb:
                </span>
                <p>{bug.solution}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Bug Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-zinc-950">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-[15px] font-semibold leading-snug">Log Interview Trap / Bug</DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Record tricky mistakes or edge-cases with code comparisons so you remember the fix.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Bug / Issue Title</label>
              <input
                type="text"
                placeholder="e.g. Memory leak in cyclical shared_ptr references"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-zinc-200">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
                >
                  <option value="DSA">DSA</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium text-zinc-200">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as "High" | "Medium" | "Low")}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
                >
                  <option value="High">High Severity</option>
                  <option value="Medium">Medium Severity</option>
                  <option value="Low">Low Severity</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Anti-Pattern / Wrong Code (optional)</label>
              <textarea
                placeholder="e.g. while (low < high) mid = (low + high) / 2..."
                value={newMistakeSnippet}
                onChange={(e) => setNewMistakeSnippet(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-[11px] text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Correct Code Snippet (optional)</label>
              <textarea
                placeholder="e.g. mid = low + (high - low) / 2..."
                value={newSolutionSnippet}
                onChange={(e) => setNewSolutionSnippet(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-[11px] text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Why the Mistake Occurred</label>
              <textarea
                placeholder="Explanation of why this bug happened during testing..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Permanent Rule of Thumb</label>
              <textarea
                placeholder="Rule to prevent this in the future..."
                value={newSolution}
                onChange={(e) => setNewSolution(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="text-[12px] font-medium h-7"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateBug}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium h-7"
            >
              Save Bug Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
