"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Code2,
  Monitor,
  Layers,
  Database,
  ChevronRight,
  Users,
  BookOpen,
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Search,
  Filter,
  Calendar,
  BarChart2,
  FolderOpen,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { DailyPlanner } from "@/components/layout/daily-planner";
import { RevisionStatus } from "@/components/prep-hub/revision-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useRoadmapSubjects,
  useRoadmapSubjectDetail,
  useTopicQuestions,
  useSolveQuestion,
} from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type {
  RoadmapSubjectSummaryDto,
  RoadmapTopicDto,
  RoadmapItemDto,
  UserItemProgressDto,
} from "@starter/shared";

// Subject Visual Icon & Theme Mapper
const SUBJECT_THEMES: Record<
  string,
  {
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    iconBorder: string;
    badgeVariant: "cyan" | "amber" | "purple" | "blue" | "success" | "destructive";
  }
> = {
  dsa: {
    icon: Code2,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-500/20",
    badgeVariant: "cyan",
  },
  lld: {
    icon: Monitor,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    badgeVariant: "amber",
  },
  "system-design": {
    icon: Monitor,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    badgeVariant: "amber",
  },
  "operating-systems": {
    icon: Layers,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    badgeVariant: "purple",
  },
  "core-subjects": {
    icon: Layers,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    badgeVariant: "purple",
  },
  dbms: {
    icon: Database,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    badgeVariant: "blue",
  },
  "data-engineering": {
    icon: Database,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    badgeVariant: "blue",
  },
  oops: {
    icon: BookOpen,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    badgeVariant: "success",
  },
  "computer-networks": {
    icon: Activity,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-500/20",
    badgeVariant: "destructive",
  },
};

function getSubjectTheme(slug: string) {
  return (
    SUBJECT_THEMES[slug.toLowerCase()] || {
      icon: Code2,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      iconBorder: "border-blue-500/20",
      badgeVariant: "blue",
    }
  );
}

function PrepHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Navigation State from URL query or local state
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

  // Search & Filter State inside Topic / Subject view
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterRevision, setFilterRevision] = useState<string>("all");

  // Solve / Review Modal State
  const [activeReviewItem, setActiveReviewItem] = useState<RoadmapItemDto | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleOpenReviewModal = (item: RoadmapItemDto) => {
    setActiveReviewItem(item);
    setReviewNotes(item.progress?.notes || "");
  };

  const handleRecordSolve = async (isCorrect: boolean) => {
    if (!activeReviewItem) return;

    if (!isAuthenticated) {
      toast.error("Please log in to record progress and schedule revisions.");
      return;
    }

    try {
      const result = await solveMutation.mutateAsync({
        itemId: activeReviewItem.id,
        isCorrect,
        notes: reviewNotes.trim() || undefined,
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

  // Filtered Questions List
  const filteredQuestions = useMemo(() => {
    if (!topicQuestionsData?.questions) return [];
    return topicQuestionsData.questions.filter((q) => {
      const matchSearch =
        !searchQuery ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.subtopicName && q.subtopicName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDifficulty =
        filterDifficulty === "all" ||
        (q.difficulty && q.difficulty.toLowerCase() === filterDifficulty.toLowerCase());

      const matchRevision =
        filterRevision === "all" ||
        (filterRevision === "due" && q.progress?.isDue) ||
        (filterRevision === "solved" && (q.progress?.solveCount ?? 0) > 0) ||
        (filterRevision === "unsolved" && (!q.progress || (q.progress.solveCount ?? 0) === 0));

      return matchSearch && matchDifficulty && matchRevision;
    });
  }, [topicQuestionsData?.questions, searchQuery, filterDifficulty, filterRevision]);

  // Overall Stats across all subjects
  const overallStats = useMemo(() => {
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

  // Helper for rendering Revision Status Badge
  const renderRevisionBadge = (
    revisionText?: string,
    isDue?: boolean,
    solveCount?: number
  ) => {
    if (isDue) {
      return (
        <Badge
          variant="destructive"
          className="font-medium text-[11px] py-0 px-2 flex items-center gap-1 animate-pulse"
        >
          <AlertTriangle className="h-3 w-3" />
          <span>Revision Due</span>
        </Badge>
      );
    }

    if (!solveCount || solveCount === 0 || revisionText === "Not Solved Yet") {
      return (
        <Badge
          variant="outline"
          className="font-normal text-[11px] py-0 px-2 text-zinc-500 border-zinc-800 bg-zinc-950/40"
        >
          Not Solved Yet
        </Badge>
      );
    }

    if (revisionText === "Due Tomorrow") {
      return (
        <Badge
          variant="warning"
          className="font-medium text-[11px] py-0 px-2 flex items-center gap-1"
        >
          <Clock className="h-3 w-3 text-amber-400" />
          <span>Due Tomorrow</span>
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="font-medium text-[11px] py-0 px-2 text-blue-400 border-blue-500/20 bg-blue-500/10 flex items-center gap-1"
      >
        <Calendar className="h-3 w-3" />
        <span>{revisionText}</span>
      </Badge>
    );
  };

  // Helper for rendering Topic Overall Status Badge
  const renderTopicOverallBadge = (
    hasRevisionDue?: boolean,
    statusText?: string,
    dueCount?: number
  ) => {
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
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* 2-Column Responsive Layout: Main Area (Left) + Right Sidebar (Daily Planner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* MAIN COLUMN (LEFT / 8-9 COLS): PREP HUB FLOW */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* ===================================================================== */}
          {/* 1. BREADCRUMBS NAVIGATION */}
          {/* ===================================================================== */}
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

          {/* ===================================================================== */}
          {/* 2. LEVEL 1: SUBJECTS LIST VIEW (Root) */}
          {/* ===================================================================== */}
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
                    {subjects?.map((sub) => {
                      const theme = getSubjectTheme(sub.slug);
                      const Icon = theme.icon;

                      return (
                        <div
                          key={sub.id}
                          onClick={() => setNavigation(sub.slug, null)}
                          className="group block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 sm:p-4 hover:border-zinc-700/80 hover:bg-zinc-900/70 transition-all duration-200 shadow-subtle cursor-pointer select-none"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                            {/* Left: Colored Icon + Subject Info */}
                            <div className="flex items-start sm:items-center gap-3.5 overflow-hidden">
                              <div
                                className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border ${theme.iconBg} ${theme.iconBorder} ${theme.iconColor} shrink-0 transition-transform group-hover:scale-105 duration-200`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>

                              {/* Subject Text Details */}
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-[14px] font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                                    {sub.name}
                                  </h3>
                                  <span className="text-[11px] text-zinc-500 hidden sm:inline">
                                    • {sub.estimatedHours}h
                                  </span>
                                  {sub.hasRevisionDue && (
                                    <Badge
                                      variant="destructive"
                                      className="text-[10px] font-medium py-0 px-1.5 flex items-center gap-1"
                                    >
                                      <AlertTriangle className="h-2.5 w-2.5" />
                                      <span>{sub.totalDue} Revision Due</span>
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[12px] font-normal leading-normal text-zinc-400 line-clamp-1 sm:line-clamp-2">
                                  {sub.description || `Comprehensive track covering ${sub.totalTopics} modules and ${sub.totalItems} questions.`}
                                </p>
                              </div>
                            </div>

                            {/* Right: Stats Count + Chevron */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60 pl-2">
                              <div className="flex items-center gap-3 text-[12px] text-zinc-400">
                                <div>
                                  <span className="font-semibold text-zinc-200 font-mono">
                                    {sub.totalTopics}
                                  </span>{" "}
                                  <span>Topics</span>
                                </div>
                                <span className="text-zinc-700">&middot;</span>
                                <div>
                                  <span className="font-semibold text-zinc-200 font-mono">
                                    {sub.totalItems}
                                  </span>{" "}
                                  <span>Qs</span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all duration-200" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* 3. LEVEL 2: TOPICS VIEW (Subject selected, Topic not yet selected) */}
          {/* ===================================================================== */}
          {selectedSubjectSlug && !selectedTopicSlug && (
            <div className="space-y-6">
              {/* Subject Header Banner */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-subtle space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setNavigation(null, null)}
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
                      <span>{subjectDetail?.name || currentSubject?.name}</span>
                      {subjectDetail?.hasRevisionDue && (
                        <Badge variant="destructive" className="text-[11px] font-medium py-0 px-2">
                          Revision Due
                        </Badge>
                      )}
                    </h1>
                    <p className="text-[12px] text-zinc-400 max-w-2xl leading-relaxed">
                      {subjectDetail?.description || currentSubject?.description || "Select a topic below to review concepts and practice interview problems with spaced repetition."}
                    </p>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[12px] flex items-center gap-2">
                      <span className="text-zinc-400">Solved:</span>
                      <span className="font-mono font-semibold text-zinc-100">
                        {subjectDetail?.totalSolved || 0} / {subjectDetail?.topics.reduce((acc, t) => acc + (t.totalQuestions || 0), 0) || 0}
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

                {isLoadingSubjectDetail ? (
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
                          onClick={() => setNavigation(selectedSubjectSlug, topic.slug)}
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
                                  {renderTopicOverallBadge(
                                    topic.hasRevisionDue,
                                    topic.revisionStatusText,
                                    topic.dueQuestions
                                  )}
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
          )}

          {/* ===================================================================== */}
          {/* 4. LEVEL 3: QUESTIONS VIEW (Subject & Topic selected) */}
          {/* ===================================================================== */}
          {selectedSubjectSlug && selectedTopicSlug && (
            <div className="space-y-6">
              {/* Topic Header & Revision Status Bar */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-subtle space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setNavigation(selectedSubjectSlug, null)}
                        className="h-7 px-2 text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 -ml-2"
                      >
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                        <span>Back to {currentSubject?.name || "Topics"}</span>
                      </Button>
                      <span className="text-zinc-700">&middot;</span>
                      <span className="text-[12px] font-mono text-zinc-400">
                        {topicQuestionsData?.topic.estimatedMinutes || 0} mins
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <h1 className="text-[20px] font-semibold text-zinc-100">
                        {topicQuestionsData?.topic.name || currentTopic?.name || selectedTopicSlug}
                      </h1>
                      {renderTopicOverallBadge(
                        topicQuestionsData?.topic.hasRevisionDue,
                        topicQuestionsData?.topic.revisionStatusText,
                        topicQuestionsData?.topic.dueQuestions
                      )}
                    </div>
                    <p className="text-[12px] text-zinc-400 leading-normal">
                      Solve and review questions to advance your spaced repetition intervals (1d → 3d → 7d → 14d → 30d).
                    </p>
                  </div>

                  {/* Topic Progress Statistics */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-[12px] flex items-center gap-2">
                      <span className="text-zinc-400">Solved:</span>
                      <span className="font-mono font-semibold text-zinc-100">
                        {topicQuestionsData?.topic.solvedQuestions || 0} / {topicQuestionsData?.topic.totalQuestions || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters & Search Control Bar */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-3 shadow-subtle">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search question title or concept..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                  {/* Revision Filter */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-zinc-500 text-[11px] font-medium mr-1 flex items-center gap-1">
                      <Filter className="h-3 w-3" /> Status:
                    </span>
                    {[
                      { label: "All", val: "all" },
                      { label: "Due for Revision", val: "due" },
                      { label: "Solved", val: "solved" },
                      { label: "Unsolved", val: "unsolved" },
                    ].map((f) => (
                      <button
                        key={f.val}
                        type="button"
                        onClick={() => setFilterRevision(f.val)}
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                          filterRevision === f.val
                            ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                            : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Difficulty Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 text-[11px]">Level:</span>
                    <select
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.target.value)}
                      className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="basic">Basic / Easy</option>
                      <option value="core">Core / Medium</option>
                      <option value="pro">Pro / Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Questions Table / List */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-6 sm:col-span-5">Question / Concept</div>
                  <div className="col-span-3 sm:col-span-4">Revision Status</div>
                  <div className="col-span-2 text-right pr-2">Action</div>
                </div>

                {/* Table Rows */}
                {isLoadingQuestions ? (
                  <div className="divide-y divide-zinc-800/40">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="h-14 bg-zinc-900/20 animate-pulse" />
                    ))}
                  </div>
                ) : filteredQuestions.length > 0 ? (
                  <div className="divide-y divide-zinc-800/40">
                    {filteredQuestions.map((q) => {
                      const isSolved = (q.progress?.solveCount ?? 0) > 0;
                      const isDue = q.progress?.isDue ?? false;

                      return (
                        <div
                          key={q.id}
                          className={cn(
                            "grid grid-cols-12 gap-3 items-center px-4 py-3 text-[13px] transition-colors hover:bg-zinc-900/70 group",
                            isDue && "bg-amber-500/[0.03]",
                            isSolved && !isDue && "bg-zinc-950/20"
                          )}
                        >
                          {/* 1. Status Checkbox / Quick Toggle */}
                          <div className="col-span-1 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={(e) => handleQuickSolve(q, e)}
                              disabled={solveMutation.isPending}
                              title={
                                isSolved
                                  ? `Solved ${q.progress?.solveCount}x (Click to review)`
                                  : "Mark as solved"
                              }
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                                isSolved
                                  ? isDue
                                    ? "border-amber-500 bg-amber-500 text-black font-bold"
                                    : "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-zinc-700 bg-zinc-900 hover:border-blue-500"
                              )}
                            >
                              {isSolved && <Check className="h-3 w-3 stroke-[3]" />}
                            </button>
                          </div>

                          {/* 2. Title & Subtopic */}
                          <div className="col-span-6 sm:col-span-5 flex flex-col justify-center overflow-hidden">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "font-medium text-zinc-100 text-[13px] truncate group-hover:text-blue-400 transition-colors",
                                  isSolved && !isDue && "text-zinc-300"
                                )}
                              >
                                {q.title}
                              </span>
                              {q.difficulty && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] font-mono py-0 px-1 border-zinc-800 text-zinc-400 hidden sm:inline"
                                >
                                  {q.difficulty}
                                </Badge>
                              )}
                            </div>

                            <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                              {q.subtopicName && (
                                <span className="text-zinc-400 truncate">{q.subtopicName}</span>
                              )}
                              {q.type && (
                                <>
                                  <span>&middot;</span>
                                  <span>{q.type}</span>
                                </>
                              )}
                              {q.progress && q.progress.solveCount > 0 && (
                                <>
                                  <span>&middot;</span>
                                  <span className="text-zinc-400 font-mono">
                                    {q.progress.solveCount}x reviewed
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* 3. Revision Status Column */}
                          <div className="col-span-3 sm:col-span-4 flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                              {renderRevisionBadge(
                                q.progress?.revisionStatusText,
                                q.progress?.isDue,
                                q.progress?.solveCount
                              )}
                            </div>
                            {q.progress?.lastSolvedAt && (
                              <span className="text-[10px] text-zinc-500 mt-0.5">
                                Last:{" "}
                                {new Date(q.progress.lastSolvedAt).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            )}
                          </div>

                          {/* 4. Action Button */}
                          <div className="col-span-2 flex items-center justify-end pr-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenReviewModal(q)}
                              className={cn(
                                "h-6 px-2.5 text-[11px] font-medium border-zinc-800 bg-zinc-900 group-hover:border-blue-500/40 group-hover:text-blue-400",
                                isDue && "border-amber-500/40 text-amber-300 bg-amber-500/10"
                              )}
                            >
                              <span>{isSolved ? "Review" : "Solve"}</span>
                              <ChevronRight className="h-3 w-3 ml-0.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-1.5">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <p className="text-[12px] font-medium text-zinc-300">No questions found</p>
                    <p className="text-[11px] text-zinc-500">
                      Try clearing active search or filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* RIGHT SIDEBAR (3-4 COLS): SHARED DAILY PLANNER + REVISION STATUS */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3 w-full">
          <div className="sticky top-20 space-y-6">
            <DailyPlanner showProblemOfTheDay={false} />
            <RevisionStatus
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

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE SOLVE & SPACED REPETITION MODAL */}
      {/* ========================================================================= */}
      {activeReviewItem && (
        <Dialog open={!!activeReviewItem} onOpenChange={() => setActiveReviewItem(null)}>
          <DialogContent className="max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100 shadow-dialog">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="text-[10px] font-mono py-0 px-1.5">
                  {selectedSubjectSlug?.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400">
                  {activeReviewItem.subtopicName || currentTopic?.name}
                </Badge>
              </div>

              <DialogTitle className="text-[16px] font-semibold leading-tight text-zinc-100">
                {activeReviewItem.title}
              </DialogTitle>
              <DialogDescription className="text-[12px] text-zinc-400">
                Record your practice result to automatically advance your spaced repetition schedule.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-[12px]">
              {/* Spaced Repetition Roadmap Timeline */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-zinc-300 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                    Spaced Repetition Schedule
                  </span>
                  <span className="text-zinc-500 font-mono">
                    Current: {activeReviewItem.progress?.solveCount || 0} solves
                  </span>
                </div>

                {/* 5-Step Interval Badges */}
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {[
                    { step: 1, interval: "1 Day" },
                    { step: 2, interval: "3 Days" },
                    { step: 3, interval: "7 Days" },
                    { step: 4, interval: "14 Days" },
                    { step: 5, interval: "30 Days" },
                  ].map((s) => {
                    const currentCount = activeReviewItem.progress?.solveCount || 0;
                    const isPassed = currentCount >= s.step;
                    const isCurrent = currentCount + 1 === s.step;

                    return (
                      <div
                        key={s.step}
                        className={cn(
                          "rounded-lg border p-1.5 transition-colors",
                          isCurrent
                            ? "border-blue-500 bg-blue-500/10 text-blue-300 font-semibold"
                            : isPassed
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-800 bg-zinc-950/60 text-zinc-500"
                        )}
                      >
                        <div className="font-mono">{s.step}st</div>
                        <div className="text-[9px] mt-0.5 opacity-90">{s.interval}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-400">
                  Notes / Key Learnings (Optional):
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Remember to handle edge cases with negative numbers..."
                  rows={3}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-[12px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 resize-none font-normal"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleRecordSolve(true)}
                  disabled={solveMutation.isPending}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-all cursor-pointer text-center group"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[13px]">
                    <Check className="h-4 w-4" />
                    <span>Got it Correct</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 mt-0.5">
                    Advance to next revision interval
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRecordSolve(false)}
                  disabled={solveMutation.isPending}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all cursor-pointer text-center group"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[13px]">
                    <RotateCcw className="h-4 w-4" />
                    <span>Needs Review</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80 mt-0.5">
                    Schedule earlier revision (1 day)
                  </span>
                </button>
              </div>
            </div>

            <DialogFooter className="border-t border-zinc-800/80 pt-3 flex justify-between sm:justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveReviewItem(null)}
                className="h-8 text-[12px] text-zinc-400 hover:text-zinc-200"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function PrepHubPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 pb-12">
          <div className="h-28 rounded-xl border border-zinc-800/80 bg-zinc-900/20 animate-pulse" />
        </div>
      }
    >
      <PrepHubContent />
    </Suspense>
  );
}
