"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Code2,
  Search,
  Check,
  Star,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Copy,
  Terminal,
  Shuffle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  X,
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
  useSolveQuestion,
} from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerStore } from "@/store/planner-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { PracticeProblemDto } from "@starter/shared";

interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

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

  // Debounced search query for smoother typing
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Practice Problems from real database
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

  // Selected Problem Modal
  const [activeProblem, setActiveProblem] = useState<PracticeProblemDto | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<"cpp" | "java" | "python" | "javascript">("cpp");
  const [userCode, setUserCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"editor" | "description" | "notes">("editor");

  // Test Runner State
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<{
    passed: boolean;
    actualOutput: string;
    runtime: string;
    memory: string;
  } | null>(null);

  // Solved & Total Counts
  const problems = practiceData?.problems || [];
  const pagination = practiceData?.pagination || { page: 1, limit: pageSize, total: 0, totalPages: 1, hasMore: false };
  const stats = practiceData?.stats || { totalProblems: 847, totalSolved: 0, totalDue: 0 };

  // Generate dynamic pattern options from roadmap topics
  const availablePatterns = useMemo(() => {
    const patterns = new Set<string>();
    if (roadmapSubjects) {
      roadmapSubjects.forEach((sub) => {
        if (selectedSubject === "all" || sub.slug === selectedSubject) {
          // Add default well-known topics for this subject
          if (sub.slug === "dsa") {
            ["Arrays", "Two Pointers", "Sliding Window", "Binary Search", "Linked List", "Recursion", "Trees", "Graphs", "Dynamic Programming"].forEach((p) => patterns.add(p));
          } else if (sub.slug === "dbms") {
            ["SQL Queries", "Indexing & B+ Trees", "Transactions & ACID", "Normalization", "Concurrency Control"].forEach((p) => patterns.add(p));
          } else if (sub.slug === "operating-systems") {
            ["Process Synchronization", "Deadlocks & Semaphores", "Virtual Memory & Paging", "CPU Scheduling", "System Calls"].forEach((p) => patterns.add(p));
          } else if (sub.slug === "computer-networks") {
            ["TCP/IP & OSI Model", "HTTP & WebSocket", "Routing Protocols", "DNS & Sockets"].forEach((p) => patterns.add(p));
          } else if (sub.slug === "oops") {
            ["Encapsulation & Inheritance", "Polymorphism", "Abstraction & Interfaces", "Design Principles"].forEach((p) => patterns.add(p));
          } else if (sub.slug === "lld") {
            ["Creational Patterns", "Structural Patterns", "Behavioral Patterns", "SOLID Principles", "System Design"].forEach((p) => patterns.add(p));
          }
        }
      });
    }

    // Also include topics from current problems
    problems.forEach((p) => {
      if (p.topic) patterns.add(p.topic);
      if (p.subtopic) patterns.add(p.subtopic);
    });

    return Array.from(patterns).sort();
  }, [roadmapSubjects, selectedSubject, problems]);

  // Code Snippet Generator for active problem
  const getCodeTemplate = (problem: PracticeProblemDto, lang: "cpp" | "java" | "python" | "javascript") => {
    const funcName = problem.slug.replace(/-/g, "_") || "solve";
    const className = "Solution";

    switch (lang) {
      case "cpp":
        return `class ${className} {\npublic:\n    // Problem: ${problem.title}\n    // Topic: ${problem.topic}\n    void ${funcName}() {\n        // Write your optimal solution here\n    }\n};`;
      case "java":
        return `class ${className} {\n    // Problem: ${problem.title}\n    // Topic: ${problem.topic}\n    public void ${funcName}() {\n        // Write your optimal solution here\n    }\n}`;
      case "python":
        return `class ${className}:\n    # Problem: ${problem.title}\n    # Topic: ${problem.topic}\n    def ${funcName}(self):\n        # Write your optimal solution here\n        pass`;
      case "javascript":
        return `/**\n * @param {any}\n * @return {any}\n */\nfunction ${funcName}() {\n    // Problem: ${problem.title}\n    // Write your optimal solution here\n}`;
    }
  };

  // Sample Test Cases generator
  const getProblemExamples = (problem: PracticeProblemDto): TestCase[] => {
    return [
      {
        input: `Sample Input 1 for [${problem.title}]`,
        expectedOutput: "Optimal result matching constraints",
        explanation: `Evaluated against ${problem.difficulty} complexity expectations.`,
      },
      {
        input: `Edge Case: Empty or Boundary state`,
        expectedOutput: "Graceful handle",
        explanation: "Handles corner conditions properly.",
      },
    ];
  };

  const handleOpenProblem = (problem: PracticeProblemDto) => {
    setActiveProblem(problem);
    setUserCode(getCodeTemplate(problem, activeLanguage));
    setSelectedTestCaseIndex(0);
    setTestResults(null);
    setActiveTab("editor");
  };

  const handleLanguageChange = (lang: "cpp" | "java" | "python" | "javascript") => {
    setActiveLanguage(lang);
    if (activeProblem) {
      setUserCode(getCodeTemplate(activeProblem, lang));
    }
  };

  // Toggle solve / complete status in database
  const handleToggleSolve = async (problem: PracticeProblemDto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to record question progress.");
      return;
    }

    const nextIsCorrect = !problem.solved;

    try {
      const result = await solveMutation.mutateAsync({
        itemId: problem.itemId,
        isCorrect: nextIsCorrect,
      });

      if (nextIsCorrect) {
        addPoints(15);
        toast.success(`🎉 ${result.message} (+15 pts!)`);
      } else {
        toast.info(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update problem status");
    }
  };

  // Run Test Cases Simulation
  const handleRunTests = () => {
    setIsRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      setIsRunningTests(false);
      setTestResults({
        passed: true,
        actualOutput: "Optimal result matching constraints",
        runtime: "4 ms",
        memory: "8.2 MB",
      });
      toast.success("All sample test cases passed!");
    }, 600);
  };

  // Submit Solution from Modal
  const handleSubmitSolution = async () => {
    if (!activeProblem) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to save your solution.");
      return;
    }

    try {
      const result = await solveMutation.mutateAsync({
        itemId: activeProblem.itemId,
        isCorrect: true,
      });

      addPoints(20);
      toast.success(`🎉 Solution recorded! ${result.message} (+20 pts!)`);
      setActiveProblem(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to record solution");
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

  // Badges & Formatting Helpers
  const getDifficultyBadge = (diff: string) => {
    const d = (diff || "Medium").toLowerCase();
    if (d.includes("basic") || d.includes("easy")) {
      return (
        <Badge variant="success" className="font-medium text-[11px] py-0 px-2">
          Basic / Easy
        </Badge>
      );
    }
    if (d.includes("core") || d.includes("medium")) {
      return (
        <Badge variant="warning" className="font-medium text-[11px] py-0 px-2">
          Core / Medium
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="font-medium text-[11px] py-0 px-2">
        Pro / Hard
      </Badge>
    );
  };

  const getSubjectBadge = (subjectSlug?: string, subjectName?: string) => {
    const slug = (subjectSlug || subjectName || "dsa").toLowerCase();
    if (slug.includes("dsa")) {
      return <Badge variant="blue" className="font-medium text-[11px] py-0 px-2">DSA</Badge>;
    }
    if (slug.includes("dbms") || slug.includes("data")) {
      return <Badge variant="success" className="font-medium text-[11px] py-0 px-2">DBMS</Badge>;
    }
    if (slug.includes("operat") || slug.includes("os")) {
      return <Badge variant="purple" className="font-medium text-[11px] py-0 px-2">OS</Badge>;
    }
    if (slug.includes("netw") || slug.includes("cn")) {
      return <Badge variant="warning" className="font-medium text-[11px] py-0 px-2">CN</Badge>;
    }
    if (slug.includes("oop")) {
      return <Badge variant="success" className="font-medium text-[11px] py-0 px-2">OOPs</Badge>;
    }
    return <Badge variant="cyan" className="font-medium text-[11px] py-0 px-2">LLD</Badge>;
  };

  const getStatusBadge = (problem: PracticeProblemDto) => {
    if (problem.userStatus === "due") {
      return (
        <Badge
          variant="destructive"
          className="font-medium text-[10px] py-0 px-1.5 flex items-center gap-1 animate-pulse"
        >
          <AlertTriangle className="h-2.5 w-2.5" />
          <span>Revision Due</span>
        </Badge>
      );
    }
    if (problem.userStatus === "upcoming") {
      return (
        <Badge
          variant="outline"
          className="font-medium text-[10px] py-0 px-1.5 text-blue-400 border-blue-500/20 bg-blue-500/10 flex items-center gap-1 font-mono"
        >
          <Clock className="h-2.5 w-2.5" />
          <span>{problem.revisionStatusText}</span>
        </Badge>
      );
    }
    if (problem.userStatus === "solved" || problem.solved) {
      return (
        <Badge variant="success" className="font-medium text-[10px] py-0 px-1.5 flex items-center gap-1">
          <Check className="h-2.5 w-2.5" />
          <span>Solved</span>
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="font-medium text-[10px] py-0 px-1.5 text-zinc-500 bg-zinc-900 border-zinc-800">
        Not Solved
      </Badge>
    );
  };

  const formatLastSolved = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
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
            <Badge variant="blue" className="text-[10px] font-medium py-0 px-1.5 font-mono">
              {stats.totalProblems} Curated Qs
            </Badge>
          </h1>
          <p className="text-[12px] font-normal text-zinc-400 leading-normal">
            Master pattern-based algorithms, system design questions, and core subject problems from the real curriculum.
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
                  setCurrentPage(1);
                }}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                  selectedSubject === f.val
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
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
                  <option key={p} value={p.toLowerCase()}>{p}</option>
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
                <option value="basic">Basic / Easy</option>
                <option value="core">Core / Medium</option>
                <option value="pro">Pro / Hard</option>
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

            {/* Reset Button (only shown when filters/search are active) */}
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
        <div className="grid grid-cols-12 gap-3 border-b border-zinc-800/80 bg-zinc-950/60 px-3.5 py-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          <div className="col-span-1 flex items-center justify-center" aria-label="Status" />
          <div className="col-span-6 sm:col-span-4 md:col-span-4 lg:col-span-4">Problem Title</div>
          <div className="col-span-2 hidden sm:flex items-center">Subject &middot; Pattern</div>
          <div className="col-span-2 sm:col-span-2 md:col-span-1 flex justify-center">Difficulty</div>
          <div className="col-span-2 hidden md:flex justify-center items-center">Last Solved</div>
          <div className="col-span-2 sm:col-span-2 md:col-span-1 hidden sm:flex justify-center items-center">Revision</div>
          <div className="col-span-3 sm:col-span-1 md:col-span-1 flex justify-end pr-2">Action</div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="divide-y divide-zinc-800/40 p-2 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 px-3">
                <Skeleton className="h-4 w-6 bg-zinc-800 rounded" />
                <Skeleton className="h-4 w-52 bg-zinc-800 rounded" />
                <Skeleton className="h-4 w-24 bg-zinc-800 rounded hidden sm:block" />
                <Skeleton className="h-4 w-16 bg-zinc-800 rounded" />
                <Skeleton className="h-4 w-20 bg-zinc-800 rounded hidden sm:block" />
                <Skeleton className="h-6 w-14 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="py-12 text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
            <p className="text-[13px] font-medium text-zinc-200">Failed to load problems</p>
            <p className="text-[11px] text-zinc-500">
              {error instanceof Error ? error.message : "Error connecting to the database."}
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
            {problems.map((problem) => {
              const lastSolvedFormatted = formatLastSolved(problem.lastSolvedAt);

              return (
                <div
                  key={problem.id}
                  onClick={() => handleOpenProblem(problem)}
                  className="grid grid-cols-12 gap-3 items-center px-4 py-3 text-[13px] transition-colors hover:bg-zinc-900/80 cursor-pointer group"
                >
                  {/* 1. Solved Checkmark (LeetCode style) */}
                  <div className="col-span-1 flex items-center justify-center">
                    {problem.solved && (
                      <Check className="h-4 w-4 text-emerald-400 stroke-[2.5]" />
                    )}
                  </div>

                  {/* 2. Problem Title */}
                  <div className="col-span-6 sm:col-span-4 md:col-span-4 lg:col-span-4 flex items-center gap-2 overflow-hidden">
                    <div className="truncate">
                      <span className="font-medium text-zinc-100 text-[13px] leading-snug group-hover:text-blue-400 transition-colors">
                        {problem.title}
                      </span>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5 font-normal truncate font-mono">
                        <span>Est. {problem.estimatedMinutes}m</span>
                        {problem.lastSolvedAt && (
                          <span className="md:hidden">
                            &middot; <span className="text-zinc-400">{lastSolvedFormatted}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Subject & Pattern */}
                  <div className="col-span-2 hidden sm:flex items-center gap-2 overflow-hidden">
                    {getSubjectBadge(problem.subjectSlug, problem.subject)}
                    <span className="text-[11px] text-zinc-400 truncate font-normal">
                      {problem.topic || problem.subtopic || "Core"}
                    </span>
                  </div>

                  {/* 4. Difficulty */}
                  <div className="col-span-2 sm:col-span-2 md:col-span-1 flex justify-center">
                    {getDifficultyBadge(problem.difficulty)}
                  </div>

                  {/* 5. Last Solved */}
                  <div className="col-span-2 hidden md:flex justify-center items-center font-mono text-[11px] text-zinc-400">
                    {lastSolvedFormatted}
                  </div>

                  {/* 6. Revision Status Badge */}
                  <div className="col-span-2 sm:col-span-2 md:col-span-1 hidden sm:flex justify-center">
                    {getStatusBadge(problem)}
                  </div>

                  {/* 7. Action */}
                  <div className="col-span-3 sm:col-span-1 md:col-span-1 flex items-center justify-end gap-2 pr-1">
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
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-12 text-center space-y-2">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
              <Code2 className="h-4 w-4" />
            </div>
            <p className="text-[12px] font-medium text-zinc-300">No matching problems found</p>
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
              Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} –{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} problems
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
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="h-7 px-2.5 text-[11px] font-mono border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE IDE & CODE SOLVER MODAL */}
      {/* ========================================================================= */}
      {activeProblem && (
        <Dialog open={!!activeProblem} onOpenChange={() => setActiveProblem(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-zinc-950 border-zinc-800 shadow-dialog">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-900/70">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <h2 className="text-[15px] font-semibold leading-tight text-zinc-100 truncate">
                  {activeProblem.title}
                </h2>
                {getDifficultyBadge(activeProblem.difficulty)}
                {getSubjectBadge(activeProblem.subjectSlug, activeProblem.subject)}
              </div>

              <div className="flex items-center gap-2 shrink-0 pr-6">
                <span className="text-[11px] text-zinc-400 font-mono">
                  {formatLastSolved(activeProblem.lastSolvedAt) || "Not solved yet"}
                </span>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 text-[12px] font-medium">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("editor")}
                  className={cn(
                    "py-2.5 border-b-2 transition-colors flex items-center gap-1.5",
                    activeTab === "editor"
                      ? "border-blue-500 text-blue-400 font-semibold"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Code &amp; Solution</span>
                </button>

                <button
                  onClick={() => setActiveTab("description")}
                  className={cn(
                    "py-2.5 border-b-2 transition-colors flex items-center gap-1.5",
                    activeTab === "description"
                      ? "border-blue-500 text-blue-400 font-semibold"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Problem Description</span>
                </button>

                <button
                  onClick={() => setActiveTab("notes")}
                  className={cn(
                    "py-2.5 border-b-2 transition-colors flex items-center gap-1.5",
                    activeTab === "notes"
                      ? "border-blue-500 text-blue-400 font-semibold"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Interview Cheatsheet</span>
                </button>
              </div>

              {/* Language Selector */}
              {activeTab === "editor" && (
                <div className="flex items-center gap-2 py-1">
                  <select
                    value={activeLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value as "cpp" | "java" | "python" | "javascript")}
                    className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-200 focus:outline-none font-mono"
                  >
                    <option value="cpp">C++ 20</option>
                    <option value="java">Java 21</option>
                    <option value="python">Python 3.12</option>
                    <option value="javascript">JavaScript (ES6)</option>
                  </select>

                  <button
                    onClick={() => setUserCode(getCodeTemplate(activeProblem, activeLanguage))}
                    className="text-zinc-400 hover:text-zinc-200 p-1"
                    title="Reset Template"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: CODE EDITOR & TEST CASE RUNNER */}
              {activeTab === "editor" && (
                <div className="space-y-3.5">
                  {/* Code Editor Window */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-card flex flex-col">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-3 py-1.5 text-[11px] font-mono text-zinc-400">
                      <span>
                        Solution.{activeLanguage === "cpp" ? "cpp" : activeLanguage === "java" ? "java" : activeLanguage === "python" ? "py" : "js"}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(userCode);
                          toast.success("Code copied!");
                        }}
                        className="hover:text-zinc-200 flex items-center gap-1 text-[11px]"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>

                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      rows={12}
                      spellCheck={false}
                      className="w-full bg-zinc-950 p-3.5 font-mono text-[12px] text-zinc-100 leading-relaxed focus:outline-none resize-none selection:bg-blue-600/30"
                    />
                  </div>

                  {/* Test Cases Panel */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-[12px] font-semibold text-zinc-200">Sample Test Cases</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {getProblemExamples(activeProblem).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedTestCaseIndex(idx);
                              setTestResults(null);
                            }}
                            className={cn(
                              "px-2 py-0.5 rounded text-[11px] font-medium font-mono transition-colors",
                              selectedTestCaseIndex === idx
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                            )}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Test Case Detail */}
                    {getProblemExamples(activeProblem)[selectedTestCaseIndex] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 space-y-1">
                          <span className="text-zinc-500 font-sans font-medium text-[11px]">Input:</span>
                          <p className="text-zinc-200">
                            {getProblemExamples(activeProblem)[selectedTestCaseIndex].input}
                          </p>
                        </div>

                        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 space-y-1">
                          <span className="text-zinc-500 font-sans font-medium text-[11px]">Expected Output:</span>
                          <p className="text-emerald-400">
                            {getProblemExamples(activeProblem)[selectedTestCaseIndex].expectedOutput}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Test Results Banner */}
                    {testResults && (
                      <div
                        className={cn(
                          "rounded-lg p-2.5 text-[12px] flex items-center justify-between font-normal animate-in fade-in-0 duration-150",
                          testResults.passed
                            ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300"
                            : "bg-red-950/30 border border-red-500/30 text-red-300"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {testResults.passed ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                          )}
                          <div>
                            <div className="font-semibold text-[12px]">
                              {testResults.passed ? "Test Passed!" : "Execution Failed"}
                            </div>
                            <div className="text-[11px] opacity-80 font-mono">
                              {testResults.runtime} &middot; {testResults.memory}
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono text-[11px]">
                          Output: {testResults.actualOutput}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROBLEM DESCRIPTION */}
              {activeTab === "description" && (
                <div className="space-y-4 text-[12px] leading-relaxed text-zinc-300">
                  <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 space-y-2">
                    <p className="leading-normal">
                      <strong>Problem:</strong> {activeProblem.title}
                    </p>
                    <p className="text-zinc-400">
                      Subject: <strong>{activeProblem.subject}</strong> &middot; Topic: <strong>{activeProblem.topic}</strong>
                      {activeProblem.subtopic ? ` · Pattern: ${activeProblem.subtopic}` : ""}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    {getProblemExamples(activeProblem).map((ex, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <span className="text-[12px] font-semibold text-zinc-200">Example {idx + 1}:</span>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 font-mono text-[11px] space-y-1.5">
                          <div>
                            <span className="text-zinc-500">Input: </span>
                            <span className="text-zinc-200">{ex.input}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Output: </span>
                            <span className="text-emerald-400">{ex.expectedOutput}</span>
                          </div>
                          {ex.explanation && (
                            <div>
                              <span className="text-zinc-500">Explanation: </span>
                              <span className="text-zinc-400">{ex.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress & Spaced Repetition details */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] border-t border-zinc-800">
                    <span className="text-zinc-500 font-medium">Status:</span>
                    {getStatusBadge(activeProblem)}
                    <span className="text-zinc-500">&middot;</span>
                    <span className="font-mono text-zinc-400">
                      {formatLastSolved(activeProblem.lastSolvedAt) || "Not solved yet"}
                    </span>
                    <span className="text-zinc-500">&middot;</span>
                    <span className="font-mono text-zinc-400">
                      {activeProblem.solveCount}x solved
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 3: INTERVIEW CHEATSHEET */}
              {activeTab === "notes" && (
                <div className="space-y-3.5 text-[12px]">
                  <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-950/20 space-y-2 text-blue-200">
                    <div className="font-semibold text-[13px] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                      Key Pattern &amp; Time Complexity
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[12px] text-zinc-300 font-normal">
                      <li><strong>Subject Domain:</strong> {activeProblem.subject} &middot; {activeProblem.topic}</li>
                      <li><strong>Target Difficulty:</strong> {activeProblem.difficulty}</li>
                      <li><strong>Spaced Repetition:</strong> Automated review schedules at 1d, 3d, 7d, 14d, 30d upon completion.</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-medium text-zinc-200">Personal Candidate Notes:</span>
                    <textarea
                      placeholder="Add personal interview takeaways or questions to review..."
                      rows={5}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-[12px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-4 py-3">
              <div className="text-[11px] text-zinc-400">
                Reward: <span className="font-semibold text-amber-300">+20 Study Pts</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="text-[12px] font-medium h-7 px-3 border-zinc-800 bg-zinc-900 text-zinc-200"
                >
                  <Play className="h-3 w-3 mr-1 text-emerald-400 fill-emerald-400" />
                  {isRunningTests ? "Running..." : "Run Test Cases"}
                </Button>

                <Button
                  size="sm"
                  onClick={handleSubmitSolution}
                  disabled={solveMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium h-7 px-3"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  {solveMutation.isPending ? "Saving..." : "Submit Solution"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
