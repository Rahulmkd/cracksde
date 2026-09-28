"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ListTodo,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  ArrowRight,
  Clock,
  Flame,
  Sparkles,
  DownloadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlannerStore } from "@/store/planner-store";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DailyPlannerProps {
  showProblemOfTheDay?: boolean;
  className?: string;
}

export function DailyPlanner({
  showProblemOfTheDay = true,
  className,
}: DailyPlannerProps) {
  const { tasks, addTask, importTasks, toggleTask, deleteTask, points } = usePlannerStore();
  const { plan } = useStudyPlan("crack-sde");

  const [mounted, setMounted] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState("15m");
  const [newTaskCategory, setNewTaskCategory] = useState("DSA");

  // Problem of the day countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 25, seconds: 9 });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (num: number) => num.toString().padStart(2, "0");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), newTaskDuration, newTaskCategory);
    setNewTaskTitle("");
    setIsAddingTask(false);
    toast.success("Task added to Daily Planner (+15 pts on completion)");
  };

  const handleToggle = (id: string, title: string) => {
    const isCompleted = toggleTask(id);
    if (isCompleted) {
      toast.success(`🎉 Completed: ${title} (+15 pts!)`);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(id);
    toast.info("Task removed");
  };

  // 1-Click Import from Today's Active Sprint
  const handleImportSprintTasks = () => {
    const activeSprint = plan?.sprints?.find((s) => s.status === "in_progress") || plan?.sprints?.[0];
    const activeDay = activeSprint?.days?.find((d) => d.status === "in_progress" || (d.tasksCompleted || 0) < (d.tasksTotal || 1)) || activeSprint?.days?.[0];
    const sprintTasks = activeDay?.tasks || [];

    if (sprintTasks.length === 0) {
      toast.info("No active sprint tasks found to import.");
      return;
    }

    const tasksToImport = sprintTasks.slice(0, 3).map((t) => ({
      title: t.item?.title || "Sprint Study Topic",
      duration: `${t.estimatedMinutes || 20}m`,
      category: t.item?.subjectSlug?.toUpperCase() || "DSA",
    }));

    const count = importTasks(tasksToImport);
    if (count > 0) {
      toast.success(`⚡ Imported ${count} sprint tasks into your Daily Planner!`);
    } else {
      toast.info("Today's sprint tasks are already in your planner.");
    }
  };

  if (!mounted) {
    return (
      <div className={cn("space-y-4", className)}>
        {showProblemOfTheDay && (
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 animate-pulse h-36" />
        )}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 animate-pulse h-64" />
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className={cn("space-y-4 select-none", className)}>
      {/* ========================================================================= */}
      {/* PROBLEM OF THE DAY CARD */}
      {/* ========================================================================= */}
      {showProblemOfTheDay && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-3 shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-200">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Problem Of The Day</span>
            </div>
            <Badge variant="blue" className="text-[10px] font-medium py-0.5 px-1.5 leading-none">
              +20 pts
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-[12px] font-medium text-zinc-100 truncate">
              Trapping Rain Water (Two Pointers)
            </div>
            <div className="text-[11px] text-zinc-400 font-normal">
              DSA &middot; Hard / Pro &middot; 35m est.
            </div>
          </div>

          {/* Countdown Display */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            <div className="flex flex-col items-center">
              <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[12px] font-semibold text-zinc-100 shadow-inner">
                {formatDigits(timeLeft.hours)}
              </span>
            </div>
            <span className="text-zinc-600 font-semibold text-[11px]">:</span>
            <div className="flex flex-col items-center">
              <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[12px] font-semibold text-zinc-100 shadow-inner">
                {formatDigits(timeLeft.minutes)}
              </span>
            </div>
            <span className="text-zinc-600 font-semibold text-[11px]">:</span>
            <div className="flex flex-col items-center">
              <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[12px] font-semibold text-zinc-100 shadow-inner">
                {formatDigits(timeLeft.seconds)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            asChild
            size="sm"
            className="w-full h-7 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Link href="/practice">
              Solve problem <ArrowRight className="h-3 w-3 ml-1.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DAILY PLANNER CARD */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-3 shadow-subtle">
        {/* Planner Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-200">
            <ListTodo className="h-3.5 w-3.5 text-blue-400" />
            <span>Daily Planner</span>
          </div>
          {tasks.length > 0 && (
            <span className="text-[11px] font-mono text-zinc-400">
              {completedCount}/{tasks.length} done
            </span>
          )}
        </div>

        {/* 1-Click Import Sprint Tasks Button */}
        <button
          type="button"
          onClick={handleImportSprintTasks}
          className="w-full rounded-lg border border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/30 hover:border-blue-500/40 p-1.5 text-[11px] font-medium text-blue-300 flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
        >
          <DownloadCloud className="h-3.5 w-3.5 text-blue-400" />
          <span>+ Import Today&apos;s Sprint Tasks</span>
        </button>

        {/* Inline Add Task Form */}
        {isAddingTask && (
          <form
            onSubmit={handleCreateTask}
            className="space-y-2 pt-1 border border-zinc-800 bg-zinc-950/80 p-2.5 rounded-lg animate-in fade-in-0 duration-150"
          >
            <input
              type="text"
              placeholder="Task title (e.g. Solve LRU Cache)..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <Clock className="h-3 w-3 text-zinc-500" />
                <select
                  value={newTaskDuration}
                  onChange={(e) => setNewTaskDuration(e.target.value)}
                  className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[11px] text-zinc-300 focus:outline-none"
                >
                  <option value="10m">10 min</option>
                  <option value="15m">15 min</option>
                  <option value="20m">20 min</option>
                  <option value="30m">30 min</option>
                  <option value="45m">45 min</option>
                  <option value="60m">1 hour</option>
                </select>

                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[11px] text-zinc-300 focus:outline-none"
                >
                  <option value="DSA">DSA</option>
                  <option value="DBMS">DBMS</option>
                  <option value="OS">OS</option>
                  <option value="CN">CN</option>
                  <option value="LLD">LLD</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle("");
                  }}
                  className="h-5 px-1.5 text-[11px] font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-5 px-2 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Add
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Task List / Empty State */}
        {tasks.length > 0 ? (
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-0.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg border border-zinc-800/60 bg-zinc-950/50 text-[12px] hover:bg-zinc-900/80 transition-all group",
                  task.completed && "opacity-60 bg-zinc-950/20"
                )}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleToggle(task.id, task.title)}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      task.completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-700 bg-zinc-900 hover:border-blue-500"
                    )}
                    aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                  >
                    {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>

                  <div className="truncate">
                    <span
                      onClick={() => handleToggle(task.id, task.title)}
                      className={cn(
                        "truncate cursor-pointer font-normal text-zinc-200 text-[12px] leading-snug hover:text-blue-400 transition-colors block",
                        task.completed && "line-through text-zinc-500"
                      )}
                    >
                      {task.title}
                    </span>
                    {task.category && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {task.duration}
                  </span>
                  <button
                    onClick={(e) => handleDelete(task.id, e)}
                    className="text-zinc-600 hover:text-red-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-5 text-center space-y-1.5">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-500">
              <ListTodo className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[12px] font-medium text-zinc-300">No tasks for today</p>
              <p
                onClick={() => setIsAddingTask(true)}
                className="text-[11px] text-zinc-500 hover:text-blue-400 cursor-pointer transition-colors"
              >
                Click here to add custom task
              </p>
            </div>
          </div>
        )}

        {/* Bottom "+ Add task" Button */}
        {!isAddingTask && (
          <button
            type="button"
            onClick={() => setIsAddingTask(true)}
            className="w-full rounded-lg border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-700/80 p-1.5 text-[12px] font-medium text-zinc-300 flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
          >
            <Plus className="h-3 w-3 text-blue-400" />
            <span>+ Add custom task</span>
          </button>
        )}
      </div>
    </div>
  );
}
