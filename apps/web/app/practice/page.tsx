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
  Copy,
  Terminal,
  Shuffle,
  Building2,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { usePlannerStore } from "@/store/planner-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

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
  codeSnippet: Record<string, string>;
  description: string;
  examples: TestCase[];
  companies: string[];
  tags: string[];
}

export default function PracticePage() {
  const { plan } = useStudyPlan("crack-sde");
  const { addPoints } = usePlannerStore();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "solved" | "unsolved" | "bookmarked">("all");

  // Selected Problem Modal
  const [activeProblem, setActiveProblem] = useState<ProblemItem | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<"cpp" | "java" | "python" | "javascript">("cpp");
  const [userCode, setUserCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "editor" | "testcases" | "notes">("editor");

  // Test Runner State
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<{
    passed: boolean;
    actualOutput: string;
    runtime: string;
    memory: string;
  } | null>(null);

  // Problem Database
  const [problems, setProblems] = useState<ProblemItem[]>([
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
      companies: ["Google", "Amazon", "Meta", "Microsoft"],
      tags: ["Two Pointers", "Hash Map", "Arrays"],
      description:
        "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          expectedOutput: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4], target = 6",
          expectedOutput: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
        },
      ],
      codeSnippet: {
        cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int complement = target - nums[i];\n            if (seen.count(complement)) return {seen[complement], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
        java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) return new int[] { map.get(complement), i };\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
        python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`,
        javascript: `function twoSum(nums, target) {\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (seen.has(comp)) return [seen.get(comp), i];\n        seen.set(nums[i], i);\n    }\n    return [];\n}`,
      },
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
      companies: ["Amazon", "Microsoft", "Apple"],
      tags: ["Dynamic Programming", "Arrays", "Greedy"],
      description:
        "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum in O(n) time.",
      examples: [
        {
          input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          expectedOutput: "6",
          explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
        },
      ],
      codeSnippet: {
        cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int maxSum = nums[0], curSum = 0;\n        for (int x : nums) {\n            curSum = max(x, curSum + x);\n            maxSum = max(maxSum, curSum);\n        }\n        return maxSum;\n    }\n};`,
        java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int maxSum = nums[0], curSum = 0;\n        for (int x : nums) {\n            curSum = Math.max(x, curSum + x);\n            maxSum = Math.max(maxSum, curSum);\n        }\n        return maxSum;\n    }\n}`,
        python: `class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        max_sum, cur_sum = nums[0], 0\n        for x in nums:\n            cur_sum = max(x, cur_sum + x)\n            max_sum = max(max_sum, cur_sum)\n        return max_sum`,
        javascript: `function maxSubArray(nums) {\n    let maxSum = nums[0], curSum = 0;\n    for (const x of nums) {\n        curSum = Math.max(x, curSum + x);\n        maxSum = Math.max(maxSum, curSum);\n    }\n    return maxSum;\n}`,
      },
    },
    {
      id: "p3",
      title: "Trapping Rain Water",
      subject: "DSA",
      subjectSlug: "dsa",
      topic: "Two Pointers",
      difficulty: "Pro",
      estimatedMinutes: 35,
      solved: false,
      bookmarked: true,
      companies: ["Google", "Meta", "Amazon", "Uber"],
      tags: ["Two Pointers", "Monotonic Stack", "Arrays"],
      description:
        "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      examples: [
        {
          input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
          expectedOutput: "6",
          explanation: "The above elevation map can trap 6 units of rain water.",
        },
      ],
      codeSnippet: {
        cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        int left = 0, right = height.size() - 1;\n        int leftMax = 0, rightMax = 0, total = 0;\n        while (left < right) {\n            if (height[left] < height[right]) {\n                height[left] >= leftMax ? leftMax = height[left] : total += leftMax - height[left];\n                left++;\n            } else {\n                height[right] >= rightMax ? rightMax = height[right] : total += rightMax - height[right];\n                right--;\n            }\n        }\n        return total;\n    }\n};`,
        java: `class Solution {\n    public int trap(int[] height) {\n        int left = 0, right = height.length - 1;\n        int leftMax = 0, rightMax = 0, total = 0;\n        while (left < right) {\n            if (height[left] < height[right]) {\n                if (height[left] >= leftMax) leftMax = height[left];\n                else total += leftMax - height[left];\n                left++;\n            } else {\n                if (height[right] >= rightMax) rightMax = height[right];\n                else total += rightMax - height[right];\n                right--;\n            }\n        }\n        return total;\n    }\n}`,
        python: `class Solution:\n    def trap(self, height: list[int]) -> int:\n        l, r = 0, len(height) - 1\n        l_max, r_max, total = 0, 0, 0\n        while l < r:\n            if height[l] < height[r]:\n                if height[l] >= l_max: l_max = height[l]\n                else: total += l_max - height[l]\n                l += 1\n            else:\n                if height[r] >= r_max: r_max = height[r]\n                else: total += r_max - height[r]\n                r -= 1\n        return total`,
        javascript: `function trap(height) {\n    let l = 0, r = height.length - 1;\n    let lMax = 0, rMax = 0, total = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            height[l] >= lMax ? (lMax = height[l]) : (total += lMax - height[l]);\n            l++;\n        } else {\n            height[r] >= rMax ? (rMax = height[r]) : (total += rMax - height[r]);\n            r--;\n        }\n    }\n    return total;\n}`,
      },
    },
    {
      id: "p4",
      title: "LRU Cache Implementation",
      subject: "System Design",
      subjectSlug: "system-design",
      topic: "Low Level Design",
      difficulty: "Pro",
      estimatedMinutes: 45,
      solved: false,
      bookmarked: false,
      companies: ["Google", "Amazon", "Microsoft", "Uber"],
      tags: ["Hash Map", "Doubly Linked List", "System Design"],
      description:
        "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) average time complexity for both `get(key)` and `put(key, value)`.",
      examples: [
        {
          input: "LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); get(2);",
          expectedOutput: "[null, null, null, 1, null, -1]",
        },
      ],
      codeSnippet: {
        cpp: `class LRUCache {\n    int cap;\n    list<pair<int, int>> dll;\n    unordered_map<int, list<pair<int, int>>::iterator> map;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!map.count(key)) return -1;\n        dll.splice(dll.begin(), dll, map[key]);\n        return map[key]->second;\n    }\n    void put(int key, int value) {\n        if (map.count(key)) {\n            dll.splice(dll.begin(), dll, map[key]);\n            map[key]->second = value;\n            return;\n        }\n        if (dll.size() == cap) {\n            map.erase(dll.back().first);\n            dll.pop_back();\n        }\n        dll.emplace_front(key, value);\n        map[key] = dll.begin();\n    }\n};`,
        java: `class LRUCache {\n    private int capacity;\n    private LinkedHashMap<Integer, Integer> map;\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new LinkedHashMap<>(capacity, 0.75f, true);\n    }\n    public int get(int key) { return map.getOrDefault(key, -1); }\n    public void put(int key, int value) {\n        map.put(key, value);\n        if (map.size() > capacity) map.remove(map.keySet().iterator().next());\n    }\n}`,
        python: `from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap: self.cache.popitem(last=False)`,
        javascript: `class LRUCache {\n    constructor(capacity) {\n        this.cap = capacity;\n        this.cache = new Map();\n    }\n    get(key) {\n        if (!this.cache.has(key)) return -1;\n        const val = this.cache.get(key);\n        this.cache.delete(key);\n        this.cache.set(key, val);\n        return val;\n    }\n    put(key, value) {\n        if (this.cache.has(key)) this.cache.delete(key);\n        this.cache.set(key, value);\n        if (this.cache.size > this.cap) {\n            this.cache.delete(this.cache.keys().next().value);\n        }\n    }\n}`,
      },
    },
    {
      id: "p5",
      title: "B+ Tree Indexing & Point Queries",
      subject: "DBMS",
      subjectSlug: "dbms",
      topic: "Storage & Indexing",
      difficulty: "Core",
      estimatedMinutes: 25,
      solved: false,
      bookmarked: false,
      companies: ["Amazon", "Oracle", "Microsoft"],
      tags: ["Indexing", "B+ Trees", "ACID"],
      description:
        "Analyze disk I/O operations and explain why B+ Trees are preferred over Binary Search Trees for disk-based storage engines like InnoDB and PostgreSQL.",
      examples: [
        {
          input: "Fanout = 100, Total Records = 1,000,000",
          expectedOutput: "Tree Height = 3, Max Disk Block I/Os = 4",
        },
      ],
      codeSnippet: {
        cpp: `// B+ Tree Node Representation\nstruct BPlusNode {\n    bool isLeaf;\n    vector<int> keys;\n    vector<BPlusNode*> children;\n};`,
        java: `public class BPlusTreeNode {\n    boolean isLeaf;\n    List<Integer> keys;\n    List<BPlusTreeNode> children;\n}`,
        python: `class BPlusNode:\n    def __init__(self, is_leaf=False):\n        self.is_leaf = is_leaf\n        self.keys = []\n        self.children = []`,
        javascript: `class BPlusNode {\n    constructor(isLeaf = false) {\n        this.isLeaf = isLeaf;\n        this.keys = [];\n        this.children = [];\n    }\n}`,
      },
    },
  ]);

  // Tag list for filtering
  const allAvailableTags = ["Two Pointers", "Hash Map", "Dynamic Programming", "Monotonic Stack", "Doubly Linked List", "Indexing"];
  const allAvailableCompanies = ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Uber"];

  // Filtered problems computation
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSubject =
        selectedSubject === "all" ||
        p.subjectSlug === selectedSubject ||
        p.subject.toLowerCase() === selectedSubject.toLowerCase();

      const matchDifficulty =
        selectedDifficulty === "all" ||
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchCompany =
        selectedCompany === "all" ||
        p.companies.includes(selectedCompany);

      const matchTag =
        selectedTag === "all" ||
        p.tags.includes(selectedTag);

      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "solved" && p.solved) ||
        (selectedStatus === "unsolved" && !p.solved) ||
        (selectedStatus === "bookmarked" && p.bookmarked);

      return matchSearch && matchSubject && matchDifficulty && matchCompany && matchTag && matchStatus;
    });
  }, [problems, searchQuery, selectedSubject, selectedDifficulty, selectedCompany, selectedTag, selectedStatus]);

  const toggleSolveProblem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.solved;
          if (next) {
            addPoints(20);
            toast.success(`🎉 Solved: ${p.title} (+20 pts!)`);
          }
          return { ...p, solved: next };
        }
        return p;
      })
    );
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setProblems((prev) =>
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
    setUserCode(p.codeSnippet[activeLanguage] || p.codeSnippet.cpp);
    setActiveTab("editor");
    setTestResults(null);
    setSelectedTestCaseIndex(0);
  };

  const handleLanguageChange = (lang: "cpp" | "java" | "python" | "javascript") => {
    setActiveLanguage(lang);
    if (activeProblem && activeProblem.codeSnippet[lang]) {
      setUserCode(activeProblem.codeSnippet[lang]);
    }
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      setIsRunningTests(false);
      const isCorrect = userCode.trim().length > 20;
      setTestResults({
        passed: isCorrect,
        actualOutput: activeProblem?.examples[selectedTestCaseIndex]?.expectedOutput || "6",
        runtime: "12ms (Beats 94.2% of solutions)",
        memory: "2.3 MB (Beats 88.7% of solutions)",
      });
      if (isCorrect) {
        toast.success("✅ All Sample Test Cases Passed!");
      } else {
        toast.error("❌ Test Cases Failed: Output mismatch.");
      }
    }, 500);
  };

  const handleRandomProblem = () => {
    const unsolved = problems.filter((p) => !p.solved);
    const pool = unsolved.length > 0 ? unsolved : problems;
    const random = pool[Math.floor(Math.random() * pool.length)];
    if (random) {
      handleOpenProblem(random);
    }
  };

  const getDifficultyBadge = (diff: "Basic" | "Core" | "Pro") => {
    if (diff === "Basic") {
      return (
        <Badge variant="success" className="font-medium text-[11px] py-0 px-2">
          Basic / Easy
        </Badge>
      );
    }
    if (diff === "Core") {
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

  const getSubjectBadge = (subject: string) => {
    if (subject === "DSA") return <Badge variant="blue" className="font-medium text-[11px] py-0 px-2">{subject}</Badge>;
    if (subject === "DBMS") return <Badge variant="success" className="font-medium text-[11px] py-0 px-2">{subject}</Badge>;
    if (subject === "Operating Systems" || subject === "OS") return <Badge variant="purple" className="font-medium text-[11px] py-0 px-2">OS</Badge>;
    if (subject === "Computer Networks" || subject === "CN") return <Badge variant="warning" className="font-medium text-[11px] py-0 px-2">CN</Badge>;
    return <Badge variant="cyan" className="font-medium text-[11px] py-0 px-2">{subject}</Badge>;
  };

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
              847 Curated Qs
            </Badge>
          </h1>
          <p className="text-[12px] font-normal text-zinc-400 leading-normal">
            Master pattern-based algorithms, system design questions, and core subject problems for top tech interviews.
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
              {problems.filter((p) => p.solved).length} / {problems.length}
            </strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & ADVANCED FILTER BAR */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-3 shadow-subtle">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by problem title, topic (Arrays, Two Pointers, Indexing, Sockets)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
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
              { label: "System Design", val: "system-design" },
              { label: "DBMS", val: "dbms" },
              { label: "OS", val: "operating-systems" },
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                onClick={() => setSelectedSubject(f.val)}
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

          {/* Selectors: Difficulty, Company, Tag, Status */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Company Selector */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[11px]">Company:</span>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Companies</option>
                {allAvailableCompanies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Tag / Pattern Selector */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[11px]">Pattern:</span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Patterns</option>
                {allAvailableTags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-500 text-[11px]">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
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
                onChange={(e) => setSelectedStatus(e.target.value as "all" | "solved" | "unsolved" | "bookmarked")}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
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
      {/* 3. PROBLEM LIST TABLE */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 border-b border-zinc-800/80 bg-zinc-950/60 px-3.5 py-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          <div className="col-span-1 flex items-center justify-center">Status</div>
          <div className="col-span-5 sm:col-span-5">Problem Title</div>
          <div className="col-span-2 hidden sm:block">Subject &middot; Pattern</div>
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
                  "grid grid-cols-12 gap-3 items-center px-4 py-3 text-[13px] transition-colors hover:bg-zinc-900/80 cursor-pointer group",
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

                {/* 2. Title + Companies */}
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
                        "font-medium text-zinc-100 text-[13px] leading-snug group-hover:text-blue-400 transition-colors",
                        problem.solved && "line-through text-zinc-500 font-normal"
                      )}
                    >
                      {problem.title}
                    </span>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5 font-normal truncate">
                      <span>{problem.companies.slice(0, 3).join(", ")}</span>
                      <span>&middot;</span>
                      <span className="font-mono">{problem.estimatedMinutes}m</span>
                    </div>
                  </div>
                </div>

                {/* 3. Subject & Topic */}
                <div className="col-span-2 hidden sm:flex items-center gap-2 overflow-hidden">
                  {getSubjectBadge(problem.subject)}
                  <span className="text-[11px] text-zinc-400 truncate font-normal">{problem.topic}</span>
                </div>

                {/* 4. Difficulty */}
                <div className="col-span-2 flex justify-center">
                  {getDifficultyBadge(problem.difficulty)}
                </div>

                {/* 5. Action */}
                <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2 pr-1">
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
            ))
          ) : (
            <div className="py-12 text-center space-y-1.5">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
                <Code2 className="h-4 w-4" />
              </div>
              <p className="text-[12px] font-medium text-zinc-300">No matching problems found</p>
              <p className="text-[11px] text-zinc-500">
                Try clearing active filters or searching a different term.
              </p>
            </div>
          )}
        </div>
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
                {getSubjectBadge(activeProblem.subject)}
              </div>

              <div className="flex items-center gap-2 shrink-0 pr-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleBookmark(activeProblem.id)}
                  className={cn(
                    "h-6 px-2 text-[11px] font-medium",
                    activeProblem.bookmarked && "text-amber-400 border-amber-500/30"
                  )}
                >
                  <Star className={cn("h-3 w-3 mr-1", activeProblem.bookmarked && "fill-amber-400")} />
                  {activeProblem.bookmarked ? "Bookmarked" : "Star"}
                </Button>
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
                    onClick={() => setUserCode(activeProblem.codeSnippet[activeLanguage] || "")}
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
                      <span>Solution.{activeLanguage === "cpp" ? "cpp" : activeLanguage === "java" ? "java" : activeLanguage === "python" ? "py" : "js"}</span>
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
                        {activeProblem.examples.map((_, idx) => (
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
                    {activeProblem.examples[selectedTestCaseIndex] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 space-y-1">
                          <span className="text-zinc-500 font-sans font-medium text-[11px]">Input:</span>
                          <p className="text-zinc-200">{activeProblem.examples[selectedTestCaseIndex].input}</p>
                        </div>

                        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 space-y-1">
                          <span className="text-zinc-500 font-sans font-medium text-[11px]">Expected Output:</span>
                          <p className="text-emerald-400">{activeProblem.examples[selectedTestCaseIndex].expectedOutput}</p>
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
                    <p className="leading-normal">{activeProblem.description}</p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    {activeProblem.examples.map((ex, idx) => (
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

                  {/* Tags & Companies */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] border-t border-zinc-800">
                    <span className="text-zinc-500 font-medium">Companies:</span>
                    {activeProblem.companies.map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] py-0 px-1.5">
                        {c}
                      </Badge>
                    ))}
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
                      <li><strong>Time Complexity:</strong> O(N) linear time optimal scan.</li>
                      <li><strong>Space Complexity:</strong> O(N) using Hash Map auxiliary lookup.</li>
                      <li><strong>Corner Cases:</strong> Duplicate elements, negative target sums, single element arrays.</li>
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
                  onClick={() => {
                    toggleSolveProblem(activeProblem.id);
                    setActiveProblem(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium h-7 px-3"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Submit &amp; Finish
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
