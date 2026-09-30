"use client";

import React from "react";
import Link from "next/link";
import type { RecentActivityItem } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { History, CheckCircle2, XCircle, ArrowRight, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileActivityListProps {
  activity: RecentActivityItem[];
}

export function ProfileActivityList({ activity }: ProfileActivityListProps) {
  const router = useRouter();

  const getDifficultyBadge = (difficulty?: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "medium":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400";
      case "hard":
        return "border-rose-500/30 bg-rose-500/10 text-rose-400";
      default:
        return "border-zinc-700 bg-zinc-800/60 text-zinc-300";
    }
  };

  const formatTimestamp = (dateStr?: string | null) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/40">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <History className="h-4 w-4 text-purple-400" />
            Recent Problem Solves &amp; Revisions
          </CardTitle>
          <p className="text-xs text-zinc-400 font-normal">
            Your most recent question solves and spaced repetition records
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-7 text-xs border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-zinc-100"
        >
          <Link href="/practice">
            Problem Bank <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-1">
        {activity.length === 0 ? (
          <EmptyState
            icon={Code2}
            title="No problem solves yet"
            description="Start practicing problems from the curriculum bank to build your study history and mastery streak."
            actionLabel="Start Practicing"
            onAction={() => router.push("/practice")}
            className="my-2"
          />
        ) : (
          <div className="space-y-2.5">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700/80 transition-colors gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-zinc-200 hover:text-blue-400 transition-colors">
                      {item.itemTitle}
                    </span>
                    {item.difficulty && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 font-medium ${getDifficultyBadge(
                          item.difficulty
                        )}`}
                      >
                        {item.difficulty}
                      </Badge>
                    )}
                    <span className="text-[11px] text-zinc-400">
                      • {item.subjectName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span>Solved {formatTimestamp(item.lastSolvedAt)}</span>
                    <span>• Solved {item.solveCount} time{item.solveCount > 1 ? "s" : ""}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {item.lastScore !== false ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] gap-1 px-2 py-0.5"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Passed
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-rose-500/30 bg-rose-500/10 text-rose-400 text-[11px] gap-1 px-2 py-0.5"
                    >
                      <XCircle className="h-3 w-3" />
                      Need Review
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
