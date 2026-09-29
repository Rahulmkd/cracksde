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
    <div className="rounded-xl border border-zinc-800/80 bg-[#0c1017] p-4 sm:p-5 space-y-3.5 hover:border-zinc-700/80 transition-all duration-200 shadow-sm flex flex-col justify-between select-none">
      <span className="text-[14px] font-semibold text-zinc-100">Category-wise Progress</span>

      <div className="space-y-3 pt-0.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={cn("flex h-5 w-5 items-center justify-center rounded border shrink-0", cat.color)}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="text-[12px] font-medium text-zinc-200 truncate">{cat.name}</span>
                </div>

                <div className="text-[11px] font-medium text-zinc-400 font-mono shrink-0">
                  {cat.count}
                </div>
              </div>

              {/* Progress bar with track and custom color fill */}
              <div className="h-1 w-full rounded-full bg-zinc-800/80 overflow-hidden">
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

      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
        <span>4 core tracks</span>
        <Link
          href="/prep-hub"
          className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>Explore knowledge trees</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

