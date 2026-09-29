"use client";

import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PracticeProblemDto } from "../types";

interface PracticeTableRowProps {
  problem: PracticeProblemDto;
  onOpenProblem: (problem: PracticeProblemDto) => void;
}

export function getSubjectDisplayName(slug?: string, name?: string) {
  const s = (slug || "").toLowerCase();
  if (s === "dsa") return "DSA";
  if (s === "dbms") return "DBMS";
  if (s === "operating-systems" || s === "os") return "OS";
  if (s === "computer-networks" || s === "cn") return "CN";
  if (s === "oops") return "OOPs";
  if (s === "lld") return "LLD";
  return name || slug || "DSA";
}

export function getSubjectBadge(slug?: string, name?: string) {
  const s = (slug || "").toLowerCase();
  if (s === "dsa")
    return (
      <Badge variant="blue" className="font-medium text-[11px] py-0 px-1.5">
        DSA
      </Badge>
    );
  if (s === "dbms")
    return (
      <Badge variant="success" className="font-medium text-[11px] py-0 px-1.5">
        DBMS
      </Badge>
    );
  if (s === "operating-systems" || s === "os")
    return (
      <Badge variant="purple" className="font-medium text-[11px] py-0 px-1.5">
        OS
      </Badge>
    );
  if (s === "computer-networks" || s === "cn")
    return (
      <Badge variant="warning" className="font-medium text-[11px] py-0 px-1.5">
        CN
      </Badge>
    );
  if (s === "oops")
    return (
      <Badge variant="success" className="font-medium text-[11px] py-0 px-1.5">
        OOPs
      </Badge>
    );
  return (
    <Badge variant="cyan" className="font-medium text-[11px] py-0 px-1.5">
      {name || "LLD"}
    </Badge>
  );
}

export function getDifficultyBadge(diff: string) {
  const d = (diff || "Medium").toLowerCase();
  if (d.includes("basic") || d.includes("easy")) {
    return (
      <Badge variant="success" className="font-medium text-[11px] py-0 px-2">
        Easy
      </Badge>
    );
  }
  if (d.includes("pro") || d.includes("hard")) {
    return (
      <Badge variant="destructive" className="font-medium text-[11px] py-0 px-2">
        Hard
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="font-medium text-[11px] py-0 px-2">
      Medium
    </Badge>
  );
}

export function getRevisionBadge(problem: PracticeProblemDto) {
  if (!problem.solved && !problem.lastSolvedAt) {
    return <span className="text-zinc-600 font-mono text-[11px]">—</span>;
  }

  if (problem.userStatus === "due" || problem.isDue) {
    return (
      <span className="inline-flex items-center rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 font-mono">
        Today
      </span>
    );
  }

  if (!problem.nextRevisionAt) {
    return <span className="text-zinc-600 font-mono text-[11px]">—</span>;
  }

  const revDate = new Date(problem.nextRevisionAt);
  if (isNaN(revDate.getTime())) {
    return <span className="text-zinc-600 font-mono text-[11px]">—</span>;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    revDate.getFullYear(),
    revDate.getMonth(),
    revDate.getDate()
  );
  const diffDays = Math.round(
    (targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) {
    return (
      <span className="inline-flex items-center rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 font-mono">
        Today
      </span>
    );
  }

  if (diffDays === 1) {
    return (
      <span className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 font-mono">
        Tomorrow
      </span>
    );
  }

  const formattedDate = revDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  return (
    <span className="inline-flex items-center rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 font-mono">
      {formattedDate}
    </span>
  );
}

export function PracticeTableRow({ problem, onOpenProblem }: PracticeTableRowProps) {
  return (
    <div
      onClick={() => onOpenProblem(problem)}
      className="grid grid-cols-12 gap-3 items-center px-4 py-3 text-[13px] transition-colors hover:bg-zinc-900/80 cursor-pointer group"
    >
      {/* 1. Problem Column with checkmark directly beside title */}
      <div className="col-span-7 sm:col-span-5 flex items-center gap-2 overflow-hidden pr-2">
        {problem.solved ? (
          <Check className="h-4 w-4 text-emerald-400 stroke-[2.5] shrink-0" />
        ) : (
          <div className="h-4 w-4 shrink-0" />
        )}
        <span className="font-medium text-zinc-100 text-[13px] leading-snug group-hover:text-blue-400 transition-colors truncate">
          {problem.title}
        </span>
      </div>

      {/* 2. Subject · Topic Column */}
      <div className="col-span-3 hidden sm:flex flex-col justify-center min-w-0">
        <span className="text-[12px] font-medium text-zinc-200 leading-tight">
          {getSubjectDisplayName(problem.subjectSlug, problem.subject)}
        </span>
        <span className="text-[11px] text-zinc-500 truncate leading-tight mt-0.5">
          {problem.topic || problem.subtopic || "Core"}
        </span>
      </div>

      {/* 3. Difficulty Column (Easy / Medium / Hard only) */}
      <div className="col-span-2 flex justify-center">
        {getDifficultyBadge(problem.difficulty)}
      </div>

      {/* 4. Revision Column (Only timing: Tomorrow, 30 Sep, Today, or —) */}
      <div className="col-span-1 hidden sm:flex justify-center items-center">
        {getRevisionBadge(problem)}
      </div>

      {/* 5. Action Column */}
      <div className="col-span-3 sm:col-span-1 flex items-center justify-end pr-1">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onOpenProblem(problem);
          }}
          className="h-6 px-2.5 text-[11px] font-medium border-zinc-800 bg-zinc-900 group-hover:border-blue-500/40 group-hover:text-blue-400"
        >
          <span>Solve</span>
          <ChevronRight className="h-3 w-3 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
