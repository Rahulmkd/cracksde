"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Check,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Filter,
  Shuffle,
  AlertTriangle,
  RefreshCw,
  X,
  FileText,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  usePracticeProblems,
  useRoadmapSubjects,
  useRoadmapSubjectDetail,
  useSolveQuestion,
} from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerStore } from "@/store/planner-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { PracticeProblemDto } from "@starter/shared";

const CURRICULUM_TOPICS: Record<string, string[]> = {
  dsa: [
    "Arrays",
    "Sorting",
    "Hashing",
    "Strings",
    "Binary Search",
    "Recursion",
    "Linked-List",
    "Bit Manipulation",
    "Sliding Window / 2 Pointer",
    "Stack / Queues",
    "Greedy Algorithms",
    "Binary Trees",
    "Binary Search Trees",
    "Heaps",
    "Graphs",
    "Dynamic Programming",
    "Tries",
    "Strings (Advanced Algo)",
    "Maths",
  ],
  oops: [
    "Introduction to OOPS",
    "Core Principles of OOPS",
    "Advance OOPS features",
    "Relationships and Object Behaviour",
    "Advance Programming in OOPS",
    "OOP Design and Lifecycle Management",
  ],
  dbms: [
    "Getting Started",
    "DBMS Foundations and Architecture",
    "Core Foundations",
    "Conceptual Data Modeling",
    "Database Design",
    "Relational Model and Formal Query Languages",
    "Functional Dependencies and Database Design",
    "Querying Essentials",
    "Aggregation and Analysis",
    "Set Operations",
    "SQL Joins",
    "Subqueries",
    "Data Modification and Schema Evolution",
    "Physical Storage, Indexing, and Hashing",
    "Data Storage, Keys, and Query Optimization",
    "Query Processing and Optimization",
    "Query Performance",
    "Transactions and Access Control",
    "Transactions and Concurrency Control",
    "Database Recovery and Durability",
    "Integrity, Security, and Database Operations",
    "Distributed Databases, NoSQL, and Analytical Systems",
    "Applied Learning and Preparation",
  ],
  "operating-systems": [
    "Module-1 (Operating System Basics and OS Introduction)",
    "Module-2 (Process Management in Operating System)",
    "Module-3 (CPU Scheduling Algorithms in Operating System)",
    "Module-4 (Kernel, OS Structures, and Advanced Scheduling)",
    "Module-5 (Threads and Multithreading in Operating System)",
    "Module-6 (Process Synchronization and Concurrency Control)",
    "Module-7 (Deadlock, Starvation, and Concurrency Bugs)",
  ],
  "computer-networks": [
    "Module-1 (CN Foundations)",
    "Module-2 (Network Models)",
    "Module-3 (Physical and Data Link Layer)",
    "Module-4 (Network Topologies and VLANs)",
    "Module-5 (Network Layer: IP Addressing)",
    "Module-6 (Network Layer: Routing)",
    "Module-7 (Transport Layer)",
    "Module-8 (Application Layer)",
    "Module-9 (NAT and Internet Edge Networking)",
    "Module-10 (Switching Techniques)",
    "Module-11 (Network Security)",
    "Module-12 (Cryptography and Secure Protocols)",
    "Module-13: (Wireless Networking)",
    "Module-14 (Network Performance)",
    "Module-15 (Situation Based Explanations)",
  ],
  lld: [
    "Introduction to LLD",
    "Solid Principles",
    "UML",
    "Creational Design Patterns",
    "Structural Design Patterns",
    "Behavioural Design Patterns",
    "Multithreading and Concurrency",
    "Dependency Injection",
    "Exceptions and Error Handling",
    "Best practices in LLD",
    "Interview Problems (Part-1)",
    "Interview Problems (Part-2)",
    "Interview Problems (Part-3)",
  ],
};

