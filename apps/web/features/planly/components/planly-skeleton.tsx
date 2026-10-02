"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PlanlySkeletonProps {
  className?: string;
}

export function PlanlySkeleton({ className }: PlanlySkeletonProps) {
  return (
    <div
      className={cn(
        "space-y-6 pb-12 select-none animate-in fade-in-50 duration-200",
        className
      )}
      aria-busy="true"
      aria-label="Loading study plan..."
    >
      {/* 2-Column Responsive Layout matching real Planly layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: MAIN PLANNER SKELETON */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* 1. Header Section Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-0.5">
            <div className="space-y-2">
              {/* Breadcrumb shimmer */}
              <div className="flex items-center gap-2">
                <div className="h-3 w-12 bg-zinc-800/80 rounded animate-pulse" />
                <span className="text-zinc-700 text-xs">/</span>
                <div className="h-3 w-20 bg-zinc-800/80 rounded animate-pulse" />
              </div>

              {/* Title shimmer */}
              <div className="flex items-center gap-2">
                <div className="h-6 w-44 bg-zinc-800/90 rounded-lg animate-pulse" />
                <div className="h-4 w-4 bg-zinc-800/60 rounded animate-pulse" />
              </div>

              {/* Sub-row buttons / pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                <div className="h-6 w-28 bg-zinc-900 border border-zinc-800 rounded-md animate-pulse" />
                <div className="h-5 w-20 bg-blue-950/40 border border-blue-500/20 rounded-full animate-pulse" />
                <div className="h-4 w-36 bg-zinc-900/80 rounded animate-pulse" />
              </div>
            </div>

            {/* Action Buttons shimmer */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-24 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse" />
              <div className="h-8 w-24 bg-rose-950/20 border border-rose-900/30 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* 2. Sprint Metrics Panel Skeleton */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 shadow-subtle">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { labelWidth: "w-24", valWidth: "w-14", subWidth: "w-16" },
                { labelWidth: "w-20", valWidth: "w-16", subWidth: "w-20" },
                { labelWidth: "w-28", valWidth: "w-12", subWidth: "w-20" },
                { labelWidth: "w-24", valWidth: "w-16", subWidth: "w-12" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3.5 w-3.5 bg-zinc-800/80 rounded-full animate-pulse" />
                    <div className={cn("h-3 bg-zinc-800/80 rounded animate-pulse", item.labelWidth)} />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <div className={cn("h-5 bg-zinc-800/90 rounded animate-pulse", item.valWidth)} />
                    <div className={cn("h-3 bg-zinc-800/60 rounded animate-pulse", item.subWidth)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Sprint Timeline Cards Skeleton List */}
          <div className="space-y-3">
            {/* Sprint 1 Card Skeleton (Expanded Preview) */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3.5 space-y-3 shadow-subtle overflow-hidden">
              {/* Sprint Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 bg-zinc-950 animate-pulse" />
                  <div className="h-5 w-16 bg-blue-500/15 border border-blue-500/20 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-zinc-800/80 rounded animate-pulse" />
                </div>
                <div className="h-4 w-40 bg-zinc-800/70 rounded animate-pulse" />
              </div>

              {/* Indented Tree (Sprint -> Days -> Topics) */}
              <div className="relative border-l-2 border-blue-500/20 ml-1.5 pl-3 pt-1 space-y-3">
                {/* Day 1 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-900/30 border border-blue-500/30 animate-pulse" />
                      <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                    </div>
                    <div className="h-3 w-20 bg-zinc-800/60 rounded animate-pulse" />
                  </div>

                  {/* Tasks under Day 1 */}
                  <div className="border-l border-zinc-800/80 ml-0.5 pl-3 py-0.5 space-y-2">
                    {[1, 2, 3].map((t) => (
                      <div
                        key={t}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800/40"
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          <div className="h-3.5 w-3.5 rounded-full bg-zinc-800 animate-pulse shrink-0" />
                          <div
                            className={cn(
                              "h-3.5 bg-zinc-800/80 rounded animate-pulse",
                              t === 1 ? "w-48" : t === 2 ? "w-64" : "w-36"
                            )}
                          />
                        </div>
                        <div className="h-3 w-16 bg-zinc-800/60 rounded animate-pulse shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day 2 (Collapsed) */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-zinc-800/80 border border-zinc-700/60 animate-pulse" />
                    <div className="h-4 w-16 bg-zinc-800/80 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-20 bg-zinc-800/60 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sprint 2 Card Skeleton (Collapsed) */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3.5 space-y-3 shadow-subtle">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 bg-zinc-950 animate-pulse" />
                  <div className="h-5 w-16 bg-zinc-800/60 border border-zinc-700/40 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-zinc-800/80 rounded animate-pulse" />
                </div>
                <div className="h-4 w-36 bg-zinc-800/70 rounded animate-pulse" />
              </div>
            </div>

            {/* Sprint 3 Card Skeleton (Collapsed) */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3.5 space-y-3 shadow-subtle">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 bg-zinc-950 animate-pulse" />
                  <div className="h-5 w-16 bg-zinc-800/60 border border-zinc-700/40 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-zinc-800/80 rounded animate-pulse" />
                </div>
                <div className="h-4 w-36 bg-zinc-800/70 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: DAILY PLANNER SIDEBAR SKELETON */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3 w-full">
          <div className="sticky top-20 space-y-4">
            {/* Daily Planner Card Skeleton */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 shadow-subtle">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-blue-500/40 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 bg-zinc-900 border border-zinc-800 rounded-md animate-pulse" />
                  <div className="h-6 w-6 bg-zinc-900 border border-zinc-800 rounded-md animate-pulse" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full rounded-full bg-zinc-800/80 overflow-hidden">
                <div className="h-full w-1/3 bg-emerald-500/40 rounded-full animate-pulse" />
              </div>

              {/* Task list items */}
              <div className="space-y-2 pt-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-800/70 bg-zinc-950/60"
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      <div className="h-3.5 w-3.5 rounded-full bg-zinc-800 animate-pulse shrink-0" />
                      <div
                        className={cn(
                          "h-3 bg-zinc-800/80 rounded animate-pulse",
                          i === 1 ? "w-28" : i === 2 ? "w-36" : "w-20"
                        )}
                      />
                    </div>
                    <div className="h-3 w-10 bg-zinc-800/60 rounded animate-pulse shrink-0" />
                  </div>
                ))}
              </div>

              {/* Add task button skeleton */}
              <div className="h-8 w-full rounded-xl border border-dashed border-zinc-800/80 bg-zinc-950/40 flex items-center justify-center animate-pulse">
                <div className="h-3 w-16 bg-zinc-800/60 rounded" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
