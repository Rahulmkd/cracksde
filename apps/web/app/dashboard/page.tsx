"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  Star,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Code2,
  Database,
  Layers,
  Cpu,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    { name: "DSA", count: "0 / 1007", percent: 0, icon: Code2 },
    { name: "System Design", count: "0 / 104", percent: 0, icon: Layers },
    { name: "Core Subjects", count: "0 / 944", percent: 0, icon: Cpu },
    { name: "Data Engineering", count: "0 / 334", percent: 0, icon: Database },
  ];

  // Popular topics list
  const popularTopics = [
    {
      title: "Arrays & Strings",
      category: "DSA",
      desc: "Two Pointers, Sliding Window, Prefix Sums, and Matrix manipulations.",
      problems: 36,
      badge: "Fundamental",
      color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
      link: "/onboarding",
    },
    {
      title: "Dynamic Programming",
      category: "DSA",
      desc: "0/1 Knapsack, Subsequences, Grid DP, and Interval State transitions.",
      problems: 42,
      badge: "High Frequency",
      color: "border-purple-500/30 text-purple-400 bg-purple-500/10",
      link: "/onboarding",
    },
    {
      title: "Trees & Graphs",
      category: "DSA",
      desc: "DFS, BFS, Dijkstra, Topological Sort, Disjoint Set Union, and MST.",
      problems: 58,
      badge: "Essential",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      link: "/onboarding",
    },
    {
      title: "System Design Essentials",
      category: "System Design",
      desc: "Load Balancing, Caching Layers, Sharding, Message Queues & Cap Theorem.",
      problems: 18,
      badge: "Architecture",
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
      link: "/onboarding",
    },
    {
      title: "Operating Systems Core",
      category: "Core Subjects",
      desc: "Virtual Memory, Paging, Concurrency, Deadlocks, Mutex & Linux commands.",
      problems: 24,
      badge: "Interview Core",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
      link: "/onboarding",
    },
    {
      title: "Database Internals & SQL",
      category: "Core Subjects",
      desc: "B+ Trees, ACID Properties, Transaction Isolation Levels & Indexing.",
      problems: 28,
      badge: "Interview Core",
      color: "border-rose-500/30 text-rose-400 bg-rose-500/10",
      link: "/onboarding",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-16 animate-in fade-in-50 duration-300">
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BANNER (MATCHING SCREENSHOT 1) */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-blue-900/40 bg-zinc-950/80 px-4 py-2.5 text-xs text-zinc-300 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-[11px] shrink-0">
            ✦
          </span>
          <p className="truncate text-zinc-300 text-xs">
            <strong className="text-blue-400 font-semibold">Zenkai is live</strong> &middot; Your sheets have been upgraded, and your progress has moved with you
          </p>
        </div>
        <Link
          href="/prep-hub"
          className="shrink-0 text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          See what&apos;s new <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 2. GREETING SECTION */}
      {/* ========================================================================= */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <span>Good afternoon, Rahul</span>
          <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          The day gets heavy around now. Good to see you still going.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. RESPONSIVE 2-COLUMN DASHBOARD LAYOUT */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8-9 COLS): BANNER -> YOUR PROGRESS -> POPULAR TOPICS */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* PLANLY HERO CARD (MATCHING SCREENSHOT 1) */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-sm">
            {/* Subtle grid background */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />

            {/* Ambient center sparkle */}
            <div className="absolute right-1/3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <div className="h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute inset-0 flex items-center justify-center text-blue-300 font-bold text-lg animate-pulse">
                ✦
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-lg">
                <span className="inline-block rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
                  PLANLY - Your personal planner
                </span>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 leading-snug">
                  Know what to study every day and readjust as you go
                </h2>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    asChild
                    size="sm"
                    className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                  >
                    <Link href="/onboarding">
                      Build my plan <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-9 px-4 text-xs font-medium border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Link href="/planly">Know more</Link>
                  </Button>
                </div>
              </div>

              {/* Right Tagline */}
              <div className="hidden md:flex flex-col items-end justify-center text-right text-xs text-zinc-400 pr-2">
                <p className="font-normal text-zinc-400">
                  Get a plan based on your <strong className="italic font-serif font-bold text-zinc-200">prep timeline</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* YOUR PROGRESS SECTION (2 COMPACT CARDS MATCHING SCREENSHOT 1) */}
          {/* ===================================================================== */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold tracking-tight text-zinc-200">
              Your Progress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CARD 1: DSA PROGRESS (DONUT RADIAL METER) */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 space-y-4 hover:border-zinc-700/80 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">DSA Progress</span>
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
                        className="stroke-zinc-800/80"
                        strokeWidth="7"
                        fill="none"
                      />
                      {/* Basic progress segment (emerald) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-emerald-500/80 transition-all duration-700 ease-out"
                        strokeWidth="7"
                        strokeDasharray="238.76"
                        strokeDashoffset="238.76"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Core progress segment (amber) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-amber-400/80 transition-all duration-700 ease-out"
                        strokeWidth="7"
                        strokeDasharray="238.76"
                        strokeDashoffset="238.76"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Pro progress segment (rose) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="stroke-rose-500/80 transition-all duration-700 ease-out"
                        strokeWidth="7"
                        strokeDasharray="238.76"
                        strokeDashoffset="238.76"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>

                    {/* Center stats count */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-extrabold text-zinc-100 tracking-tight leading-none">
                        {completedTasks}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 mt-0.5">
                        / 1369
                      </span>
                    </div>
                  </div>

                  {/* Level Breakdown Legend */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-sm bg-emerald-500" />
                        <span className="text-zinc-300 font-medium text-xs">Basic</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">0 / 214</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-sm bg-amber-400" />
                        <span className="text-zinc-300 font-medium text-xs">Core</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">0 / 843</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-sm bg-rose-500" />
                        <span className="text-zinc-300 font-medium text-xs">Pro</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">0 / 312</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: CATEGORY-WISE PROGRESS */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 space-y-3 hover:border-zinc-700/80 transition-all">
                <span className="text-xs font-bold text-zinc-200">Category-wise Progress</span>

                <div className="space-y-2.5 pt-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-2.5 hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                          <Code2 className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-zinc-200 truncate">{cat.name}</div>
                          <div className="text-[10px] font-mono text-zinc-500">{cat.count}</div>
                        </div>
                      </div>

                      <div className="text-xs font-mono font-semibold text-zinc-400 shrink-0">
                        {cat.percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 4. EXPLORE POPULAR TOPICS SECTION */}
          {/* ===================================================================== */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-zinc-200">
              <span className="text-blue-400 text-xs">✦</span>
              <h2>Explore Popular Topics</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {popularTopics.map((topic) => (
                <div
                  key={topic.title}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 space-y-3 hover:border-zinc-700/80 hover:bg-zinc-900/50 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                        {topic.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {topic.problems} items
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {topic.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-zinc-500">{topic.badge}</span>
                    <Link
                      href={topic.link}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-xs"
                    >
                      Explore <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (3-4 COLS): SHARED FIXED / STICKY DAILY PLANNER */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-20">
            <DailyPlanner showProblemOfTheDay={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
