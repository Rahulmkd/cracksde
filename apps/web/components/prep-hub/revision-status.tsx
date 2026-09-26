"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserRevisions } from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { RoadmapItemDto } from "@starter/shared";

interface RevisionStatusProps {
  onSelectQuestion?: (item: RoadmapItemDto) => void;
  className?: string;
}

export function RevisionStatus({ onSelectQuestion, className }: RevisionStatusProps) {
  const { isAuthenticated } = useAuth();
  const { data: revisionsData, isLoading } = useUserRevisions();
  const [activeTab, setActiveTab] = useState<"due" | "upcoming" | "completed">("due");

  const dueItems = revisionsData?.items.filter((it) => it.progress?.isDue) || [];
  const upcomingItems =
    revisionsData?.items.filter((it) => !it.progress?.isDue && Boolean(it.progress?.nextRevisionAt)) || [];
  const completedItems =
    revisionsData?.items.filter((it) => (it.progress?.solveCount ?? 0) > 0) || [];

  const displayItems =
    activeTab === "due" ? dueItems : activeTab === "upcoming" ? upcomingItems : completedItems;

  const dueCount = dueItems.length;
  const upcomingCount = upcomingItems.length;
  const completedCount = completedItems.length;
  const totalCount = revisionsData?.totalCount || 0;

  // Earliest upcoming revision date
  const earliestUpcomingDate = upcomingItems[0]?.progress?.nextRevisionAt
    ? new Date(upcomingItems[0].progress.nextRevisionAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    : null;

  const renderBadge = (item: RoadmapItemDto) => {
    const isDue = item.progress?.isDue ?? false;
    const revisionText = item.progress?.revisionStatusText || "";

    if (isDue) {
      return (
        <Badge
          variant="destructive"
          className="text-[10px] font-medium py-0 px-1.5 flex items-center gap-1 animate-pulse"
        >
          <AlertTriangle className="h-2.5 w-2.5" />
          <span>Due Today</span>
        </Badge>
      );
    }

    if (revisionText === "Due Tomorrow") {
      return (
        <Badge
          variant="warning"
          className="text-[10px] font-medium py-0 px-1.5 flex items-center gap-1"
        >
          <Clock className="h-2.5 w-2.5 text-amber-400" />
          <span>Due Tomorrow</span>
        </Badge>
      );
    }

    if (item.progress?.nextRevisionAt) {
      const d = new Date(item.progress.nextRevisionAt);
      const day = d.getDate();
      const month = d.toLocaleString("en-US", { month: "short" });

      return (
        <Badge
          variant="outline"
          className="text-[10px] font-medium py-0 px-1.5 text-blue-400 border-blue-500/20 bg-blue-500/10 flex items-center gap-1"
        >
          <Calendar className="h-2.5 w-2.5" />
          <span>Next: {day} {month}</span>
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="text-[10px] font-medium py-0 px-1.5 text-emerald-400 border-emerald-500/20 bg-emerald-500/10 flex items-center gap-1"
      >
        <Check className="h-2.5 w-2.5" />
        <span>Completed</span>
      </Badge>
    );
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-subtle space-y-3.5 select-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <RotateCcw className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100">Revision Status</h3>
            <p className="text-[10px] text-zinc-500">Spaced Repetition Schedule</p>
          </div>
        </div>

        {/* Dynamic header badge: shows due count or next revision date instead of vague "Up to Date" */}
        {dueCount > 0 ? (
          <Badge
            variant="destructive"
            className="text-[10px] font-medium py-0.5 px-2 flex items-center gap-1 font-mono"
          >
            <AlertTriangle className="h-2.5 w-2.5" />
            <span>{dueCount} Due</span>
          </Badge>
        ) : earliestUpcomingDate ? (
          <Badge
            variant="outline"
            className="text-[10px] font-medium py-0.5 px-2 text-blue-400 border-blue-500/20 bg-blue-500/10 flex items-center gap-1 font-mono"
          >
            <Calendar className="h-2.5 w-2.5" />
            <span>Next: {earliestUpcomingDate}</span>
          </Badge>
        ) : upcomingCount > 0 ? (
          <Badge
            variant="outline"
            className="text-[10px] font-medium py-0.5 px-2 text-blue-400 border-blue-500/20 bg-blue-500/10 flex items-center gap-1 font-mono"
          >
            <span>{upcomingCount} Scheduled</span>
          </Badge>
        ) : null}
      </div>

      {/* 3 Categories / Tabs: Due Now | Upcoming | Completed */}
      {totalCount > 0 && (
        <div className="flex items-center gap-1 border-b border-zinc-800/80 pb-2 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab("due")}
            className={cn(
              "px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1",
              activeTab === "due"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <span>Due Now</span>
            {dueCount > 0 && (
              <span className="font-mono text-[10px] px-1 rounded bg-amber-500/20 text-amber-300">
                {dueCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1",
              activeTab === "upcoming"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <span>Upcoming</span>
            <span className="font-mono text-[10px] px-1 rounded bg-zinc-800 text-zinc-400">
              {upcomingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={cn(
              "px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1",
              activeTab === "completed"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <span>Completed</span>
            <span className="font-mono text-[10px] px-1 rounded bg-zinc-800 text-zinc-400">
              {completedCount}
            </span>
          </button>
        </div>
      )}

      {/* Revisions Content List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-14 rounded-lg border border-zinc-800/60 bg-zinc-900/30 animate-pulse"
            />
          ))}
        </div>
      ) : !isAuthenticated ? (
        <div className="py-4 text-center space-y-1.5 px-2">
          <Sparkles className="h-4 w-4 text-zinc-500 mx-auto" />
          <p className="text-[12px] font-medium text-zinc-300">Sign in to track revisions</p>
          <p className="text-[11px] text-zinc-500 leading-tight">
            Automated spaced repetition helps retain patterns and algorithms long-term.
          </p>
        </div>
      ) : displayItems.length > 0 ? (
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
          {displayItems.map((item) => {
            const isDue = item.progress?.isDue ?? false;

            return (
              <div
                key={item.id}
                onClick={() => onSelectQuestion?.(item)}
                className={cn(
                  "group p-2.5 rounded-lg border transition-all duration-200 cursor-pointer shadow-subtle",
                  isDue
                    ? "border-amber-500/30 bg-amber-500/[0.04] hover:border-amber-500/50 hover:bg-zinc-900/80"
                    : "border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700/80 hover:bg-zinc-900/60"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Left Info */}
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-medium text-blue-400 uppercase tracking-wider">
                        {item.subjectSlug || "DSA"}
                      </span>
                      <span className="text-zinc-600 text-[10px]">&middot;</span>
                      <span className="text-[10px] text-zinc-400 truncate max-w-[110px]">
                        {item.topicName}
                      </span>
                    </div>

                    <h4 className="text-[12px] font-medium text-zinc-100 group-hover:text-blue-400 transition-colors leading-snug line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span className="font-mono">{item.progress?.solveCount}x reviewed</span>
                      {item.progress?.lastSolvedAt && (
                        <>
                          <span>&middot;</span>
                          <span>
                            Last:{" "}
                            {new Date(item.progress.lastSolvedAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Status & Action */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {renderBadge(item)}
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : activeTab === "due" ? (
        /* Helpful empty state when nothing is due today */
        <div className="py-4 text-center space-y-1.5 px-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
          <p className="text-[12px] font-medium text-emerald-400">✓ No revisions due today</p>
          <p className="text-[11px] text-zinc-400">
            {earliestUpcomingDate
              ? `Next revision: ${earliestUpcomingDate}`
              : upcomingCount > 0
              ? `${upcomingCount} revisions scheduled`
              : "All questions up to date"}
          </p>
        </div>
      ) : (
        <div className="py-4 text-center space-y-1 px-2 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
          <TrendingUp className="h-4 w-4 text-blue-400 mx-auto" />
          <p className="text-[12px] font-medium text-zinc-200">No {activeTab} questions</p>
          <p className="text-[10px] text-zinc-500">
            Solve questions in PrepHub to start your spaced repetition schedule.
          </p>
        </div>
      )}
    </div>
  );
}
