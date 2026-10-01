"use client";

import React, { useMemo } from "react";
import { Info } from "lucide-react";

export interface ProgressDonutProps {
  completedTasks?: number;
  totalTasks?: number;
  progressPercent?: number;
  basicCompleted?: number;
  basicTotal?: number;
  coreCompleted?: number;
  coreTotal?: number;
  proCompleted?: number;
  proTotal?: number;
  title?: string;
  tooltipText?: string;
  isLoading?: boolean;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: Number((centerX + radius * Math.cos(angleInRadians)).toFixed(2)),
    y: Number((centerY + radius * Math.sin(angleInRadians)).toFixed(2)),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const span = endAngle - startAngle;
  if (span <= 0) return "";
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = span > 180 ? "1" : "0";

  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(" ");
}

export function ProgressDonut({
  completedTasks = 0,
  totalTasks = 1369,
  progressPercent,
  basicCompleted = 0,
  basicTotal = 214,
  coreCompleted = 0,
  coreTotal = 843,
  proCompleted = 0,
  proTotal = 312,
  title = "DSA Progress",
  tooltipText = "DSA problem solving progress across Basic, Core, and Pro difficulty tiers",
  isLoading = false,
}: ProgressDonutProps) {
  // Total calculation
  const totalCount = (basicTotal + coreTotal + proTotal) || totalTasks || 1369;
  const totalSolved = basicCompleted + coreCompleted + proCompleted || completedTasks;

  // Arc calculation parameters
  const radius = 38;
  const gap = 8; // degrees gap between segments
  const totalAvailableDegrees = 360 - 3 * gap; // 336 degrees

  const { basicArc, coreArc, proArc } = useMemo(() => {
    const bSpan = Math.max(12, (basicTotal / totalCount) * totalAvailableDegrees);
    const cSpan = Math.max(12, (coreTotal / totalCount) * totalAvailableDegrees);
    const pSpan = Math.max(12, (proTotal / totalCount) * totalAvailableDegrees);

    const sumSpans = bSpan + cSpan + pSpan;
    const normBasicSpan = (bSpan / sumSpans) * totalAvailableDegrees;
    const normCoreSpan = (cSpan / sumSpans) * totalAvailableDegrees;
    const normProSpan = (pSpan / sumSpans) * totalAvailableDegrees;

    // Start angle offset at 215 degrees so Basic appears at top-left
    const startOffset = 215;

    // Basic segment (Top-Left)
    const bStart = startOffset;
    const bEnd = bStart + normBasicSpan;
    const bSolvedFraction = basicTotal > 0 ? Math.min(1, Math.max(0, basicCompleted / basicTotal)) : 0;
    const bSolvedEnd = bStart + bSolvedFraction * normBasicSpan;

    // Core segment (Top through Right)
    const cStart = bEnd + gap;
    const cEnd = cStart + normCoreSpan;
    const cSolvedFraction = coreTotal > 0 ? Math.min(1, Math.max(0, coreCompleted / coreTotal)) : 0;
    const cSolvedEnd = cStart + cSolvedFraction * normCoreSpan;

    // Pro segment (Bottom-Left)
    const pStart = cEnd + gap;
    const pEnd = pStart + normProSpan;
    const pSolvedFraction = proTotal > 0 ? Math.min(1, Math.max(0, proCompleted / proTotal)) : 0;
    const pSolvedEnd = pStart + pSolvedFraction * normProSpan;

    return {
      basicArc: {
        trackPath: describeArc(50, 50, radius, bStart, bEnd),
        solvedPath: bSolvedFraction > 0 ? describeArc(50, 50, radius, bStart, bSolvedEnd) : null,
      },
      coreArc: {
        trackPath: describeArc(50, 50, radius, cStart, cEnd),
        solvedPath: cSolvedFraction > 0 ? describeArc(50, 50, radius, cStart, cSolvedEnd) : null,
      },
      proArc: {
        trackPath: describeArc(50, 50, radius, pStart, pEnd),
        solvedPath: pSolvedFraction > 0 ? describeArc(50, 50, radius, pStart, pSolvedEnd) : null,
      },
    };
  }, [basicTotal, coreTotal, proTotal, basicCompleted, coreCompleted, proCompleted, totalCount, totalAvailableDegrees, radius]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 h-full flex flex-col justify-between select-none">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 mb-3 sm:mb-2">
          <span className="text-[15px] font-semibold text-zinc-100">{title}</span>
          <div
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            title={tooltipText}
          >
            <Info className="h-4 w-4" />
          </div>
        </div>

        {/* Skeleton Body */}
        <div className="flex-1 flex items-center justify-center my-auto animate-pulse">
          <div className="flex flex-row items-center justify-around w-full gap-4 sm:gap-6 py-1">
            {/* Skeleton Circle */}
            <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-full border-[7px] border-zinc-800/60 bg-zinc-900/30 flex flex-col items-center justify-center shrink-0">
              <div className="h-6 w-10 bg-zinc-800/80 rounded-md mb-1" />
              <div className="h-3 w-14 bg-zinc-800/50 rounded" />
            </div>

            {/* Skeleton Breakdown Rows */}
            <div className="space-y-3 sm:space-y-3.5 min-w-[110px] sm:min-w-[120px]">
              {/* Basic Skeleton */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500/30 shrink-0" />
                  <div className="h-3.5 w-12 bg-zinc-800/80 rounded" />
                </div>
                <div className="pl-4.5 h-3 w-16 bg-zinc-800/50 rounded" />
              </div>

              {/* Core Skeleton */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-[2px] bg-amber-500/30 shrink-0" />
                  <div className="h-3.5 w-10 bg-zinc-800/80 rounded" />
                </div>
                <div className="pl-4.5 h-3 w-16 bg-zinc-800/50 rounded" />
              </div>

              {/* Pro Skeleton */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-[2px] bg-rose-500/30 shrink-0" />
                  <div className="h-3.5 w-8 bg-zinc-800/80 rounded" />
                </div>
                <div className="pl-4.5 h-3 w-16 bg-zinc-800/50 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 h-full flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-200 shadow-subtle select-none">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-3 sm:mb-2">
        <span className="text-[15px] font-semibold text-zinc-100">{title}</span>
        <div
          className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          title={tooltipText}
        >
          <Info className="h-4 w-4" />
        </div>
      </div>

      {/* Main Stats Body - Vertically Centered */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <div className="flex flex-row items-center justify-around w-full gap-4 sm:gap-6 py-1">
          {/* Multi-Segment Circular Gauge Chart */}
          <div className="relative flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center shrink-0">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Background Segment Tracks */}
              <path
                d={basicArc.trackPath}
                stroke="#1b3c2d"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                className="transition-colors duration-300"
              />
              <path
                d={coreArc.trackPath}
                stroke="#3b321a"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                className="transition-colors duration-300"
              />
              <path
                d={proArc.trackPath}
                stroke="#3d1d25"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                className="transition-colors duration-300"
              />

              {/* Active Solved Overlay Paths */}
              {basicArc.solvedPath && (
                <path
                  d={basicArc.solvedPath}
                  stroke="#22c55e"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              )}
              {coreArc.solvedPath && (
                <path
                  d={coreArc.solvedPath}
                  stroke="#eab308"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              )}
              {proArc.solvedPath && (
                <path
                  d={proArc.solvedPath}
                  stroke="#f43f5e"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              )}
            </svg>

            {/* Center Solved / Total Counts */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-[26px] sm:text-[28px] font-bold text-white tracking-tight leading-none font-mono">
                {totalSolved}
              </span>
              <span className="text-[11px] sm:text-[12px] text-zinc-400 mt-1 font-mono">
                / {totalCount}
              </span>
            </div>
          </div>

          {/* Difficulty Breakdown Indicators */}
          <div className="space-y-3 sm:space-y-3.5 min-w-[110px] sm:min-w-[120px]">
            {/* Basic */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400 shrink-0" />
                <span className="text-[13px] sm:text-[14px] font-semibold text-zinc-100">Basic</span>
              </div>
              <div className="pl-4.5 text-[12px] sm:text-[13px] text-zinc-400 font-mono">
                <span className="font-bold text-white">{basicCompleted}</span> / {basicTotal}
              </div>
            </div>

            {/* Core */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-amber-400 shrink-0" />
                <span className="text-[13px] sm:text-[14px] font-semibold text-zinc-100">Core</span>
              </div>
              <div className="pl-4.5 text-[12px] sm:text-[13px] text-zinc-400 font-mono">
                <span className="font-bold text-white">{coreCompleted}</span> / {coreTotal}
              </div>
            </div>

            {/* Pro */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-rose-500 shrink-0" />
                <span className="text-[13px] sm:text-[14px] font-semibold text-zinc-100">Pro</span>
              </div>
              <div className="pl-4.5 text-[12px] sm:text-[13px] text-zinc-400 font-mono">
                <span className="font-bold text-white">{proCompleted}</span> / {proTotal}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