export default function PracticePage() {
  const { isAuthenticated } = useAuth();
  const { addPoints } = usePlannerStore();
  const solveMutation = useSolveQuestion();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedPattern, setSelectedPattern] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Debounced search query for smooth typing
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Practice Problems from database
  const {
    data: practiceData,
    isLoading,
    isError,
    error,
    refetch,
  } = usePracticeProblems({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    subject: selectedSubject,
    topic: selectedPattern,
    difficulty: selectedDifficulty,
    status: selectedStatus,
  });

  // Fetch subjects & topic metadata for dynamic filters
  const { data: roadmapSubjects } = useRoadmapSubjects();
  const { data: subjectDetail } = useRoadmapSubjectDetail(
    selectedSubject !== "all" ? selectedSubject : "",
  );

  // Active Problem Note Modal State
  const [activeProblem, setActiveProblem] = useState<PracticeProblemDto | null>(
    null,
  );
  const [userNotes, setUserNotes] = useState<string>("");

  // Solved & Total Counts
  const problems = practiceData?.problems || [];
  const pagination = practiceData?.pagination || {
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
    hasMore: false,
  };
  const stats = practiceData?.stats || {
    totalProblems: 847,
    totalSolved: 0,
    totalDue: 0,
  };

  // Generate dynamic pattern options from roadmap topics
  const availablePatterns = useMemo(() => {
    const patterns = new Set<string>();

    if (selectedSubject !== "all") {
      const staticTopics = CURRICULUM_TOPICS[selectedSubject];
      if (staticTopics) {
        staticTopics.forEach((t) => patterns.add(t));
      }
      if (subjectDetail?.topics) {
        subjectDetail.topics.forEach((t) => {
          patterns.add(t.name);
          if (t.subtopics) {
            t.subtopics.forEach((st) => patterns.add(st.name));
          }
        });
      }
    } else {
      Object.values(CURRICULUM_TOPICS).forEach((topicList) => {
        topicList.forEach((t) => patterns.add(t));
      });
    }

    problems.forEach((p) => {
      if (p.topic) patterns.add(p.topic);
      if (p.subtopic) patterns.add(p.subtopic);
    });

    return Array.from(patterns);
  }, [selectedSubject, subjectDetail, problems]);

  // Open note modal for a problem
  const handleOpenProblem = (problem: PracticeProblemDto) => {
    setActiveProblem(problem);
    setUserNotes(problem.progress?.notes || "");
  };

  // Save notes & update problem progress
  const handleSaveProblemNotes = async (markAsSolved: boolean) => {
    if (!activeProblem) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to record question progress.");
      return;
    }

    try {
      const result = await solveMutation.mutateAsync({
        itemId: activeProblem.itemId,
        isCorrect: markAsSolved,
        notes: userNotes,
      });

      if (markAsSolved && !activeProblem.solved) {
        addPoints(15);
        toast.success(`🎉 Problem solved! Notes saved (+15 pts!)`);
      } else if (!markAsSolved && activeProblem.solved) {
        toast.info("Problem marked as unsolved.");
      } else {
        toast.success("Notes saved successfully!");
      }
      setActiveProblem(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save question notes");
    }
  };

  // Pick Random Problem
  const handleRandomProblem = () => {
    if (problems.length === 0) {
      toast.error("No problems available to select.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * problems.length);
    const randomProb = problems[randomIndex];
    handleOpenProblem(randomProb);
    toast.success(`🎯 Selected: ${randomProb.title}`);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedSubject("all");
    setSelectedDifficulty("all");
    setSelectedPattern("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  // Subject Display Helpers
  const getSubjectDisplayName = (slug?: string, name?: string) => {
    const s = (slug || "").toLowerCase();
    if (s === "dsa") return "DSA";
    if (s === "dbms") return "DBMS";
    if (s === "operating-systems" || s === "os") return "OS";
    if (s === "computer-networks" || s === "cn") return "CN";
    if (s === "oops") return "OOPs";
    if (s === "lld") return "LLD";
    return name || slug || "DSA";
  };

  const getSubjectBadge = (slug?: string, name?: string) => {
    const s = (slug || "").toLowerCase();
    if (s === "dsa")
      return (
        <Badge variant="blue" className="font-medium text-[11px] py-0 px-1.5">
          DSA
        </Badge>
      );
    if (s === "dbms")
      return (
        <Badge
          variant="success"
          className="font-medium text-[11px] py-0 px-1.5"
        >
          DBMS
        </Badge>
      );
    if (s === "operating-systems" || s === "os")
      return (
        <Badge variant="purple" className="font-medium text-[11px] py-0 px-1.5">
          OS
        </Badge>
      );
    if (s === "computer-networks" || s === "cn")
      return (
        <Badge
          variant="warning"
          className="font-medium text-[11px] py-0 px-1.5"
        >
          CN
        </Badge>
      );
    if (s === "oops")
      return (
        <Badge
          variant="success"
          className="font-medium text-[11px] py-0 px-1.5"
        >
          OOPs
        </Badge>
      );
    return (
      <Badge variant="cyan" className="font-medium text-[11px] py-0 px-1.5">
        {name || "LLD"}
      </Badge>
    );
  };

  // Difficulty Badge: Only Easy, Medium, Hard
  const getDifficultyBadge = (diff: string) => {
    const d = (diff || "Medium").toLowerCase();
    if (d.includes("basic") || d.includes("easy")) {
      return (
        <Badge variant="success" className="font-medium text-[11px] py-0 px-2">
          Easy
        </Badge>
      );
    }
    if (d.includes("pro") || d.includes("hard")) {
      return (
        <Badge
          variant="destructive"
          className="font-medium text-[11px] py-0 px-2"
        >
          Hard
        </Badge>
      );
    }
    return (
      <Badge variant="warning" className="font-medium text-[11px] py-0 px-2">
        Medium
      </Badge>
    );
  };

  // Last Solved Date Formatter (compact, e.g. "27 Sep")
  const formatLastSolved = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  // Revision Timing Formatter (Only timing: Tomorrow, 30 Sep, Today, or —)
  const getRevisionBadge = (problem: PracticeProblemDto) => {
    if (!problem.solved && !problem.lastSolvedAt) {
      return <span className="text-zinc-600 font-mono text-[11px]">—</span>;
    }

    if (problem.userStatus === "due" || problem.isDue) {
      return (
        <span className="inline-flex items-center rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 font-mono">
          Today
        </span>
      );
    }

    if (!problem.nextRevisionAt) {
      return <span className="text-zinc-600 font-mono text-[11px]">—</span>;
    }

    const revDate = new Date(problem.nextRevisionAt);
    if (isNaN(revDate.getTime())) {
      return <span className="text-zinc-600 font-mono text-[11px]">—</span>;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(
      revDate.getFullYear(),
      revDate.getMonth(),
      revDate.getDate(),
    );
    const diffDays = Math.round(
      (targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays <= 0) {
      return (
        <span className="inline-flex items-center rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 font-mono">
          Today
        </span>
      );
    }

    if (diffDays === 1) {
      return (
        <span className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 font-mono">
          Tomorrow
        </span>
      );
    }

    const formattedDate = revDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    return (
      <span className="inline-flex items-center rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 font-mono">
        {formattedDate}
      </span>
    );
  };

  const isFilterActive =
    selectedSubject !== "all" ||
    selectedDifficulty !== "all" ||
    selectedPattern !== "all" ||
    selectedStatus !== "all" ||
    Boolean(searchQuery);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* ========================================================================= */}
      {/* 1. HEADER SECTION */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Practice Problems</span>
            <Badge
              variant="blue"
              className="text-[10px] font-medium py-0 px-1.5 font-mono"
            >
              {stats.totalProblems} Curated Qs
            </Badge>
          </h1>
          <p className="text-[12px] font-normal text-zinc-400 leading-normal">
            Master pattern-based algorithms, system design questions, and core
            subject problems from the real curriculum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRandomProblem}
            className="h-8 px-3 text-[12px] font-medium border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200"
          >
            <Shuffle className="h-3.5 w-3.5 mr-1 text-blue-400" />
            <span>Random Problem</span>
          </Button>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-1.5 text-[12px] flex items-center gap-1.5 shadow-subtle">
            <span className="text-zinc-400 font-normal">Solved:</span>
            <strong className="text-zinc-100 font-semibold font-mono text-[12px]">
              {stats.totalSolved} / {stats.totalProblems}
            </strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & ADVANCED FILTER BAR */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-3 shadow-subtle">
        {/* Search Bar - Compact */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by problem title, topic (Arrays, Two Pointers, Indexing, Sockets)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 rounded-lg border border-zinc-800 bg-zinc-950/80 pl-8 pr-7 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 text-[12px]">
          {/* Subject Track Filter */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-zinc-500 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Track:
            </span>
            {[
              { label: "All", val: "all" },
              { label: "DSA", val: "dsa" },
              { label: "DBMS", val: "dbms" },
              { label: "OS", val: "operating-systems" },
              { label: "CN", val: "computer-networks" },
              { label: "OOPs", val: "oops" },
              { label: "LLD", val: "lld" },
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                onClick={() => {
                  setSelectedSubject(f.val);
                  setSelectedPattern("all");
                  setCurrentPage(1);
                }}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                  selectedSubject === f.val
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Selectors: Pattern, Level, Status & Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Pattern Selector */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[11px]">Pattern:</span>
              <select
                value={selectedPattern}
                onChange={(e) => {
                  setSelectedPattern(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Patterns</option>
                {availablePatterns.map((p) => (
                  <option key={p} value={p.toLowerCase()}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[11px]">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="basic">Easy</option>
                <option value="core">Medium</option>
                <option value="pro">Hard</option>
              </select>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[11px]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="unsolved">Not Solved</option>
                <option value="solved">Solved</option>
                <option value="due">Revision Due</option>
                <option value="upcoming">Upcoming Revision</option>
                <option value="bookmarked">Bookmarked</option>
              </select>
            </div>

            {/* Reset Button */}
            {isFilterActive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors flex items-center gap-1 ml-0.5"
              >
                <RotateCcw className="h-3 w-3 text-zinc-400" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROBLEM LIST TABLE */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-2.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider items-center">
          <div className="col-span-7 sm:col-span-5">Problem</div>
          <div className="col-span-3 hidden sm:block">Subject</div>
          <div className="col-span-2 text-center">Difficulty</div>
          <div className="col-span-1 hidden sm:block text-center">Revision</div>
          <div className="col-span-3 sm:col-span-1 text-right pr-2">Action</div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="divide-y divide-zinc-800/40 p-2 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-3"
              >
                <Skeleton className="h-4 w-64 bg-zinc-800 rounded" />
                <Skeleton className="h-4 w-32 bg-zinc-800 rounded hidden sm:block" />
                <Skeleton className="h-4 w-16 bg-zinc-800 rounded" />
                <Skeleton className="h-4 w-16 bg-zinc-800 rounded hidden sm:block" />
                <Skeleton className="h-6 w-14 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="py-12 text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
            <p className="text-[13px] font-medium text-zinc-200">
              Failed to load problems
            </p>
            <p className="text-[11px] text-zinc-500">
              {error instanceof Error
                ? error.message
                : "Error connecting to the database."}
            </p>
            <Button
              size="sm"
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] h-7 mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </div>
        ) : problems.length > 0 ? (
          /* Problem Rows */
          <div className="divide-y divide-zinc-800/40">
            {problems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handleOpenProblem(problem)}
                className="grid grid-cols-12 gap-3 items-center px-4 py-3 text-[13px] transition-colors hover:bg-zinc-900/80 cursor-pointer group"
              >
                {/* 1. Problem Column with checkmark directly beside title */}
                <div className="col-span-7 sm:col-span-5 flex items-center gap-2 overflow-hidden pr-2">
                  {problem.solved ? (
                    <Check className="h-4 w-4 text-emerald-400 stroke-[2.5] shrink-0" />
                  ) : (
                    <div className="h-4 w-4 shrink-0" />
                  )}
                  <span className="font-medium text-zinc-100 text-[13px] leading-snug group-hover:text-blue-400 transition-colors truncate">
                    {problem.title}
                  </span>
                </div>

                {/* 2. Subject · Topic Column */}
                <div className="col-span-3 hidden sm:flex flex-col justify-center min-w-0">
                  <span className="text-[12px] font-medium text-zinc-200 leading-tight">
                    {getSubjectDisplayName(
                      problem.subjectSlug,
                      problem.subject,
                    )}
                  </span>
                  <span className="text-[11px] text-zinc-500 truncate leading-tight mt-0.5">
                    {problem.topic || problem.subtopic || "Core"}
                  </span>
                </div>

                {/* 3. Difficulty Column (Easy / Medium / Hard only) */}
                <div className="col-span-2 flex justify-center">
                  {getDifficultyBadge(problem.difficulty)}
                </div>

                {/* 4. Revision Column (Only timing: Tomorrow, 30 Sep, Today, or —) */}
                <div className="col-span-1 hidden sm:flex justify-center items-center">
                  {getRevisionBadge(problem)}
                </div>

                {/* 5. Action Column */}
                <div className="col-span-3 sm:col-span-1 flex items-center justify-end pr-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProblem(problem);
                    }}
                    className="h-6 px-2.5 text-[11px] font-medium border-zinc-800 bg-zinc-900 group-hover:border-blue-500/40 group-hover:text-blue-400"
                  >
                    <span>Solve</span>
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-12 text-center space-y-2">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
              <FileText className="h-4 w-4" />
            </div>
            <p className="text-[12px] font-medium text-zinc-300">
              No matching problems found
            </p>
            <p className="text-[11px] text-zinc-500">
              Try clearing active filters or searching a different term.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearFilters}
              className="text-[11px] h-7 border-zinc-800 bg-zinc-900 text-zinc-300 mt-1"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGINATION FOOTER */}
        {/* ========================================================================= */}
        {!isLoading && pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800/80 bg-zinc-950/60 px-4 py-3 text-[12px] text-zinc-400 font-mono">
            <div>
              Showing{" "}
              {Math.min(
                (pagination.page - 1) * pagination.limit + 1,
                pagination.total,
              )}{" "}
              – {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} problems
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2.5 text-[11px] font-mono border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
              </Button>

              <span className="text-[11px] text-zinc-300 px-1 font-mono">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage >= pagination.totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                className="h-7 px-2.5 text-[11px] font-mono border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. COMPACT NOTE POPOUT / MODAL */}
      {/* ========================================================================= */}
      {activeProblem && (
        <Dialog
          open={!!activeProblem}
          onOpenChange={(open) => !open && setActiveProblem(null)}
        >
          <DialogContent className="max-w-md border-zinc-800 bg-zinc-950 text-zinc-100 p-5 shadow-2xl">
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                {getSubjectBadge(
                  activeProblem.subjectSlug,
                  activeProblem.subject,
                )}
                {getDifficultyBadge(activeProblem.difficulty)}
              </div>
              <DialogTitle className="text-[15px] font-semibold text-zinc-100 leading-snug">
                {activeProblem.title}
              </DialogTitle>
              <DialogDescription className="text-[12px] text-zinc-400">
                Topic:{" "}
                <strong className="text-zinc-300 font-medium">
                  {activeProblem.topic || "Core"}
                </strong>
                {activeProblem.subtopic ? ` · ${activeProblem.subtopic}` : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              {/* Quick Status Bar */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-3 py-2 text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Status:</span>
                  {activeProblem.solved ? (
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3 stroke-[2.5]" /> Solved
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-normal">
                      Not Solved
                    </span>
                  )}
                </div>
                {activeProblem.lastSolvedAt && (
                  <div className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-zinc-500" />
                    <span>
                      Last: {formatLastSolved(activeProblem.lastSolvedAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Simple Notes Area */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-zinc-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-400" />
                  <span>Problem Notes &amp; Insights</span>
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Add your optimal approach, time/space complexity, or edge cases to remember..."
                  rows={4}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 p-2.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/80 focus:outline-none focus:ring-1 focus:ring-blue-500/40 font-normal resize-none"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-row items-center justify-between sm:justify-between gap-2 pt-1 border-t border-zinc-800/80 mt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveProblem(null)}
                className="h-8 px-3 text-[12px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                {activeProblem.solved ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveProblemNotes(false)}
                      disabled={solveMutation.isPending}
                      className="h-8 px-2.5 text-[11px] text-zinc-400 border-zinc-800 hover:text-rose-400 hover:border-rose-500/30"
                    >
                      Unmark Solved
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSaveProblemNotes(true)}
                      disabled={solveMutation.isPending}
                      className="h-8 px-3 text-[12px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      {solveMutation.isPending ? "Saving..." : "Save Notes"}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleSaveProblemNotes(true)}
                    disabled={solveMutation.isPending}
                    className="h-8 px-3 text-[12px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    {solveMutation.isPending
                      ? "Saving..."
                      : "Mark Solved & Save"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
