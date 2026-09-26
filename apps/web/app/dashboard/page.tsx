"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  Star,
  ChevronDown,
  ChevronRight,
  Edit2,
  Sliders,
  Sparkles,
  TrendingUp,
  Layers,
  Flame,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useRevisionList } from "@/hooks/use-revision-list";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StudyTaskDto, StudySprintDto, StudyDayDto } from "@starter/shared";

export default function DashboardPage() {
  const {
    plan,
    isLoading,
    updateTask,
    updatePlan,
    isUpdatingTask,
  } = useStudyPlan("crack-sde");

  const { data: revisionListData, refetch: refetchRevisionList } = useRevisionList();

  // Local UI State
  const [expandedSprintId, setExpandedSprintId] = useState<string>("1");
  const [expandedDayId, setExpandedDayId] = useState<string>("1");
  const [isStartDateModalOpen, setIsStartDateModalOpen] = useState(false);
  const [isAdjustPlanModalOpen, setIsAdjustPlanModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  // Form states
  const [planNameInput, setPlanNameInput] = useState("Crack SDE");
  const [newStartDate, setNewStartDate] = useState("2026-10-01");
  const [dailyHours, setDailyHours] = useState(4);

  // Calculations
  const sprints = plan?.sprints || [];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);

  const totalTasksCount = allTasks.length || 847;
  const completedTasksCount = allTasks.filter((t) => t.status === "completed").length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const completedDaysCount = allDays.filter((d) => d.tasksCompleted >= (d.tasksTotal || 1) && d.tasksTotal > 0).length;

  const totalMinutes = sprints.reduce((acc, s) => acc + (s.totalEstimatedMinutes || 0), 0) || 16253;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const completedSprintsCount = sprints.filter((s) => s.status === "completed").length;
  const totalSprintsCount = sprints.length || 9;

  // Active Sprint 1 & Day 1 for preview
  const sprint1 = sprints.find((s) => s.sprintNo === 1) || sprints[0];
  const day1 = sprint1?.days?.find((d) => d.sprintDayNo === 1) || sprint1?.days?.[0];
  const day1Tasks = day1?.tasks || [];

  const handleToggleTaskStatus = (task: StudyTaskDto) => {
    const nextStatus = task.status === "completed" ? "not_started" : "completed";
    updateTask(
      { taskId: task.taskId, status: nextStatus },
      {
        onSuccess: () => {
          if (nextStatus === "completed") {
            toast.success(`Completed: ${task.item?.title || "Task"}`);
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
            toast.success(`Added to Revision List: ${task.item?.title || "Task"}`);
          } else {
            toast.info(`Removed from Revision List: ${task.item?.title || "Task"}`);
          }
        },
      }
    );
  };

  const handleSaveStartDate = () => {
    updatePlan(
      { startDate: newStartDate },
      {
        onSuccess: () => {
          setIsStartDateModalOpen(false);
        },
      }
    );
  };

  const handleSavePlanName = () => {
    if (!planNameInput.trim()) return;
    updatePlan(
      { name: planNameInput.trim() },
      {
        onSuccess: () => {
          setIsRenameModalOpen(false);
        },
      }
    );
  };

  // Helper badge color by subject
  const getSubjectBadge = (subjectSlug?: string, subjectName?: string) => {
    const name = subjectName || subjectSlug?.toUpperCase() || "DSA";
    const slug = (subjectSlug || "dsa").toLowerCase();

    if (slug.includes("dsa")) {
      return (
        <span className="rounded bg-blue-500/15 border border-blue-500/30 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">
          DSA
        </span>
      );
    }
    if (slug.includes("dbms")) {
      return (
        <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
          DBMS
        </span>
      );
    }
    if (slug.includes("operat") || slug.includes("os")) {
      return (
        <span className="rounded bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">
          OS
        </span>
      );
    }
    if (slug.includes("netw") || slug.includes("cn")) {
      return (
        <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
          CN
        </span>
      );
    }
    if (slug.includes("oops")) {
      return (
        <span className="rounded bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-400">
          OOPS
        </span>
      );
    }
    return (
      <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400">
        LLD
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 animate-in fade-in-50 duration-300">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Link href="/onboarding" className="hover:text-zinc-300 transition-colors">
          Planly
        </Link>
        <span>/</span>
        <span className="text-zinc-300 font-medium">{plan?.name || "Crack SDE"}</span>
      </div>

      {/* Page Title & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>{plan?.name || "Crack SDE"}</span>
            <button
              onClick={() => {
                setPlanNameInput(plan?.name || "Crack SDE");
                setIsRenameModalOpen(true);
              }}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-900 transition-colors"
              title="Rename Plan"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsStartDateModalOpen(true)}
            className="h-8 text-xs border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
            Edit start date
          </Button>

          <Badge variant="blue" className="h-8 px-2.5 text-xs flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Upcoming
          </Badge>

          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-400">
            <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
            <span>Scheduled: <strong className="text-zinc-200 font-medium">1 Oct 2026</strong></span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdjustPlanModalOpen(true)}
            className="h-8 text-xs border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Sliders className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
            Adjust plan
          </Button>
        </div>
      </div>

      {/* 4 Overview KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Overall Progress */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <TrendingUp className="h-3.5 w-3.5 text-zinc-500" />
            <span>Overall progress</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold tracking-tight text-zinc-100">{progressPercent} %</span>
            <span className="text-xs text-zinc-500">{completedDaysCount} / 61 days</span>
          </div>
          <Progress value={progressPercent} className="h-1 mt-2 bg-zinc-800" />
        </div>

        {/* Card 2: Time Spent */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>Time spent</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold tracking-tight text-zinc-100">0m</span>
            <span className="text-xs text-zinc-500">of {totalHours}h {remainingMinutes}m</span>
          </div>
          <Progress value={0} className="h-1 mt-2 bg-zinc-800" />
        </div>

        {/* Card 3: Sprints Completed */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <Layers className="h-3.5 w-3.5 text-zinc-500" />
            <span>Sprints completed</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold tracking-tight text-zinc-100">{completedSprintsCount}</span>
            <span className="text-xs text-zinc-500">of {totalSprintsCount} sprints</span>
          </div>
          <Progress
            value={(completedSprintsCount / totalSprintsCount) * 100}
            className="h-1 mt-2 bg-zinc-800"
          />
        </div>

        {/* Card 4: Est. Completion */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
            <span>Est. completion</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold tracking-tight text-zinc-100">30 Nov</span>
            <span className="text-xs text-zinc-500">2026</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium pt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> On schedule
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sprint Tree (7 cols) + Right Study Sidebar (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Main Area: Sprint & Day Tree */}
        <div className="lg:col-span-8 space-y-4">
          {sprints.map((sprint) => {
            const isSprintExpanded = expandedSprintId === sprint.sprintId;
            const sprintTotalHours = Math.floor((sprint.totalEstimatedMinutes || 0) / 60);
            const sprintRemainingMinutes = (sprint.totalEstimatedMinutes || 0) % 60;

            // Generate subject labels for sprint header
            const sprintSubjects =
              sprint.sprintNo <= 3
                ? "DSA + OOPS"
                : sprint.sprintNo <= 5
                ? "DSA + Operating System"
                : sprint.sprintNo <= 7
                ? "Computer Networks + LLD"
                : "DBMS";

            return (
              <div
                key={sprint.sprintId}
                className={cn(
                  "rounded-xl border transition-all overflow-hidden",
                  isSprintExpanded
                    ? "border-blue-900/50 bg-zinc-900/40 shadow-lg shadow-blue-950/10"
                    : "border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-700"
                )}
              >
                {/* Sprint Row Header */}
                <div
                  onClick={() =>
                    setExpandedSprintId((prev) => (prev === sprint.sprintId ? "" : sprint.sprintId))
                  }
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border border-zinc-700 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-transparent" />
                    </div>
                    <Badge variant="blue" className="text-xs font-semibold">
                      Sprint {sprint.sprintNo}
                    </Badge>
                    <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
                      • {sprintSubjects}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
                      • Upcoming
                    </Badge>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Est. {sprintTotalHours}h {sprintRemainingMinutes}m &middot; Time spent : 0 sec
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-zinc-400 transition-transform duration-200",
                        isSprintExpanded ? "" : "-rotate-90"
                      )}
                    />
                  </div>
                </div>

                {/* Expanded Sprint Days */}
                {isSprintExpanded && (
                  <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-3 sm:p-4 space-y-3">
                    {(sprint.days || []).map((day) => {
                      const isDayExpanded = expandedDayId === day.dayId;
                      const dayHours = Math.floor((day.estimatedMinutes || 0) / 60);
                      const dayMinutes = (day.estimatedMinutes || 0) % 60;

                      return (
                        <div
                          key={day.dayId}
                          className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden"
                        >
                          {/* Day Row Header */}
                          <div
                            onClick={() =>
                              setExpandedDayId((prev) => (prev === day.dayId ? "" : day.dayId))
                            }
                            className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-zinc-900/80 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-200">
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 text-blue-400 transition-transform duration-200",
                                  isDayExpanded ? "" : "-rotate-90"
                                )}
                              />
                              <span>Day {day.sprintDayNo}</span>
                              <span className="text-[10px] text-zinc-500 font-normal">
                                ({day.tasksCompleted} / {day.tasksTotal} completed)
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                              <span className="font-mono text-[11px]">
                                Est. {dayHours > 0 ? `${dayHours}h ` : ""}{dayMinutes}m
                              </span>
                              <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
                            </div>
                          </div>

                          {/* Expanded Day Tasks with Subject & Topic Name Badges */}
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
                                      "flex items-center justify-between px-4 py-3 text-xs transition-colors hover:bg-zinc-900/60 group",
                                      isCompleted && "bg-zinc-900/20 opacity-70"
                                    )}
                                  >
                                    {/* Left: Checkbox + Subject & Topic Badge + Problem Title */}
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleTaskStatus(task)}
                                        className={cn(
                                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                                          isCompleted
                                            ? "border-emerald-500 bg-emerald-500 text-white"
                                            : "border-zinc-700 bg-zinc-900 hover:border-blue-500"
                                        )}
                                      >
                                        {isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                                      </button>

                                      {/* Subject & Topic Badges */}
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {getSubjectBadge(task.item?.subjectSlug, subjectName)}
                                        <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
                                          {topicName} &middot;
                                        </span>
                                      </div>

                                      {/* Problem Title */}
                                      <span
                                        className={cn(
                                          "font-medium text-zinc-200 truncate cursor-pointer hover:text-blue-400 transition-colors",
                                          isCompleted && "line-through text-zinc-500"
                                        )}
                                        onClick={() => handleToggleTaskStatus(task)}
                                      >
                                        {task.item?.title || `Task #${task.taskOrder}`}
                                      </span>
                                    </div>

                                    {/* Right: Star (Revision List) + Duration Tag */}
                                    <div className="flex items-center gap-3 shrink-0 ml-2">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleBookmark(task)}
                                        className={cn(
                                          "p-1 rounded transition-colors",
                                          isStarred
                                            ? "text-amber-400 hover:text-amber-300"
                                            : "text-zinc-600 hover:text-amber-400 group-hover:text-zinc-400"
                                        )}
                                        title={isStarred ? "Remove from Revision List" : "Add to Revision List"}
                                      >
                                        <Star
                                          className={cn("h-3.5 w-3.5", isStarred && "fill-amber-400")}
                                        />
                                      </button>

                                      <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 px-2 py-0.5 rounded">
                                        <span>Est. {task.estimatedMinutes} min</span>
                                        <ChevronRight className="h-3 w-3 text-zinc-600" />
                                      </div>
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

        {/* Right Study Sidebar (Matches Screenshot) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Header with Revision List Drawer Link */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>Revision list</span>
                {revisionListData && revisionListData.length > 0 && (
                  <Badge variant="brand" className="text-[10px] py-0 px-1.5">
                    {revisionListData.length}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => setIsRevisionModalOpen(true)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all
              </button>
            </div>

            {/* Starts in 5 days Blue Alert Card */}
            <div className="rounded-lg border border-blue-900/50 bg-blue-950/30 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <CalendarIcon className="h-4 w-4 text-blue-400" />
                <span>Starts in 5 days</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Your plan is ready. Study sessions begin on <strong className="text-zinc-200 font-medium">1 Oct 2026</strong>.
              </p>
            </div>

            {/* Day 1 Schedule Preview */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-zinc-200">Scheduled for 1 Oct 2026</div>
                  <div className="text-[11px] text-zinc-500">Day 1 &middot; Schedule preview</div>
                </div>
              </div>

              {/* Day 1 Quick Stats */}
              <div className="flex items-center gap-4 text-[11px] text-zinc-400 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{day1Tasks.length || 20} topics</span>
                </div>
                <span>&middot;</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-zinc-500" />
                  <span>3h 53m planned</span>
                </div>
              </div>

              {/* Compact Task List Preview */}
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {day1Tasks.slice(0, 10).map((t, idx) => (
                  <div
                    key={t.taskId || idx}
                    className="flex items-center justify-between py-1.5 px-2 rounded text-[11px] text-zinc-300 hover:bg-zinc-800/40"
                  >
                    <span className="truncate pr-2">{t.item?.title || `Task #${idx + 1}`}</span>
                    <span className="text-zinc-500 font-mono text-[10px] shrink-0">
                      {t.estimatedMinutes}m
                    </span>
                  </div>
                ))}
              </div>

              {/* Info Footer Note */}
              <p className="text-[11px] text-zinc-500 leading-snug pt-2 border-t border-zinc-800/80">
                Browse your schedule now. Task timers and progress tracking become available when your plan starts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT START DATE */}
      {/* ========================================================================= */}
      <Dialog open={isStartDateModalOpen} onOpenChange={setIsStartDateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan Start Date</DialogTitle>
            <DialogDescription>
              Choose when you want your preparation schedule to begin. All 61 days will be automatically recalibrated.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-200">Start Date</label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStartDateModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveStartDate}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: ADJUST PLAN */}
      {/* ========================================================================= */}
      <Dialog open={isAdjustPlanModalOpen} onOpenChange={setIsAdjustPlanModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Plan Settings</DialogTitle>
            <DialogDescription>
              Update your daily commitment or plan configurations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-zinc-200">
                <span>Daily Study Hours</span>
                <span className="text-blue-400 font-mono">{dailyHours} hrs/day</span>
              </div>
              <Slider
                min={1}
                max={10}
                value={dailyHours}
                onChange={setDailyHours}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdjustPlanModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsAdjustPlanModalOpen(false);
                toast.success("Plan parameters adjusted");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              Apply Adjustments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: REVISION LIST VIEW ALL */}
      {/* ========================================================================= */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span>Revision List</span>
              <Badge variant="blue" className="text-xs ml-2">
                {revisionListData?.length || 0} Bookmarked
              </Badge>
            </DialogTitle>
            <DialogDescription>
              All problems you&apos;ve starred for focused revision before interviews.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
            {(!revisionListData || revisionListData.length === 0) && (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No problems starred for revision yet. Click the star icon next to any problem to bookmark it!
              </div>
            )}

            {(revisionListData || []).map((task) => (
              <div
                key={task.taskId}
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-zinc-200 truncate">
                      {task.item?.title || "Problem Title"}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {task.item?.subjectName} &middot; {task.item?.topicName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[11px] text-zinc-400">
                    {task.estimatedMinutes}m
                  </span>
                  <button
                    onClick={() => handleToggleBookmark(task)}
                    className="text-zinc-500 hover:text-red-400 p-1"
                    title="Remove from revision"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setIsRevisionModalOpen(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 4: RENAME PLAN */}
      {/* ========================================================================= */}
      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Study Plan</DialogTitle>
            <DialogDescription>
              Give your personalized preparation plan a custom title.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <input
              type="text"
              maxLength={60}
              value={planNameInput}
              onChange={(e) => setPlanNameInput(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRenameModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSavePlanName}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              Save Title
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
