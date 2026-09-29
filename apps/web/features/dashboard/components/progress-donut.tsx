"use client";

import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";

interface ProgressDonutProps {
  completedTasks: number;
  totalTasks: number;
  progressPercent: number;
}

export function ProgressDonut({
  completedTasks,
  totalTasks,
  progressPercent,
}: ProgressDonutProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // 238.76
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-zinc-100">Curriculum Completion</span>
        <div
          className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
          title="Problem solving progress across all sprints"
        >
          <Info className="h-3 w-3" />
        </div>
      </div>

      <div className="flex items-center justify-around gap-3 py-1">
        {/* Circular Radial Donut Meter */}
        <div className="relative flex h-24 w-24 items-center justify-center shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-zinc-800"
              strokeWidth="7"
              fill="none"
            />
            {/* Segment */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-blue-500 transition-all duration-700 ease-out"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Center stats count */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className="text-[18px] font-semibold text-zinc-100 tracking-tight leading-none font-mono">
              {completedTasks}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 font-mono">
              / {totalTasks}
            </span>
          </div>
        </div>

        {/* Level Breakdown Legend */}
        <div className="space-y-1.5 text-[12px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-emerald-500" />
              <span className="text-zinc-300 font-normal text-[12px]">Basic</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">0 / 214</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-amber-400" />
              <span className="text-zinc-300 font-normal text-[12px]">Core</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">0 / 412</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-rose-500" />
              <span className="text-zinc-300 font-normal text-[12px]">Pro</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">0 / 221</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Overall: {progressPercent}%</span>
        <Link href="/practice" className="text-blue-400 hover:text-blue-300 font-medium">
          Solve problems &rarr;
        </Link>
      </div>
    </div>
  );
}
