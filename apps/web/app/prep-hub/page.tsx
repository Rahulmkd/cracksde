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
  Laptop,
} from "lucide-react";
import { DailyPlanner } from "@/components/layout/daily-planner";

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
}

export default function PrepHubPage() {
  const subjects: SubjectCard[] = [
    {
      id: "dsa",
      name: "DSA",
      description:
        "Learn DSA from the Basics, Practise Key Patterns and Prepare for Coding Interviews.",
      sheets: 6,
      icon: Code2,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/15",
      iconBorder: "border-cyan-500/30",
      href: "/onboarding",
    },
    {
      id: "system-design",
      name: "System Design",
      description:
        "Prepare for design interviews with OOPs, Design Principles and Practical Low Level Design.",
      sheets: 2,
      icon: Monitor,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/15",
      iconBorder: "border-amber-500/30",
      href: "/onboarding",
    },
    {
      id: "core-subjects",
      name: "Core Subjects",
      description:
        "Strengthen your DBMS, Operating Systems and Computer Networks fundamentals for technical interviews.",
      sheets: 6,
      icon: Layers,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/15",
      iconBorder: "border-purple-500/30",
      href: "/onboarding",
    },
    {
      id: "data-engineering",
      name: "Data Engineering",
      description:
        "Learn SQL, Practise Interview Queries and Build a Foundation in Database Design and Performance.",
      sheets: 2,
      icon: Database,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15",
      iconBorder: "border-blue-500/30",
      href: "/onboarding",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16 animate-in fade-in-50 duration-300">
      {/* 2-Column Responsive Layout: Main Area (Left) + Fixed Right Sidebar (Daily Planner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8-9 COLS): PREP HUB HEADER & SUBJECTS */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* ===================================================================== */}
          {/* 1. PREPHUB MAIN HEADER CARD (MATCHING SCREENSHOT) */}
          {/* ===================================================================== */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 sm:p-7 shadow-sm">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-1/4 -z-0 h-44 w-44 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Title & Stats */}
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                    Prephub
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Your one-stop platform to learn, and master every interview subject.
                  </p>
                </div>

                {/* Compact Statistics Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-zinc-400">
                  {/* Stat 1 */}
                  <div className="flex items-center gap-1.5 font-medium">
                    <Activity className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="text-zinc-200 font-semibold">26.9K</span>
                    <span className="text-zinc-500 text-[11px]">Active this month</span>
                  </div>

                  <span className="text-zinc-700 hidden sm:inline">&middot;</span>

                  {/* Stat 2 */}
                  <div className="flex items-center gap-1.5 font-medium">
                    <Users className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="text-zinc-200 font-semibold">1.8M</span>
                    <span className="text-zinc-500 text-[11px]">Total Users</span>
                  </div>

                  <span className="text-zinc-700 hidden sm:inline">&middot;</span>

                  {/* Stat 3 */}
                  <div className="flex items-center gap-1.5 font-medium">
                    <BookOpen className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="text-zinc-200 font-semibold">16</span>
                    <span className="text-zinc-500 text-[11px]">Curated Subjects</span>
                  </div>
                </div>
              </div>

              {/* Right Illustration Graphic (Matching Screenshot) */}
              <div className="hidden md:flex items-center justify-center shrink-0 pr-4">
                <div className="relative flex items-center justify-center">
                  {/* Laptop Mockup Element */}
                  <div className="relative flex flex-col items-center">
                    <div className="h-20 w-32 rounded-t-lg border border-zinc-700/80 bg-zinc-900/90 shadow-xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent" />
                      <div className="font-mono text-sm font-extrabold text-blue-400 flex items-center gap-0.5">
                        <span>⚡</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-36 rounded-b-md bg-zinc-800 border-t border-zinc-700" />
                  </div>

                  {/* Behind Cards Graphic */}
                  <div className="absolute -right-4 -top-2 -z-10 h-16 w-20 rounded-md border border-zinc-800/80 bg-zinc-900/60 rotate-6" />
                  <div className="absolute -left-3 bottom-0 -z-10 h-14 w-16 rounded-md border border-zinc-800/80 bg-zinc-900/40 -rotate-6" />
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 2. EXPLORE SUBJECTS (LARGE HORIZONTAL CARDS MATCHING SCREENSHOT) */}
          {/* ===================================================================== */}
          <div className="space-y-3.5">
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-zinc-100">
              Explore Subjects
            </h2>

            <div className="space-y-3">
              {subjects.map((sub) => {
                const Icon = sub.icon;
                return (
                  <Link
                    key={sub.id}
                    href={sub.href}
                    className="group block rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4 sm:p-5 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Colored Icon + Subject Info */}
                      <div className="flex items-center gap-4 sm:gap-5 overflow-hidden">
                        {/* Colored Square Icon Container */}
                        <div
                          className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border ${sub.iconBg} ${sub.iconBorder} ${sub.iconColor} shrink-0 transition-transform group-hover:scale-105 duration-200`}
                        >
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>

                        {/* Subject Text Details */}
                        <div className="space-y-1">
                          <h3 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                            {sub.name}
                          </h3>
                          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-1 sm:line-clamp-2">
                            {sub.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Sheets Count + Chevron */}
                      <div className="flex items-center gap-4 shrink-0 pl-2">
                        <div className="text-xs font-semibold text-zinc-200 flex items-baseline gap-1">
                          <span className="font-bold text-sm text-zinc-100">{sub.sheets}</span>
                          <span className="text-zinc-500 font-normal text-[11px]">Sheets</span>
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
        {/* 3. RIGHT SIDEBAR (3-4 COLS): FIXED / STICKY SHARED DAILY PLANNER */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-20">
            <DailyPlanner showProblemOfTheDay={false} />
          </div>
        </aside>
      </div>
    </div>
  );
}
