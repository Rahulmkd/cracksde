"use client";

import React, { useState } from "react";
import { ChevronDown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StepReviewTopics() {
  const [expandedReviewSubject, setExpandedReviewSubject] = useState<string>("dsa");
  const [expandedReviewTopic, setExpandedReviewTopic] = useState<string>("Arrays");

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-1">
        <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
          Review Your Personalized Roadmap
        </h1>
        <p className="text-[12px] font-normal leading-normal text-zinc-400">
          Inspect the curriculum structure and estimated topic hours tailored for your sprint.
        </p>
      </div>

      {/* Planned Hours Banner */}
      <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-950/20 px-3.5 py-2.5 text-[12px] text-blue-300 shadow-subtle">
        <Zap className="h-3.5 w-3.5 text-blue-400 shrink-0" />
        <span>
          We&apos;ve organized <strong className="text-blue-200 font-semibold font-mono">220.1 hours</strong> of structured learning across your selected tracks.
        </span>
      </div>

      {/* Tree Accordion */}
      <div className="space-y-2.5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-subtle">
          <div
            onClick={() =>
              setExpandedReviewSubject((prev) => (prev === "dsa" ? "" : "dsa"))
            }
            className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-zinc-900 transition-colors select-none"
          >
            <div className="flex items-center gap-2.5 text-[13px] font-medium text-zinc-200">
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
                  expandedReviewSubject === "dsa" ? "rotate-0" : "-rotate-90"
                )}
              />
              <span>Data Structures &amp; Algorithms</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">Est. 66h</span>
          </div>

          {expandedReviewSubject === "dsa" && (
            <div className="border-t border-zinc-800/80 bg-zinc-950/70 p-2.5 space-y-2">
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
                <div
                  onClick={() =>
                    setExpandedReviewTopic((prev) => (prev === "Arrays" ? "" : "Arrays"))
                  }
                  className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-zinc-900/80 transition-colors select-none"
                >
                  <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-300">
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 text-zinc-400 transition-transform duration-200",
                        expandedReviewTopic === "Arrays" ? "rotate-0" : "-rotate-90"
                      )}
                    />
                    <span>Arrays &amp; Strings Patterns</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">308 min</span>
                </div>

                {expandedReviewTopic === "Arrays" && (
                  <div className="border-t border-zinc-800/60 bg-zinc-950 p-2.5 space-y-1.5 text-[11px]">
                    <div className="pl-2.5 space-y-1 border-l border-zinc-800">
                      {[
                        "Majority Element (Boyer-Moore)",
                        "Kadane's Algorithm (Max Subarray)",
                        "Two Pointers & Trapping Rain Water",
                        "Sliding Window (Max Consecutive Ones)",
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-0.5 text-zinc-300 text-[11px]"
                        >
                          <span>{item}</span>
                          <Badge variant="blue" className="text-[10px] py-0 px-1 font-medium">
                            Core
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
