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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlannerStore } from "@/store/planner-store";
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
  const { tasks, addTask, toggleTask, deleteTask } = usePlannerStore();
  const [mounted, setMounted] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState("15m");

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
    addTask(newTaskTitle.trim(), newTaskDuration);
    setNewTaskTitle("");
    setIsAddingTask(false);
    toast.success("Task added to Daily Planner");
  };

  const handleToggle = (id: string, title: string, completed: boolean) => {
    toggleTask(id);
    if (!completed) {
      toast.success(`Completed: ${title}`);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(id);
    toast.info("Task removed");
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

  return (
    <div className={cn("space-y-4", className)}>
      {/* ========================================================================= */}
      {/* PROBLEM OF THE DAY CARD (IF ENABLED) */}
      {/* ========================================================================= */}
      {showProblemOfTheDay && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3.5 shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
              <span>Problem Of The Day</span>
              <ExternalLink className="h-3 w-3 text-zinc-500" />
            </div>
            <Badge variant="blue" className="text-[10px] font-mono py-0 px-1.5">
              +20 pts
            </Badge>
          </div>

          {/* Countdown Display */}
          <div className="flex items-center justify-center gap-2 py-1">
            <div className="flex flex-col items-center">
              <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 font-mono text-sm font-bold text-zinc-100 shadow-inner">
                {formatDigits(timeLeft.hours)}
              </span>
            </div>
            <span className="text-zinc-600 font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 font-mono text-sm font-bold text-zinc-100 shadow-inner">
                {formatDigits(timeLeft.minutes)}
              </span>
            </div>
            <span className="text-zinc-600 font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 font-mono text-sm font-bold text-zinc-100 shadow-inner">
                {formatDigits(timeLeft.seconds)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            asChild
            size="sm"
            className="w-full h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Link href="/practice">
              Solve problem <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DAILY PLANNER CARD (SHARED & PERSISTENT) */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3.5 shadow-subtle">
        {/* Planner Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <ListTodo className="h-4 w-4 text-blue-400" />
            <span>Daily Planner</span>
          </div>
          {tasks.length > 0 && (
            <span className="text-[10px] font-mono text-zinc-500">
              {tasks.filter((t) => t.completed).length}/{tasks.length} done
            </span>
          )}
        </div>

        {/* Inline Add Task Form */}
        {isAddingTask && (
          <form onSubmit={handleCreateTask} className="space-y-2 pt-1 border border-zinc-800 bg-zinc-950/80 p-2.5 rounded-lg animate-in fade-in-0 duration-150">
            <input
              type="text"
              placeholder="Task name (e.g. Solve LRU Cache)..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
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
                  className="h-6 px-2 text-[10px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-6 px-2.5 text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
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
                  "flex items-center justify-between p-2 rounded-lg border border-zinc-800/60 bg-zinc-950/50 text-xs hover:bg-zinc-900/80 transition-all group",
                  task.completed && "opacity-60 bg-zinc-950/20"
                )}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleToggle(task.id, task.title, task.completed)}
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

                  <span
                    onClick={() => handleToggle(task.id, task.title, task.completed)}
                    className={cn(
                      "truncate cursor-pointer font-medium text-zinc-200 text-[11px] hover:text-blue-400 transition-colors",
                      task.completed && "line-through text-zinc-500"
                    )}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  <span className="font-mono text-[10px] text-zinc-500">
                    {task.duration}
                  </span>
                  <button
                    onClick={(e) => handleDelete(task.id, e)}
                    className="text-zinc-600 hover:text-red-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete task"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-500">
              <ListTodo className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-zinc-300">No tasks for today</p>
              <p
                onClick={() => setIsAddingTask(true)}
                className="text-[11px] text-zinc-500 hover:text-blue-400 cursor-pointer transition-colors"
              >
                Click here to add your tasks
              </p>
            </div>
          </div>
        )}

        {/* Bottom "+ Add tasks" Button */}
        {!isAddingTask && (
          <button
            type="button"
            onClick={() => setIsAddingTask(true)}
            className="w-full rounded-lg border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-700/80 p-2 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
          >
            <Plus className="h-3.5 w-3.5 text-blue-400" />
            <span>+ Add tasks</span>
          </button>
        )}
      </div>
    </div>
  );
}
