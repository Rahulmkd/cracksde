"use client";

import React from "react";
import { ArrowLeft, ChevronRight, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { RoadmapSubjectDetailDto, RoadmapTopicDto, RoadmapSubjectSummaryDto } from "../types";

interface TopicDrawerModalProps {
  subjectSlug: string;
  currentSubject: RoadmapSubjectSummaryDto | null;
  subjectDetail: RoadmapSubjectDetailDto | undefined;
  isLoading: boolean;
  onBack: () => void;
  onSelectTopic: (topicSlug: string) => void;
}

export function TopicOverallBadge({
  hasRevisionDue,
  statusText,
  dueCount,
}: {
  hasRevisionDue?: boolean;
  statusText?: string;
  dueCount?: number;
}) {
  if (hasRevisionDue || (dueCount && dueCount > 0)) {
    return (
      <Badge
        variant="destructive"
        className="font-medium text-[11px] py-0 px-2 flex items-center gap-1"
      >
        <AlertTriangle className="h-3 w-3" />
        <span>Revision Due {dueCount ? `(${dueCount})` : ""}</span>
      </Badge>
    );
  }

  if (statusText === "Up to Date") {
    return (
      <Badge
        variant="success"
        className="font-medium text-[11px] py-0 px-2 flex items-center gap-1"
      >
        <CheckCircle2 className="h-3 w-3" />
        <span>Up to Date</span>
      </Badge>
    );
  }

  if (statusText === "In Progress") {
    return (
      <Badge
        variant="blue"
        className="font-medium text-[11px] py-0 px-2 flex items-center gap-1"
      >
        <Activity className="h-3 w-3" />
        <span>In Progress</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="font-normal text-[11px] py-0 px-2 text-zinc-400 border-zinc-800 bg-zinc-950/40"
    >
      Not Started
    </Badge>
  );
}

export function TopicDrawerModal({
  subjectSlug,
  currentSubject,
  subjectDetail,
  isLoading,
  onBack,
  onSelectTopic,
}: TopicDrawerModalProps) {
  return (
    <div className="space-y-6">
      {/* Subject Header Banner */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onBack}
                className="h-7 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 -ml-2"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                <span>All Subjects</span>
              </Button>
              <span className="text-zinc-700">&middot;</span>
              <span className="text-[12px] font-mono text-blue-400">
                {subjectDetail?.estimatedHours || currentSubject?.estimatedHours || 0}h Curriculum
              </span>
            </div>

            <h1 className="text-[20px] font-semibold text-zinc-100 flex items-center gap-2.5">
              <span>{subjectDetail?.name || currentSubject?.name || subjectSlug.toUpperCase()}</span>
              {subjectDetail?.hasRevisionDue && (
                <Badge variant="destructive" className="text-[11px] font-medium py-0 px-2">
                  Revision Due
                </Badge>
              )}
            </h1>
            <p className="text-[12px] text-zinc-400 max-w-2xl leading-relaxed">
              {subjectDetail?.description ||
                currentSubject?.description ||
                "Select a topic below to review concepts and practice interview problems with spaced repetition."}
            </p>
          </div>

          {/* Summary Metric Badges */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[12px] flex items-center gap-2">
              <span className="text-zinc-400">Solved:</span>
              <span className="font-mono font-semibold text-zinc-100">
                {subjectDetail?.totalSolved || 0} /{" "}
                {subjectDetail?.topics.reduce((acc, t) => acc + (t.totalQuestions || 0), 0) || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-zinc-100">
            Topics &amp; Practice Sets
          </h2>
          <span className="text-[12px] text-zinc-500">
            {subjectDetail?.topics.length || 0} Topics Available
          </span>
        </div>

        {isLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-24 rounded-xl border border-zinc-800/80 bg-zinc-900/20 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {subjectDetail?.topics.map((topic) => {
              const totalQ = topic.totalQuestions || 0;
              const solvedQ = topic.solvedQuestions || 0;
              const progressPct = totalQ > 0 ? Math.round((solvedQ / totalQ) * 100) : 0;

              return (
                <div
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.slug)}
                  className={cn(
                    "group block rounded-xl border p-4 transition-all duration-200 shadow-subtle cursor-pointer select-none",
                    topic.hasRevisionDue
                      ? "border-amber-500/30 bg-amber-500/[0.03] hover:border-amber-500/50 hover:bg-zinc-900/70"
                      : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700/80 hover:bg-zinc-900/70"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      {/* Left: Topic Title & Subtopics */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-[14px] font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                            {topic.name}
                          </h3>
                          <TopicOverallBadge
                            hasRevisionDue={topic.hasRevisionDue}
                            statusText={topic.revisionStatusText}
                            dueCount={topic.dueQuestions}
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                          <span>{totalQ} Questions</span>
                          <span>&middot;</span>
                          <span className="font-mono">{topic.estimatedMinutes} mins</span>
                          {topic.subtopics.length > 0 && (
                            <>
                              <span>&middot;</span>
                              <span className="text-zinc-500">
                                {topic.subtopics.length} Subtracks:{" "}
                                {topic.subtopics
                                  .slice(0, 3)
                                  .map((st) => st.name)
                                  .join(", ")}
                                {topic.subtopics.length > 3 ? "..." : ""}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: Solved Count & Chevron */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[12px] font-mono font-semibold text-zinc-200">
                            {solvedQ} / {totalQ}
                          </span>
                          <span className="text-[11px] text-zinc-500 ml-1">Solved</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all duration-200" />
                      </div>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="space-y-1">
                      <Progress value={progressPct} className="h-1.5 bg-zinc-800" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
