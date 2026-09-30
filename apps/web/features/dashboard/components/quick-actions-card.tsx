"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { PopularTopicItem } from "../types";

interface QuickActionsCardProps {
  topics: PopularTopicItem[];
}

export function QuickActionsCard({ topics }: QuickActionsCardProps) {
  return (
    <div className="space-y-3 pt-1 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[16px] font-bold tracking-tight text-white">
          <span className="text-blue-400 text-sm">✦</span>
          <h2>Explore Popular Topics</h2>
        </div>
        <Link
          href="/practice"
          className="text-[12px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>View all topics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.title}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3.5 hover:border-zinc-700/80 hover:bg-zinc-900/70 transition-all duration-200 group flex flex-col justify-between shadow-subtle"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                  {topic.category}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {topic.problems} items
                </span>
              </div>

              <h3 className="text-[15px] font-bold text-zinc-100 group-hover:text-blue-400 transition-colors leading-snug">
                {topic.title}
              </h3>

              <p className="text-[13px] font-normal text-zinc-400 leading-relaxed line-clamp-2">
                {topic.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[12px]">
              <span className="text-[11px] text-zinc-500 font-medium">{topic.badge}</span>
              <Link
                href={topic.link}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5 text-[12px] group-hover:translate-x-0.5 transition-transform"
              >
                <span>Practice</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

