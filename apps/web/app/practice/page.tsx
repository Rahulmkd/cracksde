"use client";

import React, { useState, useMemo } from "react";
import {
  Code2,
  Search,
  Check,
  Star,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  FileCode,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useRevisionList } from "@/hooks/use-revision-list";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StudyTaskDto } from "@starter/shared";

interface ProblemItem {
  id: string;
  title: string;
  subject: string;
  subjectSlug: string;
  topic: string;
  difficulty: "Basic" | "Core" | "Pro";
  estimatedMinutes: number;
  solved: boolean;
  bookmarked: boolean;
  codeSnippet: string;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
}

export default function PracticePage() {
  const { plan, updateTask } = useStudyPlan("crack-sde");
  const { data: revisionListData } = useRevisionList();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "solved" | "unsolved" | "bookmarked">("all");

  // Selected Problem Modal
  const [activeProblem, setActiveProblem] = useState<ProblemItem | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<"cpp" | "java" | "python" | "javascript">("cpp");
  const [userCode, setUserCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "solution" | "notes">("description");

  // Local problem state for interactive solving
  const [localProblems, setLocalProblems] = useState<ProblemItem[]>([
    {
      id: "p1",
      title: "Two Sum & Pair Sum",
      subject: "DSA",
      subjectSlug: "dsa",
      topic: "Arrays & Hashing",
      difficulty: "Basic",
      estimatedMinutes: 15,
      solved: false,
      bookmarked: false,
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input would have exactly one solution.",
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
      ],
      codeSnippet: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int complement = target - nums[i];\n            if (seen.count(complement)) return {seen[complement], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`
    },
    {
      id: "p2",
      title: "Kadane's Algorithm (Max Subarray)",
      subject: "DSA",
      subjectSlug: "dsa",
      topic: "Arrays",
      difficulty: "Core",
      estimatedMinutes: 20,
      solved: false,
      bookmarked: true,
      description: "Given an integer array nums, find the subarray with the largest sum, and return its sum in O(n) linear time.",
      examples: [
        { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }
      ],
      codeSnippet: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int maxSum = nums[0], curSum = 0;\n        for (int x : nums) {\n            curSum = max(x, curSum + x);\n            maxSum = max(maxSum, curSum);\n        }\n        return maxSum;\n    }\n};`
    },
    {
      id: "p3",
      title: "LRU Cache Design",
      subject: "System Design",
      subjectSlug: "system-design",
      topic: "Low Level Design",
      difficulty: "Pro",
      estimatedMinutes: 45,
      solved: false,
      bookmarked: false,
      description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with get(key) and put(key, value) in O(1) time complexity.",
      examples: [
        { input: "LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); get(2);", output: "[null, null, null, 1, null, -1]" }
      ],
      codeSnippet: `class LRUCache {\n    // Doubly-linked list + Hash Map implementation\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`
    },
    {
      id: "p4",
      title: "B+ Tree Indexing & Query Cost",
      subject: "DBMS",
      subjectSlug: "dbms",
      topic: "Storage & Indexing",
      difficulty: "Core",
      estimatedMinutes: 25,
      solved: false,
      bookmarked: false,
      description: "Explain and compute disk I/O operations for clustered vs unclustered B+ Tree indexes for range scans and point queries.",
      examples: [
        { input: "Fanout = 100, Total Records = 1,000,000", output: "Tree Height = 3, Max Disk Block I/Os = 4" }
      ],
      codeSnippet: `-- SQL Query Plan Analysis\nEXPLAIN ANALYZE\nSELECT * FROM users WHERE age BETWEEN 20 AND 30 ORDER BY created_at;`
    },
    {
      id: "p5",
      title: "Deadlock Detection & Banker's Algorithm",
      subject: "Operating Systems",
      subjectSlug: "operating-systems",
      topic: "Deadlocks & Concurrency",
      difficulty: "Core",
      estimatedMinutes: 30,
      solved: false,
      bookmarked: false,
      description: "Evaluate system safety and detect whether resource allocation matrices lead to a safe state without deadlock cycles.",
      examples: [
        { input: "Allocation = [[0,1,0],[2,0,0]], Max = [[7,5,3],[3,2,2]], Available = [3,3,2]", output: "Safe Sequence: <P1, P0>" }
      ],
      codeSnippet: `// Resource Allocation Safety Check in C++\nbool isSafe(int processes[], int avail[], int max[][R], int allot[][R]) {\n    // Safety algorithm implementation\n    return true;\n}`
    },
    {
      id: "p6",
      title: "TCP 3-Way Handshake & Connection Teardown",
      subject: "Computer Networks",
      subjectSlug: "computer-networks",
      topic: "Transport Layer",
      difficulty: "Basic",
      estimatedMinutes: 20,
      solved: false,
      bookmarked: false,
      description: "Analyze SYN, SYN-ACK, ACK sequence numbers, TIME_WAIT socket states, and TCP reset flags during high throughput workloads.",
      examples: [
        { input: "Client ISN = 1000, Server ISN = 5000", output: "SYN(1000) -> SYN-ACK(5000, ACK 1001) -> ACK(1001, ACK 5001)" }
      ],
      codeSnippet: `# Python Socket Simulation\nimport socket\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.connect(('api.cracksde.internal', 443))`
    },
    {
      id: "p7",
      title: "Trapping Rain Water",
      subject: "DSA",
      subjectSlug: "dsa",
      topic: "Two Pointers",
      difficulty: "Pro",
      estimatedMinutes: 35,
      solved: false,
      bookmarked: true,
      description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      examples: [
        { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }
      ],
      codeSnippet: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        int left = 0, right = height.size() - 1;\n        int leftMax = 0, rightMax = 0, total = 0;\n        while (left < right) {\n            if (height[left] < height[right]) {\n                height[left] >= leftMax ? leftMax = height[left] : total += leftMax - height[left];\n                left++;\n            } else {\n                height[right] >= rightMax ? rightMax = height[right] : total += rightMax - height[right];\n                right--;\n            }\n        }\n        return total;\n    }\n};`
    },
    {
      id: "p8",
      title: "Longest Increasing Subsequence",
      subject: "DSA",
      subjectSlug: "dsa",
      topic: "Dynamic Programming",
      difficulty: "Core",
      estimatedMinutes: 25,
      solved: false,
      bookmarked: false,
      description: "Given an integer array nums, return the length of the longest strictly increasing subsequence in O(n log n) time.",
      examples: [
        { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2, 3, 7, 101]." }
      ],
      codeSnippet: `class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        vector<int> tails;\n        for (int x : nums) {\n            auto it = lower_bound(tails.begin(), tails.end(), x);\n            if (it == tails.end()) tails.push_back(x);\n            else *it = x;\n        }\n        return tails.size();\n    }\n};`
    }
  ]);

  // Filtered problems computation
  const filteredProblems = useMemo(() => {
    return localProblems.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSubject =
        selectedSubject === "all" ||
        p.subjectSlug === selectedSubject ||
        p.subject.toLowerCase() === selectedSubject.toLowerCase();

      const matchDifficulty =
        selectedDifficulty === "all" ||
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "solved" && p.solved) ||
        (selectedStatus === "unsolved" && !p.solved) ||
        (selectedStatus === "bookmarked" && p.bookmarked);

      return matchSearch && matchSubject && matchDifficulty && matchStatus;
    });
  }, [localProblems, searchQuery, selectedSubject, selectedDifficulty, selectedStatus]);

  const toggleSolveProblem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLocalProblems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.solved;
          if (next) toast.success(`Marked as solved: ${p.title}`);
          return { ...p, solved: next };
        }
        return p;
      })
    );
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLocalProblems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.bookmarked;
          if (next) toast.success(`Added to Revision List: ${p.title}`);
          else toast.info(`Removed from Revision: ${p.title}`);
          return { ...p, bookmarked: next };
        }
        return p;
      })
    );
  };

  const handleOpenProblem = (p: ProblemItem) => {
    setActiveProblem(p);
    setUserCode(p.codeSnippet);
    setActiveTab("description");
  };

  const getDifficultyBadge = (diff: "Basic" | "Core" | "Pro") => {
    if (diff === "Basic") {
      return (
        <Badge variant="success" className="font-semibold text-[10px]">
          Basic / Easy
        </Badge>
      );
    }
    if (diff === "Core") {
      return (
        <Badge variant="warning" className="font-semibold text-[10px]">
          Core / Medium
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="font-semibold text-[10px]">
        Pro / Hard
      </Badge>
    );
  };

  const getSubjectBadge = (subject: string) => {
    if (subject === "DSA") return <Badge variant="blue">{subject}</Badge>;
    if (subject === "DBMS") return <Badge variant="success">{subject}</Badge>;
    if (subject === "Operating Systems") return <Badge variant="purple">{subject}</Badge>;
    if (subject === "Computer Networks") return <Badge variant="warning">{subject}</Badge>;
    return <Badge variant="cyan">{subject}</Badge>;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* ========================================================================= */}
      {/* 1. HEADER SECTION */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
            <Code2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Problem Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Practice Problems
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Master pattern-based problems, system design questions, and core subjects for SDE interviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3.5 py-2 text-xs flex items-center gap-2 shadow-subtle">
            <span className="text-zinc-400">Solved:</span>
            <strong className="text-zinc-100 font-bold font-mono">
              {localProblems.filter((p) => p.solved).length} / {localProblems.length}
            </strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER CONTROLS */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3.5 shadow-subtle">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by problem title, topic (e.g. Arrays, Trees, B+ Tree, TCP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40"
          />
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {/* Subject Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-500 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Track:
            </span>
            {[
              { label: "All Subjects", val: "all" },
              { label: "DSA", val: "dsa" },
              { label: "System Design", val: "system-design" },
              { label: "DBMS", val: "dbms" },
              { label: "OS", val: "operating-systems" },
              { label: "CN", val: "computer-networks" },
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                onClick={() => setSelectedSubject(f.val)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors select-none",
                  selectedSubject === f.val
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold"
                    : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Difficulty & Status Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Difficulty Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[11px]">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic / Easy</option>
                <option value="core">Core / Medium</option>
                <option value="pro">Pro / Hard</option>
              </select>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[11px]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as "all" | "solved" | "unsolved" | "bookmarked")}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="unsolved">To Solve</option>
                <option value="solved">Solved</option>
                <option value="bookmarked">Bookmarked</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROBLEMS LIST TABLE */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
        {/* Table Header Bar */}
        <div className="grid grid-cols-12 gap-3 border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-1 flex items-center justify-center">Status</div>
          <div className="col-span-5 sm:col-span-5">Problem Title</div>
          <div className="col-span-2 hidden sm:block">Subject &middot; Topic</div>
          <div className="col-span-2 text-center">Difficulty</div>
          <div className="col-span-2 sm:col-span-2 text-right pr-2">Action</div>
        </div>

        {/* Problem Rows */}
        <div className="divide-y divide-zinc-800/40">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handleOpenProblem(problem)}
                className={cn(
                  "grid grid-cols-12 gap-3 items-center px-4 py-3 text-xs transition-colors hover:bg-zinc-900/80 cursor-pointer group",
                  problem.solved && "bg-zinc-950/20 opacity-75"
                )}
              >
                {/* 1. Status Checkbox */}
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => toggleSolveProblem(problem.id, e)}
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                      problem.solved
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-700 bg-zinc-900 hover:border-blue-500"
                    )}
                    aria-label="Toggle completed"
                  >
                    {problem.solved && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                </div>

                {/* 2. Title + Metadata */}
                <div className="col-span-5 sm:col-span-5 flex items-center gap-2 overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(problem.id, e)}
                    className={cn(
                      "p-1 rounded transition-colors shrink-0",
                      problem.bookmarked
                        ? "text-amber-400 hover:text-amber-300"
                        : "text-zinc-600 hover:text-amber-400 opacity-0 group-hover:opacity-100"
                    )}
                    title={problem.bookmarked ? "Remove from Revision" : "Bookmark for Revision"}
                  >
                    <Star className={cn("h-3.5 w-3.5", problem.bookmarked && "fill-amber-400")} />
                  </button>

                  <div className="truncate">
                    <span
                      className={cn(
                        "font-medium text-zinc-100 group-hover:text-blue-400 transition-colors",
                        problem.solved && "line-through text-zinc-500"
                      )}
                    >
                      {problem.title}
                    </span>
                    <div className="text-[10px] text-zinc-500 sm:hidden flex items-center gap-1.5 mt-0.5">
                      <span>{problem.subject}</span>
                      <span>&middot;</span>
                      <span>{problem.estimatedMinutes}m</span>
                    </div>
                  </div>
                </div>

                {/* 3. Subject & Topic */}
                <div className="col-span-2 hidden sm:flex items-center gap-2 overflow-hidden">
                  {getSubjectBadge(problem.subject)}
                  <span className="text-[11px] text-zinc-400 truncate">{problem.topic}</span>
                </div>

                {/* 4. Difficulty */}
                <div className="col-span-2 flex justify-center">
                  {getDifficultyBadge(problem.difficulty)}
                </div>

                {/* 5. Action / Time */}
                <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2 pr-1">
                  <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">
                    {problem.estimatedMinutes}m
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProblem(problem);
                    }}
                    className="h-7 px-2.5 text-[11px] border-zinc-800 bg-zinc-900 group-hover:border-blue-500/40 group-hover:text-blue-400"
                  >
                    <span>Solve</span>
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
                <Code2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-zinc-300">No matching problems found</p>
              <p className="text-[11px] text-zinc-500">
                Try adjusting your search query or removing active filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE PROBLEM / CODE MODAL */}
      {/* ========================================================================= */}
      {activeProblem && (
        <Dialog open={!!activeProblem} onOpenChange={() => setActiveProblem(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-zinc-950">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3.5 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-zinc-100">{activeProblem.title}</h2>
                {getDifficultyBadge(activeProblem.difficulty)}
                {getSubjectBadge(activeProblem.subject)}
              </div>

              <div className="flex items-center gap-2 pr-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleBookmark(activeProblem.id)}
                  className={cn(
                    "h-7 px-2.5 text-[11px]",
                    activeProblem.bookmarked && "text-amber-400 border-amber-500/30"
                  )}
                >
                  <Star className={cn("h-3 w-3 mr-1", activeProblem.bookmarked && "fill-amber-400")} />
                  {activeProblem.bookmarked ? "Bookmarked" : "Star for Revision"}
                </Button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-zinc-800 bg-zinc-950 px-5 gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab("description")}
                className={cn(
                  "py-2.5 border-b-2 transition-colors",
                  activeTab === "description"
                    ? "border-blue-500 text-blue-400 font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                )}
              >
                Problem Description
              </button>
              <button
                onClick={() => setActiveTab("solution")}
                className={cn(
                  "py-2.5 border-b-2 transition-colors",
                  activeTab === "solution"
                    ? "border-blue-500 text-blue-400 font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                )}
              >
                Code &amp; Solution
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={cn(
                  "py-2.5 border-b-2 transition-colors",
                  activeTab === "notes"
                    ? "border-blue-500 text-blue-400 font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                )}
              >
                Interview Notes
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === "description" && (
                <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
                  <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-900/30">
                    <p>{activeProblem.description}</p>
                  </div>

                  {activeProblem.examples.map((ex, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <span className="font-semibold text-zinc-200">Example {idx + 1}:</span>
                      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 font-mono text-[11px] space-y-1">
                        <div>
                          <span className="text-zinc-500">Input: </span>
                          <span className="text-zinc-200">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Output: </span>
                          <span className="text-emerald-400">{ex.output}</span>
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
              )}

              {activeTab === "solution" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Language:</span>
                      <select
                        value={activeLanguage}
                        onChange={(e) => setActiveLanguage(e.target.value as "cpp" | "java" | "python" | "javascript")}
                        className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                      >
                        <option value="cpp">C++ 20</option>
                        <option value="java">Java 21</option>
                        <option value="python">Python 3.12</option>
                        <option value="javascript">JavaScript (Node.js)</option>
                      </select>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setUserCode(activeProblem.codeSnippet)}
                      className="h-6 text-[10px]"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" /> Reset Code
                    </Button>
                  </div>

                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={12}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-3 text-xs">
                  <p className="text-zinc-400">Add personal interview tips, edge cases, and time complexity thoughts:</p>
                  <textarea
                    placeholder="e.g., Handle empty array edge cases. Time complexity O(N), Space O(1)..."
                    rows={6}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-5 py-3">
              <div className="text-[11px] text-zinc-500">
                Estimated time: <span className="font-mono text-zinc-400">{activeProblem.estimatedMinutes} mins</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toggleSolveProblem(activeProblem.id);
                    setActiveProblem((prev) => prev ? { ...prev, solved: !prev.solved } : null);
                  }}
                  className="text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  {activeProblem.solved ? "Mark Incomplete" : "Mark Solved"}
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    toggleSolveProblem(activeProblem.id);
                    toast.success("Solution submitted & test cases passed! +20 pts");
                    setActiveProblem(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  <Play className="h-3 w-3 mr-1 fill-white" />
                  Run &amp; Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
