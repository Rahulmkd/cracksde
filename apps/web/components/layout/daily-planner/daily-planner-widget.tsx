"use client";

import React, { useState, useEffect } from "react";
import { ListTodo, Plus } from "lucide-react";
import { usePlannerStore } from "@/store/planner-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProblemOfTheDay } from "./problem-of-the-day";
import { TaskList } from "./task-list";
import { AddTaskInlineForm } from "./add-task-inline-form";

export interface DailyPlannerWidgetProps {
  showProblemOfTheDay?: boolean;
  className?: string;
}

export function DailyPlannerWidget({
  showProblemOfTheDay = true,
  className,
}: DailyPlannerWidgetProps) {
  const { tasks, addTask, toggleTask, deleteTask } = usePlannerStore();

  const [mounted, setMounted] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateTask = (title: string, duration: string, category: string) => {
    addTask(title, duration, category);
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

  if (!mounted) {
    return (
      <div className={cn("space-y-4", className)}>
        {showProblemOfTheDay && (
          <div className="rounded-2xl border border-zinc-800/80 bg-[#0c1017] p-4 animate-pulse h-36" />
        )}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0c1017] p-4 animate-pulse h-64" />
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className={cn("space-y-4 select-none", className)}>
      {/* Problem of the Day */}
      {showProblemOfTheDay && <ProblemOfTheDay />}

      {/* Daily Planner Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 shadow-subtle">
        {/* Planner Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] font-bold text-zinc-100">
            <ListTodo className="h-4 w-4 text-blue-400" />
            <span>Daily Planner</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded-md">
              {completedCount}/{tasks.length} done
            </span>
            {!isAddingTask && (
              <button
                type="button"
                onClick={() => setIsAddingTask(true)}
                className="h-6 w-6 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-blue-400 text-zinc-400 flex items-center justify-center transition-colors"
                title="Add task"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar (Visible when tasks exist) */}
        {tasks.length > 0 && (
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-zinc-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Inline Add Task Form */}
        {isAddingTask && (
          <AddTaskInlineForm
            onAddTask={handleCreateTask}
            onCancel={() => setIsAddingTask(false)}
          />
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onToggleTask={handleToggle}
          onDeleteTask={handleDelete}
          onAddNewTaskClick={() => setIsAddingTask(true)}
        />

        {/* Bottom "+ Add custom task" Button */}
        {!isAddingTask && tasks.length > 0 && (
          <button
            type="button"
            onClick={() => setIsAddingTask(true)}
            className="w-full py-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-zinc-700 text-[12px] font-medium text-zinc-400 hover:text-blue-400 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add task</span>
          </button>
        )}
      </div>
    </div>
  );
}

