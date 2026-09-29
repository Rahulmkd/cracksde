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
        <div className="flex items-center gap-2 text-[15px] sm:text-[16px] font-bold tracking-tight text-zinc-100">
          <span className="text-blue-400 text-sm">✦</span>
          <h2>Explore Popular Topics</h2>
        </div>
        <Link
          href="/practice"
          className="text-[12px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>View all topics</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {topics.map((topic) => (
          <div
            key={topic.title}
            className="rounded-xl border border-zinc-800/80 bg-[#0c1017] p-4 space-y-3 hover:border-zinc-700/80 hover:bg-[#0e141f] transition-all duration-200 group flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                  {topic.category}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {topic.problems} items
                </span>
              </div>

              <h3 className="text-[14px] font-bold text-zinc-100 group-hover:text-blue-400 transition-colors leading-snug">
                {topic.title}
              </h3>

              <p className="text-[12px] font-normal text-zinc-400 leading-normal line-clamp-2">
                {topic.desc}
              </p>
            </div>

            <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
              <span className="text-[11px] text-zinc-500 font-normal">{topic.badge}</span>
              <Link
                href={topic.link}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5 text-[12px] group-hover:translate-x-0.5 transition-transform"
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

