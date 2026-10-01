"use client";

import React from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryProgress } from "../types";

interface SubjectProgressBarProps {
  categories: CategoryProgress[];
  title?: string;
  isLoading?: boolean;
}

function CircularPercentIndicator({
  percent = 0,
  size = 34,
  strokeWidth = 2.5,
  strokeColor = "#38bdf8",
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-zinc-800/90"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress stroke */}
        {clampedPercent > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500 ease-out"
          />
        )}
      </svg>
      {/* Centered percentage text */}
      <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-medium font-mono text-zinc-300">
        {Math.round(clampedPercent)}%
      </span>
    </div>
  );
}

export function SubjectProgressBar({
  categories,
  title = "Category-wise Progress",
  isLoading = false,
}: SubjectProgressBarProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 h-full flex flex-col justify-between select-none">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 mb-3 sm:mb-2">
          <span className="text-[15px] font-semibold text-zinc-100">{title}</span>
        </div>

        {/* Skeleton Category List */}
        <div className="flex-1 flex flex-col justify-between py-1 gap-1.5 sm:gap-2 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 p-1.5 -mx-1.5 rounded-xl"
            >
              {/* Left Skeleton */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 sm:h-9.5 sm:w-9.5 rounded-xl bg-zinc-800/70 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-24 sm:w-28 bg-zinc-800/80 rounded" />
                  <div className="h-2.5 w-14 bg-zinc-800/50 rounded" />
                </div>
              </div>

              {/* Right Circular Skeleton */}
              <div className="h-[34px] w-[34px] rounded-full border-2 border-zinc-800/70 bg-zinc-900/50 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 h-full flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-200 shadow-subtle select-none">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-3 sm:mb-2">
        <span className="text-[15px] font-semibold text-zinc-100">{title}</span>
      </div>

      {/* Category List - Evenly distributed within card height */}
      <div className="flex-1 flex flex-col justify-between py-1 gap-1.5 sm:gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon || Code2;
          const href = cat.slug ? `/practice?subject=${cat.slug}` : "/practice";

          return (
            <Link
              key={cat.name}
              href={href}
              className="flex items-center justify-between gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-zinc-800/30 transition-colors group"
            >
              {/* Left Column: Icon + Category Details */}
              <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                <div
                  className={cn(
                    "flex h-9 w-9 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-xl border shrink-0 transition-transform group-hover:scale-105 duration-200",
                    cat.color || "text-cyan-400 bg-cyan-950/40 border-cyan-500/20"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[13px] sm:text-[14px] font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-zinc-400 font-mono">
                    {cat.count}
                  </span>
                </div>
              </div>

              {/* Right Column: Circular Percentage Indicator */}
              <CircularPercentIndicator
                percent={cat.percent}
                strokeColor={cat.strokeColor || "#38bdf8"}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
