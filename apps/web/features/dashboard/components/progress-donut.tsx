"use client";

import React from "react";
import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";

interface ProgressDonutProps {
  completedTasks: number;
  totalTasks: number;
  progressPercent: number;
  basicCompleted?: number;
  basicTotal?: number;
  coreCompleted?: number;
  coreTotal?: number;
  proCompleted?: number;
  proTotal?: number;
}

export function ProgressDonut({
  completedTasks = 25,
  totalTasks = 847,
  progressPercent = 3,
  basicCompleted = 0,
  basicTotal = 214,
  coreCompleted = 0,
  coreTotal = 412,
  proCompleted = 0,
  proTotal = 221,
}: ProgressDonutProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // 238.76
  const effectivePercent = progressPercent > 0 ? progressPercent : (completedTasks / Math.max(1, totalTasks)) * 100;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(1, effectivePercent)) / 100) * circumference;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-[#0c1017] p-4 sm:p-5 space-y-4 hover:border-zinc-700/80 transition-all duration-200 shadow-sm flex flex-col justify-between select-none">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-zinc-100">Curriculum Completion</span>
        <div
          className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          title="Problem solving progress across all difficulty levels"
        >
          <Info className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="flex items-center justify-around gap-4 py-1">
        {/* Circular Radial Donut Meter */}
        <div className="relative flex h-24 w-24 items-center justify-center shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-zinc-800/90"
              strokeWidth="7"
              fill="none"
            />
            {/* Progress segment */}
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
            <span className="text-[20px] sm:text-[22px] font-bold text-zinc-100 tracking-tight leading-none font-mono">
              {completedTasks}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 font-mono">
              / {totalTasks}
            </span>
          </div>
        </div>

        {/* Level Breakdown Legend */}
        <div className="space-y-2 text-[12px] min-w-[120px]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-zinc-300 font-normal text-[12px]">Basic</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">{basicCompleted} / {basicTotal}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-zinc-300 font-normal text-[12px]">Core</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">{coreCompleted} / {coreTotal}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-zinc-300 font-normal text-[12px]">Pro</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">{proCompleted} / {proTotal}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Overall: {Math.round(effectivePercent)}%</span>
        <Link
          href="/practice"
          className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>Solve problems</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

