"use client";

import React, { useState } from "react";
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
import type { StudyTaskDto } from "@starter/shared";

export default function PlanlyPage() {
  const {
    plan,
    isLoading,
    updateTask,
    updatePlan,
  } = useStudyPlan("crack-sde");

  const { data: revisionListData } = useRevisionList();

  // Tab State
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // Detailed view toggle
  const [isPlanDetailOpen, setIsPlanDetailOpen] = useState(true);

  // Menu State
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  // Expanded Tree State
  const [expandedSprintId, setExpandedSprintId] = useState<string>("1");
  const [expandedDayId, setExpandedDayId] = useState<string>("1");

  // Modals
  const [isStartDateModalOpen, setIsStartDateModalOpen] = useState(false);
  const [isAdjustPlanModalOpen, setIsAdjustPlanModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  // Form states
  const [planNameInput, setPlanNameInput] = useState("Crack SDE");
  const [newStartDate, setNewStartDate] = useState("2026-10-01");
  const [dailyHours, setDailyHours] = useState(4);

  // Plan Calculations
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

  const getSubjectBadge = (subjectSlug?: string, subjectName?: string) => {
    const slug = (subjectSlug || "dsa").toLowerCase();
    if (slug.includes("dsa")) {
      return (
        <Badge variant="blue" className="py-0.5 px-1.5 font-medium text-[11px]">
          DSA
        </Badge>
      );
    }
    if (slug.includes("dbms")) {
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
    if (slug.includes("oops")) {
      return (
        <Badge variant="destructive" className="py-0.5 px-1.5 font-medium text-[11px]">
          OOPS
        </Badge>
      );
    }
    return (
      <Badge variant="cyan" className="py-0.5 px-1.5 font-medium text-[11px]">
        LLD
      </Badge>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* ========================================================================= */}
      {/* TOP SECTION: PLANLY HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Heading & 4 Feature Benefits */}
          <div className="space-y-3.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[12px] font-medium text-zinc-300 uppercase tracking-wider">
              <span>Study Planner Engine</span>
            </div>
            <h1 className="text-[24px] font-semibold leading-[1.25] tracking-tight text-zinc-100">
              Know what to study every day and readjust as you go
            </h1>

            {/* 4 Benefits in a row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="flex items-center gap-2 text-[13px]">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <span className="text-[12px] text-zinc-400 font-normal leading-[1.4]">Goal-based pacing</span>
              </div>

              <div className="flex items-center gap-2 text-[13px]">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <BarChart2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-[12px] text-zinc-400 font-normal leading-[1.4]">Dynamic backlog shifts</span>
              </div>

              <div className="flex items-center gap-2 text-[13px]">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <span className="text-[12px] text-zinc-400 font-normal leading-[1.4]">9 structured sprints</span>
              </div>

              <div className="flex items-center gap-2 text-[13px]">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Target className="h-3.5 w-3.5" />
                </div>
                <span className="text-[12px] text-zinc-400 font-normal leading-[1.4]">Revision bookmarking</span>
              </div>
            </div>
          </div>

          {/* Right: Primary Call to Action Button */}
          <div className="shrink-0 flex items-center">
            <Button
              asChild
              size="sm"
              className="h-9 px-4 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Link href="/onboarding">
                Generate custom plan <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS SECTION: ACTIVE (1) / COMPLETED (0) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2">
        <button
          onClick={() => setActiveTab("active")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors",
            activeTab === "active"
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60"
          )}
        >
          <span>Active Plans</span>
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 px-1.5 text-[11px] font-semibold text-blue-400">
            1
          </span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors",
            activeTab === "completed"
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60"
          )}
        >
          <span>Completed</span>
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-800 px-1.5 text-[11px] font-semibold text-zinc-500">
            0
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT: ACTIVE PLANS */}
      {/* ========================================================================= */}
      {activeTab === "active" && (
        <div className="space-y-6">
          {/* Main Active Plan Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
            {/* Top Sub-header Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 px-5 py-2.5 text-[13px] text-blue-400 font-normal">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3.5 w-3.5 text-blue-400" />
                <span>Starts in 5 days &middot; Ready to begin &middot; 61 days total</span>
              </div>
              <span className="text-[12px] text-zinc-500">Scheduled: 1 Oct 2026</span>
            </div>

            {/* Plan Card Body */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
              {/* Left Plan Meta */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[16px] font-semibold leading-[1.35] text-zinc-100">
                    {plan?.name || "Crack SDE"}
                  </h3>
                  <Badge variant="blue" className="text-[12px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse mr-1" />
                    Active Plan
                  </Badge>
                </div>
                <div className="text-[13px] text-zinc-400 flex flex-wrap items-center gap-2 font-normal leading-[1.45]">
                  <span>Target Role: <strong className="text-zinc-300 font-normal">Software Engineer</strong></span>
                  <span>&middot;</span>
                  <span>Pacing: <strong className="text-zinc-300 font-normal">4 hrs/day</strong></span>
                  <span>&middot;</span>
                  <span>9 Sprints</span>
                </div>
              </div>

              {/* Right Plan Actions */}
              <div className="flex items-center gap-2.5 relative">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlanDetailOpen((prev) => !prev)}
                  className="h-8 text-[13px] font-medium border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                >
                  {isPlanDetailOpen ? "Collapse schedule" : "View schedule & sprints"}
                </Button>

                {/* Three-dot dropdown menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsActionMenuOpen((prev) => !prev)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    title="Plan settings"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {isActionMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-1 text-[13px] shadow-dialog z-30 divide-y divide-zinc-800/80 animate-in fade-in-0 duration-150"
                      onClick={() => setIsActionMenuOpen(false)}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setPlanNameInput(plan?.name || "Crack SDE");
                            setIsRenameModalOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Rename plan</span>
                        </button>
                        <button
                          onClick={() => setIsStartDateModalOpen(true)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md"
                        >
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span>Edit start date</span>
                        </button>
                        <button
                          onClick={() => setIsAdjustPlanModalOpen(true)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md"
                        >
                          <Sliders className="h-3.5 w-3.5" />
                          <span>Adjust daily hours</span>
                        </button>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => setIsRevisionModalOpen(true)}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-amber-400 hover:bg-zinc-900 rounded-md"
                        >
                          <Star className="h-3.5 w-3.5" />
                          <span>Revision list ({revisionListData?.length || 0})</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* EXPANDABLE STUDY PLAN SCHEDULE & TREE */}
            {isPlanDetailOpen && (
              <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-5 space-y-6">
                {/* 4 Overview KPI Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
                      <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                      <span>Overall progress</span>
                    </div>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-[18px] font-semibold leading-[1.3] text-zinc-100">{progressPercent}%</span>
                      <span className="text-[12px] text-zinc-500">{completedDaysCount} / 61 days</span>
                    </div>
                    <Progress value={progressPercent} className="mt-2" />
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Time spent</span>
                    </div>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-[18px] font-semibold leading-[1.3] text-zinc-100">0m</span>
                      <span className="text-[12px] text-zinc-500">of {totalHours}h {remainingMinutes}m</span>
                    </div>
                    <Progress value={0} className="mt-2" />
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
                      <Layers className="h-3.5 w-3.5 text-purple-400" />
                      <span>Sprints completed</span>
                    </div>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-[18px] font-semibold leading-[1.3] text-zinc-100">{completedSprintsCount}</span>
                      <span className="text-[12px] text-zinc-500">of {totalSprintsCount} sprints</span>
                    </div>
                    <Progress
                      value={(completedSprintsCount / totalSprintsCount) * 100}
                      className="mt-2"
                    />
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
                      <CalendarIcon className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Est. completion</span>
                    </div>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-[18px] font-semibold leading-[1.3] text-zinc-100">30 Nov</span>
                      <span className="text-[12px] text-zinc-500">2026</span>
                    </div>
                    <div className="text-[12px] text-emerald-400 font-normal pt-1 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> On schedule
                    </div>
                  </div>
                </div>

                {/* Main Sprint Tree Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1 items-start">
                  {/* Left Sprints Breakdown */}
                  <div className="lg:col-span-8 space-y-3.5">
                    {sprints.map((sprint) => {
                      const isSprintExpanded = expandedSprintId === sprint.sprintId;
                      const sprintTotalHours = Math.floor((sprint.totalEstimatedMinutes || 0) / 60);
                      const sprintRemainingMinutes = (sprint.totalEstimatedMinutes || 0) % 60;

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
                            "rounded-xl border transition-all duration-200 overflow-hidden shadow-subtle",
                            isSprintExpanded
                              ? "border-blue-500/30 bg-zinc-900/50"
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
                            className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer select-none hover:bg-zinc-900/60 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <Badge variant="blue" className="text-[12px] font-medium">
                                Sprint {sprint.sprintNo}
                              </Badge>
                              <span className="text-[13px] text-zinc-300 font-normal hidden sm:inline">
                                • {sprintSubjects}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[12px] text-zinc-400">
                              <span className="text-[12px] text-zinc-400">
                                Est. {sprintTotalHours}h {sprintRemainingMinutes}m
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 text-zinc-400 transition-transform duration-200",
                                  isSprintExpanded ? "rotate-0" : "-rotate-90"
                                )}
                              />
                            </div>
                          </div>

                          {/* Expanded Sprint Days */}
                          {isSprintExpanded && (
                            <div className="border-t border-zinc-800/80 bg-zinc-950/70 p-3 sm:p-4 space-y-2.5">
                              {(sprint.days || []).map((day) => {
                                const isDayExpanded = expandedDayId === day.dayId;
                                const dayHours = Math.floor((day.estimatedMinutes || 0) / 60);
                                const dayMinutes = (day.estimatedMinutes || 0) % 60;

                                return (
                                  <div
                                    key={day.dayId}
                                    className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden"
                                  >
                                    <div
                                      onClick={() =>
                                        setExpandedDayId((prev) =>
                                          prev === day.dayId ? "" : day.dayId
                                        )
                                      }
                                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-900/80 transition-colors"
                                    >
                                      <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-200">
                                        <ChevronDown
                                          className={cn(
                                            "h-3.5 w-3.5 text-blue-400 transition-transform duration-200",
                                            isDayExpanded ? "rotate-0" : "-rotate-90"
                                          )}
                                        />
                                        <span>Day {day.sprintDayNo}</span>
                                        <span className="text-[12px] text-zinc-500 font-normal">
                                          ({day.tasksCompleted} / {day.tasksTotal} completed)
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-[12px] text-zinc-400">
                                        <span>
                                          Est. {dayHours > 0 ? `${dayHours}h ` : ""}{dayMinutes}m
                                        </span>
                                        <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
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
                                                "flex items-center justify-between px-3.5 py-2.5 text-[13px] transition-colors hover:bg-zinc-900/60 group",
                                                isCompleted && "bg-zinc-900/20 opacity-70"
                                              )}
                                            >
                                              <div className="flex items-center gap-2.5 overflow-hidden">
                                                <button
                                                  type="button"
                                                  onClick={() => handleToggleTaskStatus(task)}
                                                  className={cn(
                                                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                                                    isCompleted
                                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                                      : "border-zinc-700 bg-zinc-900 hover:border-blue-500"
                                                  )}
                                                  aria-label={`Mark task as ${isCompleted ? "incomplete" : "complete"}`}
                                                >
                                                  {isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                                                </button>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                  {getSubjectBadge(task.item?.subjectSlug, subjectName)}
                                                  <span className="text-[12px] text-zinc-500 font-normal hidden sm:inline">
                                                    {topicName} &middot;
                                                  </span>
                                                </div>

                                                <span
                                                  className={cn(
                                                    "font-normal text-zinc-200 truncate cursor-pointer hover:text-blue-400 transition-colors text-[13px] leading-[1.45]",
                                                    isCompleted && "line-through text-zinc-500"
                                                  )}
                                                  onClick={() => handleToggleTaskStatus(task)}
                                                >
                                                  {task.item?.title || `Task #${task.taskOrder}`}
                                                </span>
                                              </div>

                                              <div className="flex items-center gap-2.5 shrink-0 ml-2">
                                                <button
                                                  type="button"
                                                  onClick={() => handleToggleBookmark(task)}
                                                  className={cn(
                                                    "p-1 rounded transition-colors",
                                                    isStarred
                                                      ? "text-amber-400 hover:text-amber-300"
                                                      : "text-zinc-600 hover:text-amber-400 group-hover:text-zinc-400"
                                                  )}
                                                  title={isStarred ? "Remove from Revision" : "Add to Revision"}
                                                >
                                                  <Star
                                                    className={cn("h-3.5 w-3.5", isStarred && "fill-amber-400")}
                                                  />
                                                </button>

                                                <span className="text-[12px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
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
                  <div className="lg:col-span-4 space-y-4">
                    {/* Revision list preview */}
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 shadow-subtle">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                        <div className="flex items-center gap-2 text-[14px] font-semibold text-zinc-200">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>Revision List</span>
                          {revisionListData && revisionListData.length > 0 && (
                            <Badge variant="blue" className="text-[12px] py-0.5 px-2 font-medium">
                              {revisionListData.length}
                            </Badge>
                          )}
                        </div>
                        <button
                          onClick={() => setIsRevisionModalOpen(true)}
                          className="text-[13px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View all
                        </button>
                      </div>

                      {/* Day 1 Schedule Preview */}
                      <div className="space-y-2 pt-1">
                        <div className="text-[13px] font-medium text-zinc-300">
                          Day 1 Schedule Preview
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-zinc-400 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80">
                          <span>{day1Tasks.length || 20} topics</span>
                          <span>&middot;</span>
                          <span>3h 53m planned</span>
                        </div>

                        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                          {day1Tasks.slice(0, 8).map((t, idx) => (
                            <div
                              key={t.taskId || idx}
                              className="flex items-center justify-between py-1 px-1.5 rounded text-[12px] text-zinc-300 hover:bg-zinc-800/40 transition-colors"
                            >
                              <span className="truncate pr-2">{t.item?.title || `Task #${idx + 1}`}</span>
                              <span className="text-zinc-500 text-[11px] shrink-0">
                                {t.estimatedMinutes}m
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: COMPLETED PLANS */}
      {/* ========================================================================= */}
      {activeTab === "completed" && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
            <CheckCircle2 className="h-6 w-6 text-zinc-500" />
          </div>
          <h4 className="text-[16px] font-semibold text-zinc-200">No completed plans yet</h4>
          <p className="text-[13px] text-zinc-400 max-w-sm mx-auto leading-[1.45]">
            When you complete all sprints in your study plan, it will be archived here with your completion certificate and stats.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Modal 1: Edit Start Date */}
      <Dialog open={isStartDateModalOpen} onOpenChange={setIsStartDateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold leading-[1.3]">Edit Plan Start Date</DialogTitle>
            <DialogDescription className="text-[13px] text-zinc-400 leading-[1.45]">
              Choose when you want your preparation schedule to begin. All sprints and days will adjust automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-200">Start Date</label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStartDateModalOpen(false)}
              className="text-[13px] font-medium h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveStartDate}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium h-8"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Adjust Plan */}
      <Dialog open={isAdjustPlanModalOpen} onOpenChange={setIsAdjustPlanModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold leading-[1.3]">Adjust Daily Study Hours</DialogTitle>
            <DialogDescription className="text-[13px] text-zinc-400 leading-[1.45]">
              Update your daily commitment. Your sprint pacing will readjust automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex justify-between text-[13px] font-medium text-zinc-200">
                <span>Daily Study Commitment</span>
                <span className="text-blue-400 font-mono font-semibold">{dailyHours} hrs/day</span>
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
              className="text-[13px] font-medium h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsAdjustPlanModalOpen(false);
                toast.success("Plan parameters adjusted");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium h-8"
            >
              Apply Adjustments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Revision List View All */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold leading-[1.3]">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>Revision List</span>
              <Badge variant="blue" className="text-[11px] font-medium ml-2">
                {revisionListData?.length || 0} Bookmarked
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-[13px] text-zinc-400 leading-[1.45]">
              All problems you&apos;ve starred for focused revision before technical interviews.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
            {(!revisionListData || revisionListData.length === 0) && (
              <div className="py-12 text-center text-zinc-500 text-[13px]">
                No problems starred for revision yet. Click the star icon next to any problem to bookmark it!
              </div>
            )}

            {(revisionListData || []).map((task) => (
              <div
                key={task.taskId}
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 text-[13px] hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <div className="font-medium text-zinc-200 truncate">
                      {task.item?.title || "Problem Title"}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {task.item?.subjectName} &middot; {task.item?.topicName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[12px] text-zinc-400">
                    {task.estimatedMinutes}m
                  </span>
                  <button
                    onClick={() => handleToggleBookmark(task)}
                    className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
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
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-[13px] font-medium h-8"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 4: Rename Plan */}
      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold leading-[1.3]">Rename Study Plan</DialogTitle>
            <DialogDescription className="text-[13px] text-zinc-400 leading-[1.45]">
              Give your personalized preparation plan a custom title.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <input
              type="text"
              maxLength={60}
              value={planNameInput}
              onChange={(e) => setPlanNameInput(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRenameModalOpen(false)}
              className="text-[13px] font-medium h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSavePlanName}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium h-8"
            >
              Save Title
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
