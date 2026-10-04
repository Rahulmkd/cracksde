"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookOpen, ChevronRight, AlertTriangle } from "lucide-react";
import { DailyPlanner } from "@/components/layout/daily-planner";
import { Badge } from "@/components/ui/badge";
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
import { RevisionStatusCard } from "./revision-status-card";
import { ProblemNoteModal } from "@/features/practice/components/random-problem-card";
import type { PracticeProblemDto } from "@/features/practice/types";
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

  // Active Problem Note Modal State (Reusing Practice Page Table Modal)
  const [activeProblem, setActiveProblem] = useState<PracticeProblemDto | null>(null);

  const handleOpenProblem = (item: RoadmapItemDto) => {
    const isSolved = (item.progress?.solveCount ?? 0) > 0;
    setActiveProblem({
      id: String(item.id),
      itemId: item.id,
      itemNo: item.itemNo || item.id,
      title: item.title,
      slug: item.slug || String(item.id),
      type: item.type || "problem",
      difficulty: item.difficulty || "medium",
      estimatedMinutes: item.estimatedMinutes || 20,
      subject: currentSubject?.name || item.subjectName || item.subjectSlug?.toUpperCase() || "DSA",
      subjectSlug: currentSubject?.slug || item.subjectSlug || "dsa",
      topic: currentTopic?.name || item.topicName || item.topicSlug || "Core",
      topicSlug: currentTopic?.slug || item.topicSlug || "core",
      subtopic: item.subtopicName || undefined,
      solved: isSolved,
      bookmarked: false,
      userStatus: item.progress?.isDue ? "due" : isSolved ? "solved" : "not_solved",
      userStatusText: item.progress?.isDue ? "Due Today" : isSolved ? "Solved" : "Not Solved",
      solveCount: item.progress?.solveCount ?? 0,
      revisionStatusText: item.progress?.revisionStatusText || "",
      isDue: item.progress?.isDue ?? false,
      lastSolvedAt: item.progress?.lastSolvedAt,
      nextRevisionAt: item.progress?.nextRevisionAt,
      progress: item.progress,
    });
  };

  const handleSaveProblemNotes = async (markAsSolved: boolean, notes: string) => {
    if (!activeProblem) return;

    if (!isAuthenticated) {
      toast.error("Please log in to record progress and notes.");
      return;
    }

    try {
      const result = await solveMutation.mutateAsync({
        itemId: activeProblem.itemId,
        isCorrect: markAsSolved,
        notes: notes.trim() || undefined,
      });

      if (markAsSolved && !activeProblem.solved) {
        toast.success(`🎉 Problem solved! Notes saved`);
      } else if (!markAsSolved && activeProblem.solved) {
        toast.info("Problem marked as unsolved.");
      } else {
        toast.success("Notes saved successfully!");
      }
      setActiveProblem(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update progress");
    }
  };

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
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* 2-Column Responsive Layout: Main Area (Left) + Right Sidebar (Daily Planner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8-9 COLS): PREP HUB FLOW */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
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
            <div className="space-y-4">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-0.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-[20px] font-bold leading-tight tracking-tight text-zinc-100">
                      Prep Hub
                    </h1>
                    <Badge variant="blue" className="text-[10px] font-semibold py-0.5 px-2 font-mono rounded-md">
                      {overallStats.totalQuestions || 847} Curated Qs
                    </Badge>
                  </div>
                  <p className="text-[12px] font-normal text-zinc-400 leading-normal">
                    Complete roadmap across all core SDE interview subjects, powered by automated spaced repetition.
                  </p>
                </div>

                {/* Metric Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="h-8 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 text-[12px] flex items-center gap-1.5 shadow-subtle font-mono">
                    <span className="text-zinc-400 font-normal">Tracks:</span>
                    <strong className="text-blue-400 font-semibold text-[12px]">
                      {overallStats.totalSubjects || 6}
                    </strong>
                  </div>

                  <div className="h-8 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 text-[12px] flex items-center gap-1.5 shadow-subtle font-mono">
                    <span className="text-zinc-400 font-normal">Solved:</span>
                    <strong className="text-emerald-400 font-semibold text-[12px]">
                      {overallStats.totalSolved || 0}
                    </strong>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-400 font-normal">
                      {overallStats.totalQuestions || 847}
                    </span>
                  </div>

                  {overallStats.totalDue > 0 && (
                    <div className="h-8 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 text-[12px] flex items-center gap-1.5 text-amber-300 shadow-subtle font-mono">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      <span className="font-semibold text-[12px] text-amber-300">
                        {overallStats.totalDue}
                      </span>
                      <span className="text-amber-400/90 text-[11px] font-sans">Due</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subjects Tracks Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold tracking-tight text-zinc-100">
                    Core Tracks
                  </h2>
                  <span className="text-[12px] font-mono text-zinc-500">
                    {subjects?.length || 0} Tracks Available
                  </span>
                </div>

                {isLoadingSubjects ? (
                  <div className="grid gap-2.5">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div
                        key={n}
                        className="h-20 rounded-xl border border-zinc-800/80 bg-zinc-900/20 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-2.5">
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
              onOpenProblem={handleOpenProblem}
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
                handleOpenProblem(item);
              }}
            />
          </div>
        </aside>
      </div>

      {/* 5. Practice Problem Note Modal Reused */}
      <ProblemNoteModal
        problem={activeProblem}
        isOpen={Boolean(activeProblem)}
        onClose={() => setActiveProblem(null)}
        onSaveNotes={handleSaveProblemNotes}
        isPending={solveMutation.isPending}
      />
    </div>
  );
}
