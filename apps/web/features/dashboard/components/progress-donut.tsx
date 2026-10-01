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

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 space-y-4 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-zinc-100">{title}</span>
        <div
          className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          title={tooltipText}
        >
          <Info className="h-4 w-4" />
        </div>
      </div>

      {/* Main Stats Body */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2 sm:py-3">
        {/* Multi-Segment Circular Gauge Chart */}
        <div className="relative flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center shrink-0">
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
            <span className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-none font-mono">
              {totalSolved}
            </span>
            <span className="text-[12px] sm:text-[13px] text-zinc-400 mt-1 font-mono">
              / {totalCount}
            </span>
          </div>
        </div>

        {/* Difficulty Breakdown Indicators */}
        <div className="space-y-4 min-w-[130px] w-full sm:w-auto">
          {/* Basic */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-emerald-400 shrink-0" />
              <span className="text-[14px] font-semibold text-zinc-100">Basic</span>
            </div>
            <div className="pl-4.5 text-[13px] text-zinc-400 font-mono">
              <span className="font-bold text-white">{basicCompleted}</span> / {basicTotal}
            </div>
          </div>

          {/* Core */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-amber-400 shrink-0" />
              <span className="text-[14px] font-semibold text-zinc-100">Core</span>
            </div>
            <div className="pl-4.5 text-[13px] text-zinc-400 font-mono">
              <span className="font-bold text-white">{coreCompleted}</span> / {coreTotal}
            </div>
          </div>

          {/* Pro */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-rose-500 shrink-0" />
              <span className="text-[14px] font-semibold text-zinc-100">Pro</span>
            </div>
            <div className="pl-4.5 text-[13px] text-zinc-400 font-mono">
              <span className="font-bold text-white">{proCompleted}</span> / {proTotal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
