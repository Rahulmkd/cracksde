"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Code2,
  Database,
  Layers,
  Cpu,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useRoadmapSubjects } from "@/hooks/use-roadmap";
import { DailyPlanner } from "@/components/layout/daily-planner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { plan } = useStudyPlan("crack-sde");
  const { data: roadmapSubjects } = useRoadmapSubjects();

  // Calculations
  const sprints = plan?.sprints || [];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);
  const totalTasks = allTasks.length || 847;
  const completedTasks = allTasks.filter((t) => t.status === "completed").length;

  // Categories progress data
  const categories = [
    { name: "DSA", count: "0 / 1007", percent: 0, icon: Code2, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { name: "System Design", count: "0 / 104", percent: 0, icon: Layers, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { name: "Core Subjects", count: "0 / 944", percent: 0, icon: Cpu, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { name: "Data Engineering", count: "0 / 334", percent: 0, icon: Database, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ];

  // Popular topics list
  const popularTopics = [
    {
      title: "Arrays & Strings",
      category: "DSA",
      desc: "Two Pointers, Sliding Window, Prefix Sums, and Matrix manipulations.",
      problems: 36,
      badge: "Fundamental",
      link: "/practice?subject=dsa&topic=Arrays",
    },
    {
      title: "Dynamic Programming",
      category: "DSA",
      desc: "0/1 Knapsack, Subsequences, Grid DP, and Interval State transitions.",
      problems: 42,
      badge: "High Frequency",
      link: "/practice?subject=dsa&topic=Dynamic-Programming",
    },
    {
      title: "Trees & Graphs",
      category: "DSA",
      desc: "DFS, BFS, Dijkstra, Topological Sort, Disjoint Set Union, and MST.",
      problems: 58,
      badge: "Essential",
      link: "/practice?subject=dsa&topic=Trees-Graphs",
    },
    {
      title: "System Design Essentials",
      category: "System Design",
      desc: "Load Balancing, Caching Layers, Sharding, Message Queues & CAP Theorem.",
      problems: 18,
      badge: "Architecture",
      link: "/practice?subject=system-design",
    },
    {
      title: "Operating Systems Core",
      category: "Core Subjects",
      desc: "Virtual Memory, Paging, Concurrency, Deadlocks, Mutex & Linux commands.",
      problems: 24,
      badge: "Interview Core",
      link: "/practice?subject=operating-systems",
    },
    {
      title: "Database Internals & SQL",
      category: "Core Subjects",
      desc: "B+ Trees, ACID Properties, Transaction Isolation Levels & Indexing.",
      problems: 28,
      badge: "Interview Core",
      link: "/practice?subject=dbms",
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-blue-500/20 bg-blue-950/20 px-4 py-2.5 text-[13px] text-zinc-300 shadow-subtle">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-semibold text-[11px] shrink-0">
            ✦
          </span>
          <p className="truncate text-zinc-300 text-[13px] font-normal leading-[1.45]">
            <strong className="text-blue-400 font-medium">Zenkai Curriculum Active</strong> &middot; Your problem sheets have been structured with day-wise sprint goals.
          </p>
        </div>
        <Link
          href="/prep-hub"
          className="shrink-0 text-[13px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          Explore Curriculum <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 2. GREETING SECTION */}
      {/* ========================================================================= */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100 flex items-center gap-2">
          <span>Good afternoon, Rahul</span>
          <span className="inline-block">👋</span>
        </h1>
        <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
          The day gets heavy around now. Good to see you still going. Keep up the momentum!
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. RESPONSIVE 2-COLUMN DASHBOARD GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8-9 COLS): HERO -> PROGRESS -> POPULAR TOPICS */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* PLANLY HERO CARD */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
            {/* Subtle grid pattern background */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-3 max-w-xl">
                <span className="inline-block rounded-md border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[12px] font-medium text-zinc-300 uppercase tracking-wider">
                  PLANLY &middot; Personal Study Planner
                </span>

                <h2 className="text-[24px] font-semibold leading-[1.25] tracking-tight text-zinc-100">
                  Know what to study every day and readjust as you go
                </h2>

                <p className="text-[13px] font-normal text-zinc-400 leading-[1.45]">
                  Personalized day-by-day study roadmap adapted to your schedule, weak areas, and interview targets.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    asChild
                    size="sm"
                    className="h-8 px-4 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <Link href="/onboarding">
                      Build my plan <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 px-4 text-[13px] font-medium"
                  >
                    <Link href="/planly">View Plan Schedule</Link>
                  </Button>
                </div>
              </div>

              {/* Right Tagline */}
              <div className="hidden md:flex flex-col items-end justify-center text-right text-[13px] text-zinc-400 pr-2 space-y-1">
                <span className="text-[12px] uppercase tracking-wider text-zinc-500 font-medium">Timeline</span>
                <p className="font-normal text-zinc-300">
                  Target: <strong className="text-blue-400 font-semibold">61 Days</strong>
                </p>
                <span className="text-[12px] text-zinc-500 font-normal">9 structured sprints</span>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* YOUR PROGRESS SECTION (2 COMPACT CARDS) */}
          {/* ===================================================================== */}
          <div className="space-y-3">
            <h2 className="text-[18px] font-semibold leading-[1.3] tracking-tight text-zinc-100">
              Your Progress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CARD 1: DSA PROGRESS (CENTERED DONUT RADIAL METER) */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-semibold leading-[1.35] text-zinc-100">DSA Progress</span>
                  <div className="text-zinc-500 hover:text-zinc-300 cursor-pointer" title="DSA problem solving progress">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex items-center justify-around gap-4 py-2">
                  {/* Circular Radial Donut Meter */}
                  <div className="relative flex h-28 w-28 items-center justify-center shrink-0">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-zinc-800"
                        strokeWidth="7"
                        fill="none"
                      />
                      {/* Segment (emerald / completed indicator) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-blue-500 transition-all duration-700 ease-out"
                        strokeWidth="7"
                        strokeDasharray="238.76"
                        strokeDashoffset="238.76"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>

                    {/* Center stats count */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                      <span className="text-[20px] font-semibold text-zinc-100 tracking-tight leading-none">
                        {completedTasks}
                      </span>
                      <span className="text-[12px] text-zinc-500 mt-1">
                        / 1369
                      </span>
                    </div>
                  </div>

                  {/* Level Breakdown Legend */}
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center justify-between gap-5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-sm bg-emerald-500" />
                        <span className="text-zinc-300 font-normal text-[13px]">Basic</span>
                      </div>
                      <span className="text-[12px] text-zinc-400">0 / 214</span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-sm bg-amber-400" />
                        <span className="text-zinc-300 font-normal text-[13px]">Core</span>
                      </div>
                      <span className="text-[12px] text-zinc-400">0 / 843</span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-sm bg-rose-500" />
                        <span className="text-zinc-300 font-normal text-[13px]">Pro</span>
                      </div>
                      <span className="text-[12px] text-zinc-400">0 / 312</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[12px] text-zinc-500">
                  <span>Accuracy: --</span>
                  <Link href="/practice" className="text-blue-400 hover:text-blue-300 font-medium">
                    View full problem list &rarr;
                  </Link>
                </div>
              </div>

              {/* CARD 2: CATEGORY-WISE PROGRESS */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle flex flex-col justify-between">
                <span className="text-[16px] font-semibold leading-[1.35] text-zinc-100">Category-wise Progress</span>

                <div className="space-y-2 pt-1">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div
                        key={cat.name}
                        className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-2.5 hover:bg-zinc-900/60 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className={cn("flex h-7 w-7 items-center justify-center rounded border shrink-0", cat.color)}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="text-[13px] font-medium text-zinc-200 truncate">{cat.name}</div>
                            <div className="text-[12px] text-zinc-500">{cat.count}</div>
                          </div>
                        </div>

                        <div className="text-[13px] font-medium text-zinc-400 shrink-0">
                          {cat.percent}%
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[12px] text-zinc-500">
                  <span>4 core subject areas</span>
                  <Link href="/prep-hub" className="text-blue-400 hover:text-blue-300 font-medium">
                    Explore modules &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 4. EXPLORE POPULAR TOPICS SECTION */}
          {/* ===================================================================== */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[18px] font-semibold leading-[1.3] tracking-tight text-zinc-100">
                <span className="text-blue-400 text-xs">✦</span>
                <h2>Explore Popular Topics</h2>
              </div>
              <Link href="/practice" className="text-[13px] font-medium text-blue-400 hover:text-blue-300">
                View all topics &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {popularTopics.map((topic) => (
                <div
                  key={topic.title}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 hover:border-zinc-700/80 hover:bg-zinc-900/70 transition-all duration-200 group flex flex-col justify-between shadow-subtle"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400">
                        {topic.category}
                      </span>
                      <span className="text-[12px] text-zinc-500">
                        {topic.problems} items
                      </span>
                    </div>

                    <h3 className="text-[16px] font-semibold leading-[1.35] text-zinc-200 group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-[13px] font-normal text-zinc-400 leading-[1.45] line-clamp-2">
                      {topic.desc}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[12px]">
                    <span className="text-[12px] text-zinc-500 font-normal">{topic.badge}</span>
                    <Link
                      href={topic.link}
                      className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 text-[13px]"
                    >
                      Practice <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (3-4 COLS): SHARED STICKY DAILY PLANNER */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3 w-full">
          <div className="sticky top-20">
            <DailyPlanner showProblemOfTheDay={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
