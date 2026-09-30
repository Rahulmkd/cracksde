"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryProgress } from "../types";

interface SubjectProgressBarProps {
  categories: CategoryProgress[];
}

export function SubjectProgressBar({ categories }: SubjectProgressBarProps) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 space-y-3.5 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 shadow-subtle flex flex-col justify-between select-none">
      <span className="text-[15px] font-bold text-zinc-100">Category-wise Progress</span>

      <div className="space-y-3.5 pt-0.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-lg border shrink-0", cat.color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-zinc-200 truncate">{cat.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-medium text-zinc-400 font-mono">
                    {cat.count}
                  </span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-zinc-950/80 border border-zinc-800 rounded text-zinc-400">
                    {cat.percent}%
                  </span>
                </div>
              </div>

              {/* Progress bar with track and custom color fill */}
              <div className="h-1.5 w-full rounded-full bg-zinc-800/80 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    cat.barColor || "bg-blue-500"
                  )}
                  style={{ width: `${Math.max(cat.percent, cat.count?.startsWith("0") ? 0 : 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-[12px] text-zinc-400">
        <span>4 core tracks</span>
        <Link
          href="/prep-hub"
          className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>Explore knowledge trees</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

