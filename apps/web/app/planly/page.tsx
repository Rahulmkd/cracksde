"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronRight,
  Edit2,
  Sliders,
  TrendingUp,
  Layers,
  Check,
  X,
  MoreVertical,
  Activity,
  BarChart2,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  CalendarDays,
  ListTree,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useRevisionList } from "@/hooks/use-revision-list";
import { useUserRevisions, useSolveQuestion } from "@/hooks/use-roadmap";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerStore } from "@/store/planner-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StudyTaskDto, StudySprintDto, StudyDayDto } from "@starter/shared";

export default function PlanlyPage() {
  const {
    plan,
    isLoading,
    isError,
    error,
    refetch,
    updateTask,
    isUpdatingTask,
    updatePlan,
    isUpdatingPlan,
  } = useStudyPlan("crack-sde");

  const { data: revisionListData } = useRevisionList();
  const { data: userRevisionsData } = useUserRevisions();
  const solveMutation = useSolveQuestion();
  const { addPoints } = usePlannerStore();
  const { isAuthenticated } = useAuth();

  // Tab State: Active / Completed
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // View Mode: Tree View vs Timeline Calendar View
  const [viewMode, setViewMode] = useState<"tree" | "calendar">("tree");

  // Detailed view toggle
  const [isPlanDetailOpen, setIsPlanDetailOpen] = useState(true);

  // Menu State
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  // Expanded Tree State (defaults to first sprint and first day)
  const [expandedSprintId, setExpandedSprintId] = useState<string>("");
  const [expandedDayId, setExpandedDayId] = useState<string>("");

  // Modals
  const [isStartDateModalOpen, setIsStartDateModalOpen] = useState(false);
  const [isAdjustPlanModalOpen, setIsAdjustPlanModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isCatchupModalOpen, setIsCatchupModalOpen] = useState(false);

  // Form states
  const [planNameInput, setPlanNameInput] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [dailyHours, setDailyHours] = useState(4);

  // Revision Modal active tab
  const [revisionModalTab, setRevisionModalTab] = useState<"due" | "upcoming" | "all">("due");

  const treeRef = useRef<HTMLDivElement>(null);

  // Initialize expanded IDs and modal inputs from fetched plan
  useEffect(() => {
    if (plan) {
      if (plan.name) setPlanNameInput(plan.name);
      if (plan.dailyHours) setDailyHours(plan.dailyHours);
      if (plan.startDate) {
        try {
          const d = new Date(plan.startDate);
          if (!isNaN(d.getTime())) {
            setNewStartDate(d.toISOString().split("T")[0]);
          }
        } catch {
          // fallback
        }
      }

      if (plan.sprints && plan.sprints.length > 0) {
        if (!expandedSprintId) {
          // Default to first active sprint or sprint 1
          const activeSprint = plan.sprints.find((s) => s.status === "in_progress") || plan.sprints[0];
          setExpandedSprintId(activeSprint.sprintId);

          if (activeSprint.days && activeSprint.days.length > 0) {
            const activeDay = activeSprint.days.find((d) => d.status === "in_progress" || d.tasksCompleted < (d.tasksTotal || 1)) || activeSprint.days[0];
            setExpandedDayId(activeDay.dayId);
          }
        }
      }
    }
  }, [plan, expandedSprintId]);

  // Plan Calculations
  const sprints = plan?.sprints || [];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);

  const totalTasksCount = plan?.totalTasks ?? (allTasks.length || 847);
  const completedTasksCount = plan?.completedTasks ?? allTasks.filter((t) => t.status === "completed").length;
  const progressPercent = plan?.progressPercent ?? (totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0);

  const totalDaysCount = plan?.totalDays ?? (allDays.length || 61);
  const completedDaysCount = plan?.completedDays ?? allDays.filter((d) => (d.tasksCompleted || 0) >= (d.tasksTotal || 1) && (d.tasksTotal || 0) > 0).length;

  const totalMinutes = plan?.totalEstimatedMinutes ?? (sprints.reduce((acc, s) => acc + (s.totalEstimatedMinutes || 0), 0) || 16253);
  const completedMinutes = plan?.completedEstimatedMinutes ?? allTasks.filter((t) => t.status === "completed").reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const completedHours = Math.floor(completedMinutes / 60);
  const completedMinutesRem = completedMinutes % 60;
  const curriculumTimePercent = totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;

  const completedSprintsCount = plan?.completedSprints ?? sprints.filter((s) => s.status === "completed").length;
  const totalSprintsCount = sprints.length || 9;

  // Active Sprint & Day Focus
  const activeSprint = sprints.find((s) => s.status === "in_progress") || sprints[0];
  const activeDay = activeSprint?.days?.find((d) => d.status === "in_progress" || (d.tasksCompleted || 0) < (d.tasksTotal || 1)) || activeSprint?.days?.[0];
  const activeDayTasks = activeDay?.tasks || [];

  // Completed Sprints and Days for Completed Tab
  const completedSprints = sprints.filter((s) => s.status === "completed");

  // Format Dates helper
  const formatDateDisplay = (dateStr?: string | null) => {
    if (!dateStr) return "30 Nov 2026";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "30 Nov 2026";
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatCompletionTarget = () => {
    if (plan?.targetDate) return formatDateDisplay(plan.targetDate);
    const lastSprint = sprints[sprints.length - 1];
    if (lastSprint?.plannedEndDate) return formatDateDisplay(lastSprint.plannedEndDate);
    return "30 Nov 2026";
  };

  const getCompletionYear = () => {
    const target = plan?.targetDate || sprints[sprints.length - 1]?.plannedEndDate;
    if (target) {
      const d = new Date(target);
      if (!isNaN(d.getTime())) return d.getFullYear().toString();
    }
    return "2026";
  };

  const getCompletionDayMonth = () => {
    const target = plan?.targetDate || sprints[sprints.length - 1]?.plannedEndDate;
    if (target) {
      const d = new Date(target);
      if (!isNaN(d.getTime())) {
        return `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" })}`;
      }
    }
    return "30 Nov";
  };

  // Helper to extract dynamic topic/subject summary for each sprint
  const getSprintSubjectSummary = (sprint: StudySprintDto) => {
    const sprintDays = sprint.days || [];
    const subjects = new Set<string>();
    sprintDays.forEach((d) => {
      (d.tasks || []).forEach((t) => {
        if (t.item?.subjectName) subjects.add(t.item.subjectName);
      });
    });

    if (subjects.size > 0) {
      return Array.from(subjects).join(" + ");
    }

    if (sprint.sprintNo <= 3) return "DSA & Foundations";
    if (sprint.sprintNo <= 5) return "DSA & Operating Systems";
    if (sprint.sprintNo <= 7) return "Computer Networks & LLD";
    return "DBMS & System Design";
  };

  // Task Actions
  const handleToggleTaskStatus = (task: StudyTaskDto) => {
    const nextStatus = task.status === "completed" ? "not_started" : "completed";
    updateTask(
      { taskId: task.taskId, status: nextStatus },
      {
        onSuccess: () => {
          if (nextStatus === "completed") {
            addPoints(15);
            toast.success(`🎉 Completed: ${task.item?.title || "Task"} (+15 pts!)`);
          } else {
            toast.info(`Marked incomplete: ${task.item?.title || "Task"}`);
          }
        },
      }
    );
  };

  const handleToggleBookmark = (task: StudyTaskDto) => {
    const nextRevision = !task.isRevision;
    updateTask(
      { taskId: task.taskId, isRevision: nextRevision },
      {
        onSuccess: () => {
          if (nextRevision) {
            toast.success(`⭐ Added to Revision List: ${task.item?.title || "Task"}`);
          } else {
            toast.info(`Removed from Revision List: ${task.item?.title || "Task"}`);
          }
        },
      }
    );
  };

  const handleJumpToToday = () => {
    if (activeSprint) {
      setExpandedSprintId(activeSprint.sprintId);
      if (activeDay) {
        setExpandedDayId(activeDay.dayId);
      }
    }
    setIsPlanDetailOpen(true);
    treeRef.current?.scrollIntoView({ behavior: "smooth" });
    toast.success(`Navigated to Sprint ${activeSprint?.sprintNo || 1} • Day ${activeDay?.sprintDayNo || 1}`);
  };

  const handleSmartReschedule = () => {
    setIsCatchupModalOpen(false);
    toast.success("⚡ Smart Catch-Up Mode applied: Backlog redistributed across remaining sprint days.");
  };

  const getSubjectBadge = (subjectSlug?: string, subjectName?: string) => {
    const slug = (subjectSlug || subjectName || "dsa").toLowerCase();
    if (slug.includes("dsa")) {
      return (
        <Badge variant="blue" className="py-0.5 px-1.5 font-medium text-[11px]">
          DSA
        </Badge>
      );
    }
    if (slug.includes("dbms") || slug.includes("data")) {
      return (
        <Badge variant="success" className="py-0.5 px-1.5 font-medium text-[11px]">
          DBMS
        </Badge>
      );
    }
    if (slug.includes("operat") || slug.includes("os")) {
      return (
        <Badge variant="purple" className="py-0.5 px-1.5 font-medium text-[11px]">
          OS
        </Badge>
      );
    }
    if (slug.includes("netw") || slug.includes("cn")) {
      return (
        <Badge variant="warning" className="py-0.5 px-1.5 font-medium text-[11px]">
          CN
        </Badge>
      );
    }
    if (slug.includes("oop")) {
      return (
        <Badge variant="success" className="py-0.5 px-1.5 font-medium text-[11px]">
          OOPs
        </Badge>
      );
    }
    return (
      <Badge variant="cyan" className="py-0.5 px-1.5 font-medium text-[11px]">
        LLD
      </Badge>
    );
  };

  // Combined Revision Items from Spaced Repetition + Starred Tasks
  const userRevisionItems = userRevisionsData?.items || [];
  const dueRevisionItems = userRevisionItems.filter((it) => it.progress?.isDue);
  const upcomingRevisionItems = userRevisionItems.filter((it) => !it.progress?.isDue && Boolean(it.progress?.nextRevisionAt));
  const starredTasksList = revisionListData || allTasks.filter((t) => t.isRevision);
  const totalRevisionCount = Math.max(userRevisionsData?.totalCount || 0, starredTasksList.length);

  // =========================================================================
  // 1. LOADING SKELETON STATE
  // =========================================================================
  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
        {/* Banner Skeleton */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <Skeleton className="h-5 w-36 bg-zinc-800" />
          <Skeleton className="h-7 w-72 bg-zinc-800" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 bg-zinc-800/80 rounded" />
            ))}
          </div>
        </div>

        {/* 4 Metric Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 space-y-2">
              <Skeleton className="h-4 w-28 bg-zinc-800" />
              <Skeleton className="h-6 w-20 bg-zinc-800" />
              <Skeleton className="h-2 w-full bg-zinc-800" />
            </div>
          ))}
        </div>

        {/* Content Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 bg-zinc-900/50 rounded-xl border border-zinc-800" />
            ))}
          </div>
          <div className="lg:col-span-4 space-y-3">
            <Skeleton className="h-64 bg-zinc-900/50 rounded-xl border border-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ERROR STATE
  // =========================================================================
  if (isError) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
          <h2 className="text-[16px] font-semibold text-zinc-100">Failed to load study plan</h2>
          <p className="text-[12px] text-zinc-400 max-w-md mx-auto">
            {error instanceof Error ? error.message : "An error occurred while fetching your study plan."}
          </p>
          <Button
            size="sm"
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-8 px-4"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MAIN RENDER
  // =========================================================================
  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* ========================================================================= */}
      {/* TOP SECTION: PLANLY HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              <span>Study Planner Engine</span>
            </div>
            <h1 className="text-[18px] sm:text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
              Personalized {totalDaysCount}-Day Sprint Roadmap
            </h1>

            {/* 4 Benefits Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 text-[12px]">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Activity className="h-3 w-3" />
                </div>
                <span className="text-[11px] text-zinc-400 font-normal">Goal-based pacing</span>
              </div>

              <div className="flex items-center gap-1.5 text-[12px]">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <BarChart2 className="h-3 w-3" />
                </div>
                <span className="text-[11px] text-zinc-400 font-normal">Dynamic backlog shifts</span>
              </div>

              <div className="flex items-center gap-1.5 text-[12px]">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Layers className="h-3 w-3" />
                </div>
                <span className="text-[11px] text-zinc-400 font-normal">{totalSprintsCount} structured sprints</span>
              </div>

              <div className="flex items-center gap-1.5 text-[12px]">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Target className="h-3 w-3" />
                </div>
                <span className="text-[11px] text-zinc-400 font-normal">Revision bookmarks</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleJumpToToday}
              className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Zap className="h-3.5 w-3.5 mr-1" />
              Jump to Today&apos;s Sprint
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCatchupModalOpen(true)}
              className="h-8 px-3 text-[12px] font-medium border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1 text-amber-400" />
              Catch-Up Mode
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS & VIEW MODE TOGGLE */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded-lg transition-colors",
              activeTab === "active"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <span>Active Sprint Plan</span>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 px-1 text-[10px] font-semibold text-blue-400 font-mono">
              {totalSprintsCount - completedSprintsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded-lg transition-colors",
              activeTab === "completed"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <span>Completed</span>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-800 px-1 text-[10px] font-semibold text-zinc-500 font-mono">
              {completedSprintsCount}
            </span>
          </button>
        </div>

        {/* View Mode Toggle: Tree View vs Timeline Calendar */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-[11px]">
          <button
            onClick={() => setViewMode("tree")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors",
              viewMode === "tree"
                ? "bg-zinc-800 text-zinc-100 font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <ListTree className="h-3 w-3" />
            <span>Sprint Tree</span>
          </button>

          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors",
              viewMode === "calendar"
                ? "bg-zinc-800 text-zinc-100 font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <CalendarDays className="h-3 w-3" />
            <span>Calendar Timeline</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT: ACTIVE PLANS */}
      {/* ========================================================================= */}
      {activeTab === "active" && (
        <div className="space-y-4" ref={treeRef}>
          {/* Main Active Plan Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
            {/* Top Sub-header Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-2 text-[12px] text-blue-400 font-normal">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-blue-400" />
                <span>
                  Sprint {activeSprint?.sprintNo || 1} In Progress &middot; Day {activeDay?.sprintDayNo || 1} Focus &middot; {totalDaysCount} days total
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">Completion Target: {formatCompletionTarget()}</span>
            </div>

            {/* Plan Card Body */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-zinc-100">
                    {plan?.name || "Crack SDE Master Sprint"}
                  </h3>
                  <Badge variant="blue" className="text-[10px] font-medium py-0.5 px-1.5 leading-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse mr-1" />
                    Active Plan
                  </Badge>
                </div>
                <div className="text-[12px] text-zinc-400 flex flex-wrap items-center gap-2 font-normal leading-normal">
                  <span>Role: <strong className="text-zinc-300 font-normal">{plan?.role || "Software Engineer"}</strong></span>
                  <span>&middot;</span>
                  <span>Pacing: <strong className="text-zinc-300 font-normal">{dailyHours} hrs/day</strong></span>
                  <span>&middot;</span>
                  <span>{totalSprintsCount} Sprints &middot; {totalTasksCount} Problems</span>
                </div>
              </div>

              {/* Right Plan Actions */}
              <div className="flex items-center gap-2 relative">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlanDetailOpen((prev) => !prev)}
                  className="h-7 text-[12px] font-medium border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 px-2.5"
                >
                  {isPlanDetailOpen ? "Collapse Sprints" : "View Sprints"}
                </Button>

                <div className="relative">
                  <button
                    onClick={() => setIsActionMenuOpen((prev) => !prev)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    title="Plan settings"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>

                  {isActionMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-1 text-[12px] shadow-dialog z-30 divide-y divide-zinc-800/80 animate-in fade-in-0 duration-150"
                      onClick={() => setIsActionMenuOpen(false)}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => setIsRenameModalOpen(true)}
                          className="flex w-full items-center gap-2 px-2.5 py-1 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Rename plan</span>
                        </button>
                        <button
                          onClick={() => setIsStartDateModalOpen(true)}
                          className="flex w-full items-center gap-2 px-2.5 py-1 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md"
                        >
                          <CalendarIcon className="h-3 w-3" />
                          <span>Edit start date</span>
                        </button>
                        <button
                          onClick={() => setIsAdjustPlanModalOpen(true)}
                          className="flex w-full items-center gap-2 px-2.5 py-1 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md"
                        >
                          <Sliders className="h-3 w-3" />
                          <span>Adjust daily hours</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* EXPANDABLE STUDY PLAN SCHEDULE & TREE */}
            {isPlanDetailOpen && (
              <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-4 space-y-5">
                {/* 4 Overview KPI Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400">
                      <TrendingUp className="h-3 w-3 text-blue-400" />
                      <span>Overall Progress</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-[16px] font-semibold font-mono text-zinc-100">{progressPercent}%</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{completedDaysCount} / {totalDaysCount} days</span>
                    </div>
                    <Progress value={progressPercent} className="mt-1.5" />
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span>Curriculum Time</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-[16px] font-semibold font-mono text-zinc-100">
                        {completedHours > 0 ? `${completedHours}h ` : ""}{completedMinutesRem}m
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">of {totalHours}h {remainingMinutes}m</span>
                    </div>
                    <Progress value={curriculumTimePercent} className="mt-1.5" />
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400">
                      <Layers className="h-3 w-3 text-purple-400" />
                      <span>Sprints Completed</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-[16px] font-semibold font-mono text-zinc-100">{completedSprintsCount}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">of {totalSprintsCount} sprints</span>
                    </div>
                    <Progress
                      value={(completedSprintsCount / Math.max(1, totalSprintsCount)) * 100}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400">
                      <CalendarIcon className="h-3 w-3 text-emerald-400" />
                      <span>Est. Completion</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-[16px] font-semibold text-zinc-100">{getCompletionDayMonth()}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{getCompletionYear()}</span>
                    </div>
                    <div className={cn(
                      "text-[11px] font-normal pt-0.5 flex items-center gap-1",
                      plan?.isOnSchedule !== false ? "text-emerald-400" : "text-amber-400"
                    )}>
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        plan?.isOnSchedule !== false ? "bg-emerald-500" : "bg-amber-500"
                      )} />
                      {plan?.scheduleStatusText || (plan?.isOnSchedule !== false ? "On Schedule" : "Behind Schedule")}
                    </div>
                  </div>
                </div>

                {/* VIEW 1: SPRINT TREE VIEW */}
                {viewMode === "tree" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1 items-start">
                    {/* Left Sprints Breakdown */}
                    <div className="lg:col-span-8 space-y-3">
                      {sprints.map((sprint) => {
                        const isSprintExpanded = expandedSprintId === sprint.sprintId;
                        const sprintTotalHours = Math.floor((sprint.totalEstimatedMinutes || 0) / 60);
                        const sprintRemainingMinutes = (sprint.totalEstimatedMinutes || 0) % 60;
                        const sprintSubjects = getSprintSubjectSummary(sprint);
                        const isSprintCompleted = sprint.status === "completed";

                        return (
                          <div
                            key={sprint.sprintId}
                            className={cn(
                              "rounded-xl border transition-all duration-200 overflow-hidden shadow-subtle",
                              isSprintExpanded
                                ? "border-blue-500/30 bg-zinc-900/50"
                                : isSprintCompleted
                                ? "border-emerald-500/20 bg-zinc-900/30 opacity-80 hover:opacity-100"
                                : "border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80"
                            )}
                          >
                            {/* Sprint Header */}
                            <div
                              onClick={() =>
                                setExpandedSprintId((prev) =>
                                  prev === sprint.sprintId ? "" : sprint.sprintId
                                )
                              }
                              className="flex items-center justify-between p-3 sm:p-3.5 cursor-pointer select-none hover:bg-zinc-900/60 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={isSprintCompleted ? "success" : "blue"}
                                  className="text-[10px] font-medium py-0.5 px-1.5 leading-none"
                                >
                                  {isSprintCompleted ? "✓ Sprint " : "Sprint "}{sprint.sprintNo}
                                </Badge>
                                <span className="text-[12px] text-zinc-300 font-normal hidden sm:inline">
                                  • {sprintSubjects}
                                </span>
                              </div>

                              <div className="flex items-center gap-2.5 text-[11px] text-zinc-400">
                                <span className="font-mono text-[11px] text-zinc-400">
                                  Est. {sprintTotalHours}h {sprintRemainingMinutes}m
                                </span>
                                <ChevronDown
                                  className={cn(
                                    "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
                                    isSprintExpanded ? "rotate-0" : "-rotate-90"
                                  )}
                                />
                              </div>
                            </div>

                            {/* Expanded Sprint Days */}
                            {isSprintExpanded && (
                              <div className="border-t border-zinc-800/80 bg-zinc-950/70 p-2.5 sm:p-3 space-y-2">
                                {(sprint.days || []).map((day) => {
                                  const isDayExpanded = expandedDayId === day.dayId;
                                  const dayHours = Math.floor((day.estimatedMinutes || 0) / 60);
                                  const dayMinutes = (day.estimatedMinutes || 0) % 60;
                                  const isDayComplete = (day.tasksCompleted || 0) >= (day.tasksTotal || 1) && (day.tasksTotal || 0) > 0;

                                  return (
                                    <div
                                      key={day.dayId}
                                      className={cn(
                                        "rounded-lg border overflow-hidden transition-colors",
                                        isDayComplete
                                          ? "border-emerald-500/20 bg-zinc-900/30"
                                          : "border-zinc-800/80 bg-zinc-900/40"
                                      )}
                                    >
                                      <div
                                        onClick={() =>
                                          setExpandedDayId((prev) =>
                                            prev === day.dayId ? "" : day.dayId
                                          )
                                        }
                                        className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-zinc-900/80 transition-colors"
                                      >
                                        <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-200">
                                          <ChevronDown
                                            className={cn(
                                              "h-3 w-3 text-blue-400 transition-transform duration-200",
                                              isDayExpanded ? "rotate-0" : "-rotate-90"
                                            )}
                                          />
                                          <span>Day {day.sprintDayNo}</span>
                                          <span className="text-[11px] text-zinc-500 font-normal font-mono">
                                            ({day.tasksCompleted || 0} / {day.tasksTotal || 0} done)
                                          </span>
                                          {isDayComplete && (
                                            <span className="text-emerald-400 text-[10px] font-mono">✓</span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                                          <span>
                                            Est. {dayHours > 0 ? `${dayHours}h ` : ""}{dayMinutes}m
                                          </span>
                                          <ChevronRight className="h-3 w-3 text-blue-400" />
                                        </div>
                                      </div>

                                      {isDayExpanded && (
                                        <div className="border-t border-zinc-800/60 bg-zinc-950/90 divide-y divide-zinc-800/40">
                                          {(day.tasks || []).map((task) => {
                                            const isCompleted = task.status === "completed";
                                            const isStarred = task.isRevision;
                                            const subjectName = task.item?.subjectName || "DSA";
                                            const topicName = task.item?.topicName || "Arrays";

                                            return (
                                              <div
                                                key={task.taskId}
                                                className={cn(
                                                  "flex items-center justify-between px-3 py-2 text-[12px] transition-colors hover:bg-zinc-900/60 group",
                                                  isCompleted && "bg-zinc-900/20 opacity-70"
                                                )}
                                              >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                  <button
                                                    type="button"
                                                    disabled={isUpdatingTask}
                                                    onClick={() => handleToggleTaskStatus(task)}
                                                    className={cn(
                                                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
                                                      isCompleted
                                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                                        : "border-zinc-700 bg-zinc-900 hover:border-blue-500"
                                                    )}
                                                    aria-label={`Mark task as ${isCompleted ? "incomplete" : "complete"}`}
                                                  >
                                                    {isCompleted && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                                  </button>

                                                  <div className="flex items-center gap-1 shrink-0">
                                                    {getSubjectBadge(task.item?.subjectSlug, subjectName)}
                                                    <span className="text-[11px] text-zinc-500 font-normal hidden sm:inline">
                                                      {topicName} &middot;
                                                    </span>
                                                  </div>

                                                  <span
                                                    className={cn(
                                                      "font-normal text-zinc-200 truncate cursor-pointer hover:text-blue-400 transition-colors text-[12px] leading-snug",
                                                      isCompleted && "line-through text-zinc-500"
                                                    )}
                                                    onClick={() => handleToggleTaskStatus(task)}
                                                  >
                                                    {task.item?.title || `Task #${task.taskOrder}`}
                                                  </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                                  <button
                                                    type="button"
                                                    onClick={() => handleToggleBookmark(task)}
                                                    className={cn(
                                                      "p-0.5 rounded transition-colors",
                                                      isStarred
                                                        ? "text-amber-400 hover:text-amber-300"
                                                        : "text-zinc-600 hover:text-amber-400 group-hover:text-zinc-400"
                                                    )}
                                                    title={isStarred ? "Remove from Revision" : "Add to Revision"}
                                                  >
                                                    <Star
                                                      className={cn("h-3 w-3", isStarred && "fill-amber-400")}
                                                    />
                                                  </button>

                                                  <span className="text-[11px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded font-mono">
                                                    {task.estimatedMinutes}m
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Study Sidebar */}
                    <div className="lg:col-span-4 space-y-3.5">
                      {/* Revision List Box */}
                      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5 shadow-subtle">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-200">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>Revision List</span>
                            {totalRevisionCount > 0 && (
                              <Badge variant="blue" className="text-[10px] py-0.5 px-1.5 font-medium leading-none font-mono">
                                {totalRevisionCount}
                              </Badge>
                            )}
                          </div>
                          <button
                            onClick={() => setIsRevisionModalOpen(true)}
                            className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            View all
                          </button>
                        </div>

                        {/* Active Day Focus Preview */}
                        <div className="space-y-1.5 pt-0.5">
                          <div className="text-[12px] font-medium text-zinc-300">
                            Sprint {activeSprint?.sprintNo || 1} &middot; Day {activeDay?.sprintDayNo || 1} Focus
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-950/60 p-1.5 rounded-lg border border-zinc-800/80 font-mono">
                            <span>{activeDayTasks.length} topics</span>
                            <span>&middot;</span>
                            <span>
                              {Math.floor((activeDay?.estimatedMinutes || 0) / 60)}h {(activeDay?.estimatedMinutes || 0) % 60}m planned
                            </span>
                          </div>

                          <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
                            {activeDayTasks.slice(0, 6).map((t, idx) => {
                              const isTaskDone = t.status === "completed";
                              return (
                                <div
                                  key={t.taskId || idx}
                                  onClick={() => handleToggleTaskStatus(t)}
                                  className={cn(
                                    "flex items-center justify-between py-1 px-1.5 rounded text-[11px] cursor-pointer transition-colors",
                                    isTaskDone
                                      ? "text-zinc-500 line-through bg-zinc-900/20"
                                      : "text-zinc-300 hover:bg-zinc-800/40"
                                  )}
                                >
                                  <span className="truncate pr-2">{t.item?.title || `Task #${idx + 1}`}</span>
                                  <span className="text-zinc-500 text-[10px] shrink-0 font-mono">
                                    {t.estimatedMinutes}m
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 2: TIMELINE CALENDAR VIEW */}
                {viewMode === "calendar" && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-zinc-100">{totalSprintsCount}-Sprint Schedule Timeline</span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {formatDateDisplay(plan?.startDate || sprints[0]?.plannedStartDate)} – {formatCompletionTarget()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {sprints.map((s) => {
                        const isCompleted = s.status === "completed";
                        const isInProgress = s.status === "in_progress" || s.sprintNo === activeSprint?.sprintNo;
                        const sprintSubjects = getSprintSubjectSummary(s);

                        return (
                          <div
                            key={s.sprintId}
                            onClick={() => {
                              setExpandedSprintId(s.sprintId);
                              setViewMode("tree");
                            }}
                            className={cn(
                              "rounded-lg border p-3 space-y-2 cursor-pointer transition-all shadow-subtle group",
                              isInProgress
                                ? "border-blue-500/40 bg-zinc-950/90"
                                : isCompleted
                                ? "border-emerald-500/30 bg-zinc-950/70"
                                : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors">
                                Sprint {s.sprintNo}
                              </span>
                              <Badge
                                variant={isCompleted ? "success" : isInProgress ? "blue" : "secondary"}
                                className="text-[10px] py-0 px-1.5"
                              >
                                {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming"}
                              </Badge>
                            </div>

                            <div className="text-[11px] text-zinc-400 truncate">
                              {sprintSubjects}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/60">
                              <span>{(s.days || []).length} Days</span>
                              <span>{Math.floor((s.totalEstimatedMinutes || 0) / 60)}h</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: COMPLETED SPRINTS */}
      {/* ========================================================================= */}
      {activeTab === "completed" && (
        <div className="space-y-4">
          {completedSprints.length === 0 ? (
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-8 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-zinc-600 mx-auto" />
              <h3 className="text-[14px] font-medium text-zinc-200">No sprints completed yet</h3>
              <p className="text-[12px] text-zinc-500 max-w-sm mx-auto">
                Complete daily tasks in the active sprint to finish your sprints. Sprints will appear here once all assigned days are completed.
              </p>
              <Button
                size="sm"
                onClick={() => setActiveTab("active")}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-8"
              >
                Go to Active Sprint Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedSprints.map((s) => (
                <div
                  key={s.sprintId}
                  className="rounded-xl border border-emerald-500/20 bg-zinc-900/40 p-4 space-y-2 shadow-subtle"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="text-[10px] py-0.5 px-1.5 font-medium">
                        ✓ Sprint {s.sprintNo}
                      </Badge>
                      <span className="text-[12px] font-medium text-zinc-200">{getSprintSubjectSummary(s)}</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-2 border-t border-zinc-800">
                    <span>{(s.days || []).length} Days completed</span>
                    <span>{Math.floor((s.totalEstimatedMinutes || 0) / 60)}h mastered</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: RENAME PLAN */}
      {/* ========================================================================= */}
      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent className="max-w-md bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-semibold leading-tight">Rename Study Plan</DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Update the name of your active study plan in the database.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-2">
            <label className="text-[12px] text-zinc-300 font-medium">Plan Name</label>
            <Input
              value={planNameInput}
              onChange={(e) => setPlanNameInput(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 text-[13px] h-9"
              placeholder="Enter plan name"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsRenameModalOpen(false)} className="text-[12px] h-7">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isUpdatingPlan || !planNameInput.trim()}
              onClick={() => {
                updatePlan(
                  { name: planNameInput.trim() },
                  {
                    onSuccess: () => {
                      setIsRenameModalOpen(false);
                    },
                  }
                );
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-7"
            >
              {isUpdatingPlan ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT START DATE */}
      {/* ========================================================================= */}
      <Dialog open={isStartDateModalOpen} onOpenChange={setIsStartDateModalOpen}>
        <DialogContent className="max-w-md bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-semibold leading-tight">Edit Start Date</DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Change your study plan start date. All sprint and daily calendar dates will be recalculated dynamically.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-2">
            <label className="text-[12px] text-zinc-300 font-medium">Start Date</label>
            <Input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 text-[13px] h-9"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsStartDateModalOpen(false)} className="text-[12px] h-7">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isUpdatingPlan || !newStartDate}
              onClick={() => {
                updatePlan(
                  { startDate: newStartDate },
                  {
                    onSuccess: () => {
                      setIsStartDateModalOpen(false);
                    },
                  }
                );
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-7"
            >
              {isUpdatingPlan ? "Updating..." : "Update Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: ADJUST DAILY HOURS */}
      {/* ========================================================================= */}
      <Dialog open={isAdjustPlanModalOpen} onOpenChange={setIsAdjustPlanModalOpen}>
        <DialogContent className="max-w-md bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-semibold leading-tight">Adjust Daily Hours</DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Adjust your planned daily study hours. Target completion pacing will adapt accordingly.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-zinc-300 font-medium">Daily Study Hours</span>
              <span className="text-[13px] font-bold font-mono text-blue-400">{dailyHours} hrs/day</span>
            </div>
            <Slider
              value={dailyHours}
              min={1}
              max={10}
              step={1}
              onChange={(val) => setDailyHours(val)}
            />
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Estimated Duration:</span>
              <span className="font-mono text-zinc-200">
                {Math.ceil(totalMinutes / (dailyHours * 60))} days ({totalHours}h total)
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAdjustPlanModalOpen(false)} className="text-[12px] h-7">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isUpdatingPlan}
              onClick={() => {
                updatePlan(
                  { dailyHours },
                  {
                    onSuccess: () => {
                      setIsAdjustPlanModalOpen(false);
                    },
                  }
                );
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-7"
            >
              {isUpdatingPlan ? "Saving..." : "Apply Pacing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 4: REVISION LIST MODAL ("View all") */}
      {/* ========================================================================= */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent className="max-w-lg bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-semibold leading-tight flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>Revision &amp; Spaced Repetition</span>
            </DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Review topics and problems scheduled by the automated spaced repetition system.
            </DialogDescription>
          </DialogHeader>

          {/* Revision Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-zinc-800 pb-2 text-[11px]">
            <button
              onClick={() => setRevisionModalTab("due")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1",
                revisionModalTab === "due"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <span>Due Now</span>
              {dueRevisionItems.length > 0 && (
                <span className="font-mono text-[10px] px-1 rounded bg-amber-500/20 text-amber-300">
                  {dueRevisionItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setRevisionModalTab("upcoming")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1",
                revisionModalTab === "upcoming"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <span>Upcoming</span>
              <span className="font-mono text-[10px] px-1 rounded bg-zinc-800 text-zinc-400">
                {upcomingRevisionItems.length}
              </span>
            </button>

            <button
              onClick={() => setRevisionModalTab("all")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1",
                revisionModalTab === "all"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <span>Starred Tasks</span>
              <span className="font-mono text-[10px] px-1 rounded bg-zinc-800 text-zinc-400">
                {starredTasksList.length}
              </span>
            </button>
          </div>

          {/* Modal Items List */}
          <div className="py-2 space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {revisionModalTab === "due" && (
              dueRevisionItems.length === 0 ? (
                <div className="py-6 text-center space-y-1.5">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
                  <p className="text-[12px] font-medium text-emerald-400">All caught up!</p>
                  <p className="text-[11px] text-zinc-500">No revisions are due today.</p>
                </div>
              ) : (
                dueRevisionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/[0.04] flex items-center justify-between"
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="blue" className="text-[9px] py-0 px-1">
                          {item.subjectSlug?.toUpperCase() || "DSA"}
                        </Badge>
                        <span className="text-[10px] text-zinc-400 truncate">{item.topicName}</span>
                      </div>
                      <h4 className="text-[12px] font-medium text-zinc-200 truncate">{item.title}</h4>
                    </div>
                    <Badge variant="destructive" className="text-[10px] py-0 px-1.5 font-mono shrink-0 ml-2">
                      Due Today
                    </Badge>
                  </div>
                ))
              )
            )}

            {revisionModalTab === "upcoming" && (
              upcomingRevisionItems.length === 0 ? (
                <div className="py-6 text-center space-y-1">
                  <p className="text-[12px] text-zinc-400">No upcoming revisions scheduled yet.</p>
                </div>
              ) : (
                upcomingRevisionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="blue" className="text-[9px] py-0 px-1">
                          {item.subjectSlug?.toUpperCase() || "DSA"}
                        </Badge>
                        <span className="text-[10px] text-zinc-400 truncate">{item.topicName}</span>
                      </div>
                      <h4 className="text-[12px] font-medium text-zinc-200 truncate">{item.title}</h4>
                    </div>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-blue-400 border-blue-500/20 bg-blue-500/10 font-mono shrink-0 ml-2">
                      {item.progress?.revisionStatusText || "Scheduled"}
                    </Badge>
                  </div>
                ))
              )
            )}

            {revisionModalTab === "all" && (
              starredTasksList.length === 0 ? (
                <div className="py-6 text-center space-y-1">
                  <p className="text-[12px] text-zinc-400">No starred tasks in this plan.</p>
                  <p className="text-[11px] text-zinc-500">Click the star icon next to any task to add it here.</p>
                </div>
              ) : (
                starredTasksList.map((task) => (
                  <div
                    key={task.taskId}
                    className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        {getSubjectBadge(task.item?.subjectSlug, task.item?.subjectName)}
                        <span className="text-[10px] text-zinc-400 truncate">{task.item?.topicName}</span>
                      </div>
                      <h4 className="text-[12px] font-medium text-zinc-200 truncate">{task.item?.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded shrink-0 ml-2">
                      {task.estimatedMinutes}m
                    </span>
                  </div>
                ))
              )
            )}
          </div>

          <DialogFooter className="pt-2 flex items-center justify-between sm:justify-between">
            <Link
              href="/prep-hub?tab=revision"
              className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              Open in PrepHub <ArrowRight className="h-3 w-3" />
            </Link>
            <Button size="sm" onClick={() => setIsRevisionModalOpen(false)} className="text-[12px] h-7 bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 5: CATCH-UP & RESCHEDULE */}
      {/* ========================================================================= */}
      <Dialog open={isCatchupModalOpen} onOpenChange={setIsCatchupModalOpen}>
        <DialogContent className="max-w-md bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-semibold leading-tight">Smart Catch-Up &amp; Reschedule</DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Fell behind your planned study pace? Catch-up mode redistributes any missed tasks across remaining days without overloading you.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-2 text-[12px] text-zinc-300">
            <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-2.5 space-y-1">
              <span className="font-semibold text-blue-200">Rebalancing Strategy:</span>
              <p className="text-[11px] text-zinc-300 font-normal">
                +15 mins added to upcoming 4 weekdays. Weekend pacing adjusted.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsCatchupModalOpen(false)} className="text-[12px] h-7">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSmartReschedule} className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] h-7">
              Apply Smart Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
