"use client";

import React from "react";
import Link from "next/link";
import type { SubjectProgressBreakdown } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

interface ProfileSubjectProgressProps {
  subjects: SubjectProgressBreakdown[];
}

const SUBJECT_THEMES: Record<
  string,
  { color: string; bg: string; badge: string }
> = {
  dsa: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    badge: "border-blue-500/30 text-blue-400",
  },
  dbms: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    badge: "border-amber-500/30 text-amber-400",
  },
  "operating-systems": {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    badge: "border-emerald-500/30 text-emerald-400",
  },
  "computer-networks": {
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    badge: "border-purple-500/30 text-purple-400",
  },
  oops: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    badge: "border-rose-500/30 text-rose-400",
  },
  lld: {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    badge: "border-cyan-500/30 text-cyan-400",
  },
};

export function ProfileSubjectProgress({ subjects }: ProfileSubjectProgressProps) {
  return (
    <Card className="border-zinc-800/80 bg-zinc-900/40">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400" />
            Curriculum Mastery Breakdown
          </CardTitle>
          <p className="text-xs text-zinc-400 font-normal">
            Track your preparation completion across core technical tracks
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-7 text-xs border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-zinc-100"
        >
          <Link href="/prep-hub">
            Explore Prep Hub <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {subjects.map((sub) => {
            const theme = SUBJECT_THEMES[sub.slug] || {
              color: "text-zinc-300",
              bg: "bg-zinc-800",
              badge: "border-zinc-700 text-zinc-300",
            };

            return (
              <div
                key={sub.subjectId}
                className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700/80 transition-colors space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${theme.bg} ${theme.badge}`}
                    >
                      {sub.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-medium text-zinc-300">
                    {sub.percentage}%
                  </span>
                </div>

                <Progress
                  value={sub.percentage}
                  className="h-2 bg-zinc-900"
                />

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                  <span className="flex items-center gap-1 font-normal">
                    <CheckCircle2 className="h-3 w-3 text-zinc-400" />
                    {sub.solvedItems} / {sub.totalItems} completed
                  </span>
                  <Link
                    href={`/prep-hub`}
                    className="text-blue-400 hover:underline hover:text-blue-300 text-[11px] font-medium"
                  >
                    Practice track →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
