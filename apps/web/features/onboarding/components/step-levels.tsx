"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StepLevelsProps {
  selectedSubjects: string[];
  subjectLevels: Record<string, string>;
  onSetSubjectLevel: (slug: string, level: string) => void;
}

const DSA_LEVELS = [
  {
    level: "Start from zero",
    desc: "I'm completely new to DSA and want to learn everything from the ground up.",
  },
  {
    level: "DSA Foundations",
    desc: "I know basic programming and want to build a strong foundation in DSA.",
  },
  {
    level: "Pattern Mastery",
    desc: "I've studied DSA before and want to master problem-solving patterns over 1-2 months.",
  },
  {
    level: "Quick Revision",
    desc: "I have 15-20 days and want focused high-frequency preparation for coding interviews.",
  },
];

const DBMS_LEVELS = [
  {
    level: "Learn in Depth",
    desc: "Understand every core concept thoroughly, including indexing, B+ trees, and transactions.",
  },
  {
    level: "Interview Preparation",
    desc: "Quickly cover the most frequently asked interview topics, queries, and ACID properties.",
  },
];

export function StepLevels({
  selectedSubjects,
  subjectLevels,
  onSetSubjectLevel,
}: StepLevelsProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-1">
        <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
          Select Your Starting Level
        </h1>
        <p className="text-[12px] font-normal leading-normal text-zinc-400">
          Choose the preparation depth and baseline for each selected subject.
        </p>
      </div>

      <div className="space-y-6">
        {/* DSA Levels */}
        {selectedSubjects.includes("dsa") && (
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Data Structures &amp; Algorithms
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {DSA_LEVELS.map((opt) => {
                const isSelected = subjectLevels["dsa"] === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => onSetSubjectLevel("dsa", opt.level)}
                    className={cn(
                      "flex gap-2.5 rounded-xl border p-3.5 cursor-pointer transition-all shadow-subtle select-none",
                      isSelected
                        ? "border-blue-500 bg-blue-600/10 text-zinc-100 ring-1 ring-blue-500/20"
                        : "border-zinc-800/90 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/80"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                        isSelected ? "border-blue-500 bg-blue-600" : "border-zinc-700 bg-zinc-900"
                      )}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-zinc-200">{opt.level}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 leading-normal">{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DBMS Levels */}
        {selectedSubjects.includes("dbms") && (
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Database Management Systems
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {DBMS_LEVELS.map((opt) => {
                const isSelected = subjectLevels["dbms"] === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => onSetSubjectLevel("dbms", opt.level)}
                    className={cn(
                      "flex gap-2.5 rounded-xl border p-3.5 cursor-pointer transition-all shadow-subtle select-none",
                      isSelected
                        ? "border-blue-500 bg-blue-600/10 text-zinc-100 ring-1 ring-blue-500/20"
                        : "border-zinc-800/90 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/80"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                        isSelected ? "border-blue-500 bg-blue-600" : "border-zinc-700 bg-zinc-900"
                      )}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-zinc-200">{opt.level}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 leading-normal">{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
