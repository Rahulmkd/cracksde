"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Code2, AlertTriangle } from "lucide-react";
import { DailyPlanner } from "@/components/layout/daily-planner";
import {
  useRoadmapSubjects,
  useRoadmapSubjectDetail,
  useTopicQuestions,
  useSolveQuestion,
} from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SubjectTrackCard } from "./subject-track-card";
import { TopicDrawerModal } from "./topic-drawer-modal";
import { TopicQuestionsList } from "./topic-questions-list";
import { QuestionSolveModal } from "./question-solve-modal";
import { RevisionStatusCard } from "./revision-status-card";
import type { RoadmapItemDto, PrepHubOverallStats } from "../types";

export function PrepHubExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Navigation State from URL query
  const subjectSlugParam = searchParams.get("subject") || null;
  const topicSlugParam = searchParams.get("topic") || null;

  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string | null>(subjectSlugParam);
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string | null>(topicSlugParam);

  // Synchronize state with URL parameters
  useEffect(() => {
    setSelectedSubjectSlug(searchParams.get("subject") || null);
    setSelectedTopicSlug(searchParams.get("topic") || null);
  }, [searchParams]);

  const setNavigation = (subject: string | null, topic: string | null) => {
    setSelectedSubjectSlug(subject);
    setSelectedTopicSlug(topic);

    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (topic) params.set("topic", topic);

    const queryStr = params.toString();
    const newUrl = queryStr ? `/prep-hub?${queryStr}` : `/prep-hub`;
    router.push(newUrl);
  };

  // Queries
  const { data: subjects, isLoading: isLoadingSubjects } = useRoadmapSubjects();
  const { data: subjectDetail, isLoading: isLoadingSubjectDetail } = useRoadmapSubjectDetail(
    selectedSubjectSlug || ""
  );
  const { data: topicQuestionsData, isLoading: isLoadingQuestions } = useTopicQuestions(
    selectedSubjectSlug || "",
    selectedTopicSlug || ""
  );

  const solveMutation = useSolveQuestion();

  // Solve / Review Modal State
  const [activeReviewItem, setActiveReviewItem] = useState<RoadmapItemDto | null>(null);

  const handleOpenReviewModal = (item: RoadmapItemDto) => {
    setActiveReviewItem(item);
  };

  const handleRecordSolve = async (isCorrect: boolean, notes: string) => {
    if (!activeReviewItem) return;

    if (!isAuthenticated) {
      toast.error("Please log in to record progress and schedule revisions.");
      return;
    }

    try {
      const result = await solveMutation.mutateAsync({
        itemId: activeReviewItem.id,
        isCorrect,
        notes: notes.trim() || undefined,
      });

      if (isCorrect) {
        toast.success(`🎉 ${result.message}`);
      } else {
        toast.info(`⚠️ ${result.message}`);
      }
      setActiveReviewItem(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update progress");
    }
  };

  // Fast Quick-Solve Toggle
  const handleQuickSolve = async (item: RoadmapItemDto, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to track your revision progress.");
      return;
    }

    const nextIsCorrect = !(item.progress && item.progress.solveCount > 0 && !item.progress.isDue);

    try {
      const result = await solveMutation.mutateAsync({
        itemId: item.id,
        isCorrect: nextIsCorrect,
      });
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to update progress");
    }
  };

  // Current Subject Object
  const currentSubject = useMemo(() => {
    if (!selectedSubjectSlug || !subjects) return null;
    return subjects.find((s) => s.slug === selectedSubjectSlug) || null;
  }, [selectedSubjectSlug, subjects]);

  // Current Topic Object
  const currentTopic = useMemo(() => {
    if (!selectedTopicSlug || !subjectDetail) return null;
    return subjectDetail.topics.find((t) => t.slug === selectedTopicSlug) || null;
  }, [selectedTopicSlug, subjectDetail]);

  // Overall Stats across all subjects
  const overallStats: PrepHubOverallStats = useMemo(() => {
    if (!subjects) return { totalSubjects: 0, totalQuestions: 0, totalHours: 0, totalDue: 0, totalSolved: 0 };
    let totalQuestions = 0;
    let totalHours = 0;
    let totalDue = 0;
    let totalSolved = 0;

    for (const s of subjects) {
      totalQuestions += s.totalItems;
      totalHours += s.estimatedHours;
      totalDue += s.totalDue || 0;
      totalSolved += s.totalSolved || 0;
    }

    return {
      totalSubjects: subjects.length,
      totalQuestions,
      totalHours,
      totalDue,
      totalSolved,
    };
  }, [subjects]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* 2-Column Responsive Layout: Main Area (Left) + Right Sidebar (Daily Planner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8-9 COLS): PREP HUB FLOW */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* 1. Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-[12px] text-zinc-400">
            <button
              onClick={() => setNavigation(null, null)}
              className={cn(
                "hover:text-zinc-200 transition-colors flex items-center gap-1",
                !selectedSubjectSlug ? "font-semibold text-blue-400" : "text-zinc-400"
              )}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Prep Hub</span>
            </button>

            {selectedSubjectSlug && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                <button
                  onClick={() => setNavigation(selectedSubjectSlug, null)}
                  className={cn(
                    "hover:text-zinc-200 transition-colors truncate max-w-[200px]",
                    !selectedTopicSlug ? "font-semibold text-blue-400" : "text-zinc-400"
                  )}
                >
                  {currentSubject?.name || selectedSubjectSlug.toUpperCase()}
                </button>
              </>
            )}

            {selectedTopicSlug && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                <span className="font-semibold text-zinc-200 truncate max-w-[220px]">
                  {currentTopic?.name || selectedTopicSlug}
                </span>
              </>
            )}
          </div>

          {/* 2. Level 1: Subjects List View (Root) */}
          {!selectedSubjectSlug && (
            <div className="space-y-6">
              {/* Header Hero Card */}
              <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                  }}
                />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-3.5 max-w-xl">
                    <div className="space-y-1">
                      <h1 className="text-[20px] font-semibold tracking-tight text-zinc-100">
                        Prep Hub
                      </h1>
                      <p className="text-[12px] font-normal text-zinc-400 leading-normal">
                        Your complete knowledge base and practice roadmap across all core SDE interview subjects, powered by automated spaced repetition.
                      </p>
                    </div>

                    {/* Dynamic Statistics Row */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-0.5 text-[12px] text-zinc-400">
                      <div className="flex items-center gap-1.5 font-normal">
                        <BookOpen className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                        <span className="text-zinc-200 font-semibold text-[13px]">
                          {overallStats.totalSubjects || 6}
                        </span>
                        <span className="text-zinc-400 text-[12px]">Curated Subjects</span>
                      </div>

                      <span className="text-zinc-700 hidden sm:inline">&middot;</span>

                      <div className="flex items-center gap-1.5 font-normal">
                        <Code2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span className="text-zinc-200 font-semibold text-[13px]">
                          {overallStats.totalQuestions || 847}
                        </span>
                        <span className="text-zinc-400 text-[12px]">Curated Questions</span>
                      </div>

                      {overallStats.totalDue > 0 && (
                        <>
                          <span className="text-zinc-700 hidden sm:inline">&middot;</span>
                          <div className="flex items-center gap-1.5 font-normal text-amber-400">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span className="font-semibold text-[13px] text-amber-300">
                              {overallStats.totalDue}
                            </span>
                            <span className="text-amber-400 text-[12px]">Revision Due</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Header Metric Box */}
                  <div className="hidden md:flex items-center justify-center shrink-0 pr-2">
                    <div className="relative flex flex-col items-center p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-card">
                      <div className="h-14 w-24 rounded-lg border border-zinc-800 bg-zinc-900/90 flex flex-col items-center justify-center text-center p-1.5">
                        <span className="text-blue-400 font-semibold text-[14px]">
                          ⚡ {overallStats.totalQuestions || 847}
                        </span>
                        <span className="text-[11px] text-zinc-500">Curated Qs</span>
                      </div>
                      <div className="mt-1.5 text-[11px] text-zinc-500 font-normal">
                        Full Coverage
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects Tracks Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold tracking-tight text-zinc-100">
                    Explore Subjects
                  </h2>
                  <span className="text-[12px] text-zinc-500">
                    {subjects?.length || 0} Core Tracks
                  </span>
                </div>

                {isLoadingSubjects ? (
                  <div className="grid gap-3">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-20 rounded-xl border border-zinc-800/80 bg-zinc-900/20 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {subjects?.map((sub) => (
                      <SubjectTrackCard
                        key={sub.id}
                        subject={sub}
                        onSelect={(slug) => setNavigation(slug, null)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Level 2: Topics View */}
          {selectedSubjectSlug && !selectedTopicSlug && (
            <TopicDrawerModal
              subjectSlug={selectedSubjectSlug}
              currentSubject={currentSubject}
              subjectDetail={subjectDetail}
              isLoading={isLoadingSubjectDetail}
              onBack={() => setNavigation(null, null)}
              onSelectTopic={(topicSlug) => setNavigation(selectedSubjectSlug, topicSlug)}
            />
          )}

          {/* 4. Level 3: Questions View */}
          {selectedSubjectSlug && selectedTopicSlug && (
            <TopicQuestionsList
              currentSubject={currentSubject}
              currentTopic={currentTopic}
              topicQuestionsData={topicQuestionsData}
              isLoading={isLoadingQuestions}
              onBack={() => setNavigation(selectedSubjectSlug, null)}
              onOpenReviewModal={handleOpenReviewModal}
              onQuickSolve={handleQuickSolve}
              isSolvePending={solveMutation.isPending}
            />
          )}
        </div>

        {/* Right Sidebar: Daily Planner + Revision Status */}
        <aside className="lg:col-span-4 xl:col-span-3 w-full">
          <div className="sticky top-20 space-y-6">
            <DailyPlanner showProblemOfTheDay={false} />
            <RevisionStatusCard
              onSelectQuestion={(item) => {
                if (
                  item.subjectSlug &&
                  item.topicSlug &&
                  (item.subjectSlug !== selectedSubjectSlug || item.topicSlug !== selectedTopicSlug)
                ) {
                  setNavigation(item.subjectSlug, item.topicSlug);
                }
                handleOpenReviewModal(item);
              }}
            />
          </div>
        </aside>
      </div>

      {/* 5. Interactive Solve & Spaced Repetition Modal */}
      <QuestionSolveModal
        item={activeReviewItem}
        subjectSlug={selectedSubjectSlug}
        currentTopic={currentTopic}
        isOpen={Boolean(activeReviewItem)}
        onClose={() => setActiveReviewItem(null)}
        onRecordSolve={handleRecordSolve}
        isPending={solveMutation.isPending}
      />
    </div>
  );
}
