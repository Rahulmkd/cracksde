"use client";

import React, { useState, useEffect } from "react";
import { ListTodo, Plus, DownloadCloud } from "lucide-react";
import { usePlannerStore } from "@/store/planner-store";
import { useStudyPlan } from "@/hooks/use-study-plan";
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
  const { tasks, addTask, importTasks, toggleTask, deleteTask } = usePlannerStore();
  const { plan } = useStudyPlan("crack-sde");

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

  // 1-Click Import from Today's Active Sprint
  const handleImportSprintTasks = () => {
    const activeSprint =
      plan?.sprints?.find((s) => s.status === "in_progress") || plan?.sprints?.[0];
    const activeDay =
      activeSprint?.days?.find(
        (d) => d.status === "in_progress" || (d.tasksCompleted || 0) < (d.tasksTotal || 1)
      ) || activeSprint?.days?.[0];
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
      {/* Problem of the Day */}
      {showProblemOfTheDay && <ProblemOfTheDay />}

      {/* Daily Planner Card */}
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
