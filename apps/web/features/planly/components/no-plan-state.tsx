"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Layers,
  Repeat,
  CheckCircle2,
  ArrowRight,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function NoPlanState() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* 1. Header Section: Breadcrumb */}
      <div className="space-y-1 pb-0.5">
        <div className="flex items-center gap-1.5 text-[12px] text-zinc-400">
          <Link href="/planly" className="hover:text-zinc-200 transition-colors">
            Planly
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="font-semibold text-zinc-100">Study Planner</span>
        </div>
      </div>

      {/* 2. Hero Card for No Active Plan */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 shadow-subtle">
        {/* Blueprint grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-400">
            <Compass className="h-3.5 w-3.5 text-blue-400" />
            <span>Ready for your interview journey</span>
          </div>

          <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-zinc-100">
            You don't have an active study plan yet
          </h1>

          <p className="text-[14px] text-zinc-400 leading-relaxed">
            Create your customized roadmap in under 2 minutes. Planly breaks down 150+ core CS
            and DSA topics into manageable daily sprints tailored to your weekly availability and target role.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="default"
              className="h-10 px-5 text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm rounded-xl transition-all active:scale-[0.98]"
            >
              <Link href="/onboarding" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Create Study Plan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="default"
              className="h-10 px-4 text-[13px] font-medium border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:text-white text-zinc-300 rounded-xl transition-colors"
            >
              <Link href="/roadmap">Explore Curriculum</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Feature Highlights Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Sprints */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[14px] font-semibold text-zinc-100">Structured Sprints</h3>
          <p className="text-[12px] text-zinc-400 leading-relaxed">
            Organized into 9 focused sprints spanning DSA, System Design, Operating Systems, and DBMS.
          </p>
        </div>

        {/* Card 2: Spaced Repetition */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Repeat className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[14px] font-semibold text-zinc-100">Smart Revisions</h3>
          <p className="text-[12px] text-zinc-400 leading-relaxed">
            Automated spaced-repetition schedules problems at optimal retention intervals so you never forget.
          </p>
        </div>

        {/* Card 3: Adaptive Daily Milestones */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-3">
          <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[14px] font-semibold text-zinc-100">Adaptive Milestones</h3>
          <p className="text-[12px] text-zinc-400 leading-relaxed">
            Smart Catch-Up redistributes overdue tasks smoothly if life or work gets in the way.
          </p>
        </div>
      </div>
    </div>
  );
}
