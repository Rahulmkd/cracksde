"use client";

import React from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { CategoryProgress } from "../types";

interface SubjectProgressBarProps {
  categories: CategoryProgress[];
}

export function SubjectProgressBar({ categories }: SubjectProgressBarProps) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2.5 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle flex flex-col justify-between">
      <span className="text-[14px] font-semibold text-zinc-100">Category-wise Progress</span>

      <div className="space-y-2 pt-0.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="space-y-1 rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-2 hover:bg-zinc-900/60 transition-colors"
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
              <Progress value={cat.percent} className="h-1" />
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
        <span>4 core tracks</span>
        <Link href="/prep-hub" className="text-blue-400 hover:text-blue-300 font-medium">
          Explore knowledge trees &rarr;
        </Link>
      </div>
    </div>
  );
}
