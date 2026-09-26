"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  Monitor,
  Layers,
  Database,
  ChevronRight,
  Users,
  BookOpen,
  Activity,
  ArrowRight,
} from "lucide-react";
import { DailyPlanner } from "@/components/layout/daily-planner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubjectCard {
  id: string;
  name: string;
  description: string;
  sheets: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  href: string;
  modules: number;
  hours: string;
}

export default function PrepHubPage() {
  const subjects: SubjectCard[] = [
    {
      id: "dsa",
      name: "Data Structures & Algorithms",
      description:
        "Master pattern-based problem solving, tree traversals, graph algorithms, dynamic programming, and interview patterns.",
      sheets: 6,
      modules: 16,
      hours: "116h",
      icon: Code2,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
      iconBorder: "border-cyan-500/20",
      href: "/practice?subject=dsa",
    },
    {
      id: "system-design",
      name: "System Design & LLD",
      description:
        "Prepare for architectural and low-level design rounds with SOLID principles, design patterns, and UML diagrams.",
      sheets: 2,
      modules: 14,
      hours: "31h",
      icon: Monitor,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      iconBorder: "border-amber-500/20",
      href: "/practice?subject=system-design",
    },
    {
      id: "core-subjects",
      name: "Core CS Subjects",
      description:
        "Strengthen Operating Systems, DBMS internals, and Computer Networks fundamentals required in top tech interviews.",
      sheets: 6,
      modules: 42,
      hours: "105h",
      icon: Layers,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10",
      iconBorder: "border-purple-500/20",
      href: "/practice?subject=core-subjects",
    },
    {
      id: "data-engineering",
      name: "Database & SQL Mastery",
      description:
        "Learn advanced SQL queries, query optimization, indexing strategies, transaction isolation, and schema design.",
      sheets: 2,
      modules: 12,
      hours: "48h",
      icon: Database,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      iconBorder: "border-blue-500/20",
      href: "/practice?subject=dbms",
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* 2-Column Responsive Layout: Main Area (Left) + Fixed Right Sidebar (Daily Planner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8-9 COLS): PREP HUB HEADER & SUBJECTS */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* ===================================================================== */}
          {/* 1. PREPHUB MAIN HEADER CARD */}
          {/* ===================================================================== */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
            {/* Subtle grid pattern background */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Title & Stats */}
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
                    <span>Curriculum Hub</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                    Prep Hub
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Your complete knowledge base and practice roadmap across all core SDE interview subjects.
                  </p>
                </div>

                {/* Statistics Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Activity className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span className="text-zinc-200 font-semibold">26.9K</span>
                    <span className="text-zinc-500 text-[11px]">Active this month</span>
                  </div>

                  <span className="text-zinc-700 hidden sm:inline">&middot;</span>

                  <div className="flex items-center gap-1.5 font-medium">
                    <Users className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-zinc-200 font-semibold">1.8M</span>
                    <span className="text-zinc-500 text-[11px]">Total Candidates</span>
                  </div>

                  <span className="text-zinc-700 hidden sm:inline">&middot;</span>

                  <div className="flex items-center gap-1.5 font-medium">
                    <BookOpen className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span className="text-zinc-200 font-semibold">16</span>
                    <span className="text-zinc-500 text-[11px]">Curated Subjects</span>
                  </div>
                </div>
              </div>

              {/* Right Illustration Graphic */}
              <div className="hidden md:flex items-center justify-center shrink-0 pr-2">
                <div className="relative flex flex-col items-center p-3 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-card">
                  <div className="h-16 w-28 rounded-lg border border-zinc-800 bg-zinc-900/90 flex flex-col items-center justify-center text-center p-2">
                    <span className="text-blue-400 font-bold text-sm">⚡ 847</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Curated Qs</span>
                  </div>
                  <div className="mt-2 text-[10px] text-zinc-500 font-medium">
                    Full Coverage
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 2. EXPLORE SUBJECTS (EQUAL HEIGHT HORIZONTAL CARDS) */}
          {/* ===================================================================== */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight text-zinc-100">
                Explore Subjects
              </h2>
              <span className="text-xs text-zinc-500">4 Core Tracks</span>
            </div>

            <div className="grid gap-3.5">
              {subjects.map((sub) => {
                const Icon = sub.icon;
                return (
                  <Link
                    key={sub.id}
                    href={sub.href}
                    className="group block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 hover:border-zinc-700/80 hover:bg-zinc-900/70 transition-all duration-200 shadow-subtle"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Colored Icon + Subject Info */}
                      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 overflow-hidden">
                        <div
                          className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border ${sub.iconBg} ${sub.iconBorder} ${sub.iconColor} shrink-0 transition-transform group-hover:scale-105 duration-200`}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>

                        {/* Subject Text Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                              {sub.name}
                            </h3>
                            <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                              • {sub.hours}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-1 sm:line-clamp-2">
                            {sub.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Sheets Count + Chevron */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60 pl-2">
                        <div className="flex items-center gap-3 text-xs text-zinc-300">
                          <span className="text-[11px] text-zinc-500">{sub.modules} Modules</span>
                          <span className="font-semibold text-zinc-200 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
                            {sub.sheets} Sheets
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all duration-200" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 3. RIGHT SIDEBAR (3-4 COLS): SHARED DAILY PLANNER */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3 w-full">
          <div className="sticky top-20">
            <DailyPlanner showProblemOfTheDay={false} />
          </div>
        </aside>
      </div>
    </div>
  );
}
