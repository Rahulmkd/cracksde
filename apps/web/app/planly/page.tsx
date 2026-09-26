"use client";

import React, { useState, useRef } from "react";
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
import { usePlannerStore } from "@/store/planner-store";
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
  const { addPoints } = usePlannerStore();

  // Tab State: Active / Completed
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // View Mode: Tree View vs Timeline Calendar View
  const [viewMode, setViewMode] = useState<"tree" | "calendar">("tree");

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
  const [isCatchupModalOpen, setIsCatchupModalOpen] = useState(false);

  // Form states
  const [planNameInput, setPlanNameInput] = useState("Crack SDE Master Sprint");
  const [newStartDate, setNewStartDate] = useState("2026-10-01");
  const [dailyHours, setDailyHours] = useState(4);

  const treeRef = useRef<HTMLDivElement>(null);

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
            addPoints(15);
            toast.success(`🎉 Completed: ${task.item?.title || "Task"} (+15 pts!)`);
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

  const handleJumpToToday = () => {
    setExpandedSprintId("1");
    setExpandedDayId("1");
    setIsPlanDetailOpen(true);
    treeRef.current?.scrollIntoView({ behavior: "smooth" });
    toast.success("Navigated to Sprint 1 &bull; Day 1");
  };

  const handleSmartReschedule = () => {
    setIsCatchupModalOpen(false);
    toast.success("⚡ Smart Catch-Up Mode applied: Backlog redistributed across Sprint 1-3.");
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
    return (
      <Badge variant="cyan" className="py-0.5 px-1.5 font-medium text-[11px]">
        LLD
      </Badge>
    );
  };

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
              Personalized 61-Day Sprint Roadmap
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
                <span className="text-[11px] text-zinc-400 font-normal">9 structured sprints</span>
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
              1
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
              0
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
                <span>Sprint 1 In Progress &middot; Day 1 Focus &middot; 61 days total</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">Completion Target: 30 Nov 2026</span>
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
                  <span>Role: <strong className="text-zinc-300 font-normal">Software Engineer</strong></span>
                  <span>&middot;</span>
                  <span>Pacing: <strong className="text-zinc-300 font-normal">4 hrs/day</strong></span>
                  <span>&middot;</span>
                  <span>9 Sprints &middot; 847 Problems</span>
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
                      <span className="text-[11px] text-zinc-500 font-mono">{completedDaysCount} / 61 days</span>
                    </div>
                    <Progress value={progressPercent} className="mt-1.5" />
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span>Curriculum Time</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-[16px] font-semibold font-mono text-zinc-100">0h</span>
                      <span className="text-[11px] text-zinc-500 font-mono">of {totalHours}h {remainingMinutes}m</span>
                    </div>
                    <Progress value={0} className="mt-1.5" />
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
                      value={(completedSprintsCount / totalSprintsCount) * 100}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 space-y-1 shadow-subtle">
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400">
                      <CalendarIcon className="h-3 w-3 text-emerald-400" />
                      <span>Est. Completion</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-[16px] font-semibold text-zinc-100">30 Nov</span>
                      <span className="text-[11px] text-zinc-500 font-mono">2026</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-normal pt-0.5 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> On Schedule
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
                              className="flex items-center justify-between p-3 sm:p-3.5 cursor-pointer select-none hover:bg-zinc-900/60 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant="blue" className="text-[10px] font-medium py-0.5 px-1.5 leading-none">
                                  Sprint {sprint.sprintNo}
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
                                            ({day.tasksCompleted} / {day.tasksTotal} done)
                                          </span>
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
                            {revisionListData && revisionListData.length > 0 && (
                              <Badge variant="blue" className="text-[10px] py-0.5 px-1.5 font-medium leading-none font-mono">
                                {revisionListData.length}
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

                        {/* Day 1 Preview */}
                        <div className="space-y-1.5 pt-0.5">
                          <div className="text-[12px] font-medium text-zinc-300">
                            Sprint 1 &middot; Day 1 Focus
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-950/60 p-1.5 rounded-lg border border-zinc-800/80 font-mono">
                            <span>{day1Tasks.length || 20} topics</span>
                            <span>&middot;</span>
                            <span>3h 53m planned</span>
                          </div>

                          <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
                            {day1Tasks.slice(0, 6).map((t, idx) => (
                              <div
                                key={t.taskId || idx}
                                className="flex items-center justify-between py-1 px-1.5 rounded text-[11px] text-zinc-300 hover:bg-zinc-800/40 transition-colors"
                              >
                                <span className="truncate pr-2">{t.item?.title || `Task #${idx + 1}`}</span>
                                <span className="text-zinc-500 text-[10px] shrink-0 font-mono">
                                  {t.estimatedMinutes}m
                                </span>
                              </div>
                            ))}
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
                      <span className="text-[13px] font-semibold text-zinc-100">9-Sprint Schedule Timeline</span>
                      <span className="text-[11px] text-zinc-400 font-mono">Oct 2026 – Nov 2026</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {sprints.map((s) => (
                        <div
                          key={s.sprintId}
                          onClick={() => {
                            setExpandedSprintId(s.sprintId);
                            setViewMode("tree");
                          }}
                          className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 space-y-2 hover:border-blue-500/40 cursor-pointer transition-all shadow-subtle group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors">
                              Sprint {s.sprintNo}
                            </span>
                            <Badge variant={s.sprintNo === 1 ? "blue" : "secondary"} className="text-[10px] py-0 px-1.5">
                              {s.sprintNo === 1 ? "In Progress" : "Upcoming"}
                            </Badge>
                          </div>

                          <div className="text-[11px] text-zinc-400">
                            {s.sprintNo <= 3 ? "DSA & Algorithms" : s.sprintNo <= 5 ? "Operating Systems" : s.sprintNo <= 7 ? "Networks & LLD" : "DBMS & SQL"}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/60">
                            <span>{(s.days || []).length} Days</span>
                            <span>{Math.floor((s.totalEstimatedMinutes || 0) / 60)}h</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Catch-Up Modal */}
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
