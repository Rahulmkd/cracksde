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
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserRevisions } from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { RoadmapItemDto, UserRevisionItemDto } from "@starter/shared";

interface RevisionStatusProps {
  onSelectQuestion?: (item: RoadmapItemDto) => void;
  className?: string;
}

export function RevisionStatus({ onSelectQuestion, className }: RevisionStatusProps) {
  const { isAuthenticated } = useAuth();
  const { data: revisionsData, isLoading } = useUserRevisions();
  const [activeTab, setActiveTab] = useState<"due" | "all">("due");

  const dueItems = revisionsData?.items.filter((it) => it.progress?.isDue) || [];
  const allItems = revisionsData?.items || [];
  const displayItems = activeTab === "due" ? dueItems : allItems;

  const dueCount = revisionsData?.dueCount || 0;
  const totalCount = revisionsData?.totalCount || 0;

  const renderBadge = (revisionText: string, isDue: boolean) => {
    if (isDue) {
      return (
        <Badge
          variant="destructive"
          className="text-[10px] font-medium py-0 px-1.5 flex items-center gap-1 animate-pulse"
        >
          <AlertTriangle className="h-2.5 w-2.5" />
          <span>Due</span>
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
          <span>Tomorrow</span>
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="text-[10px] font-medium py-0 px-1.5 text-blue-400 border-blue-500/20 bg-blue-500/10 flex items-center gap-1"
      >
        <Calendar className="h-2.5 w-2.5" />
        <span>{revisionText.replace("Next Revision: ", "")}</span>
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

        {dueCount > 0 ? (
          <Badge
            variant="destructive"
            className="text-[10px] font-medium py-0.5 px-2 flex items-center gap-1 font-mono"
          >
            <AlertTriangle className="h-2.5 w-2.5" />
            <span>{dueCount} Due</span>
          </Badge>
        ) : totalCount > 0 ? (
          <Badge
            variant="success"
            className="text-[10px] font-medium py-0.5 px-2 flex items-center gap-1 font-mono"
          >
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>Up to Date</span>
          </Badge>
        ) : null}
      </div>

      {/* Tabs Filter */}
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
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1",
              activeTab === "all"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <span>All Scheduled</span>
            <span className="font-mono text-[10px] px-1 rounded bg-zinc-800 text-zinc-400">
              {totalCount}
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
                    {renderBadge(item.progress?.revisionStatusText || "", isDue)}
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : activeTab === "due" && totalCount > 0 ? (
        <div className="py-4 text-center space-y-1 px-2 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
          <p className="text-[12px] font-medium text-zinc-200">No revisions due today</p>
          <p className="text-[10px] text-zinc-500">
            {totalCount} upcoming revisions scheduled in your spaced repetition plan.
          </p>
        </div>
      ) : (
        <div className="py-4 text-center space-y-1 px-2 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
          <TrendingUp className="h-4 w-4 text-blue-400 mx-auto" />
          <p className="text-[12px] font-medium text-zinc-200">No active revisions yet</p>
          <p className="text-[10px] text-zinc-500">
            Solve questions in PrepHub to start your spaced repetition cycle.
          </p>
        </div>
      )}
    </div>
  );
}
