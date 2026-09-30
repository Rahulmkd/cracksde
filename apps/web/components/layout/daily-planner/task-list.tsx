"use client";

import React from "react";
import { ListTodo, Check, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyTask } from "@/store/planner-store";

interface TaskListProps {
  tasks: DailyTask[];
  onToggleTask: (id: string, title: string) => void;
  onDeleteTask: (id: string, e: React.MouseEvent) => void;
  onAddNewTaskClick: () => void;
}

const getCategoryStyle = (category?: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("dsa")) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
  if (cat.includes("dbms") || cat.includes("sql")) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
  if (cat.includes("os") || cat.includes("cn") || cat.includes("core")) return "text-purple-400 bg-purple-500/10 border-purple-500/20";
  if (cat.includes("lld") || cat.includes("system") || cat.includes("design")) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-zinc-400 bg-zinc-900 border-zinc-800";
};

export function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddNewTaskClick,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center space-y-3 select-none rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 shadow-subtle">
          <ListTodo className="h-5 w-5 text-zinc-400" />
        </div>
        <div className="space-y-1">
          <p className="text-[13px] font-semibold text-zinc-200">No tasks for today</p>
          <p className="text-[11px] text-zinc-500 max-w-[200px] mx-auto">
            Plan your daily coding goals and earn points on completion.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNewTaskClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 text-[12px] font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add first task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5 select-none">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-center justify-between p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 text-[12px] hover:bg-zinc-900/60 hover:border-zinc-700/80 transition-all group shadow-subtle",
            task.completed && "opacity-60 bg-zinc-950/40"
          )}
        >
          <div className="flex items-start gap-2.5 overflow-hidden flex-1 min-w-0 pr-2">
            <button
              type="button"
              onClick={() => onToggleTask(task.id, task.title)}
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors mt-0.5",
                task.completed
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-zinc-700 bg-zinc-900/90 hover:border-blue-500"
              )}
              aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
            >
              {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
            </button>

            <div className="truncate flex-1 min-w-0">
              <span
                onClick={() => onToggleTask(task.id, task.title)}
                className={cn(
                  "truncate cursor-pointer font-medium text-zinc-200 text-[12px] leading-snug hover:text-blue-400 transition-colors block",
                  task.completed && "line-through text-zinc-500"
                )}
              >
                {task.title}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {task.category && (
                  <span className={cn("text-[9px] font-medium font-mono px-1.5 py-0.2 rounded border", getCategoryStyle(task.category))}>
                    {task.category}
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 font-mono">
                  {task.duration}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => onDeleteTask(task.id, e)}
              className="text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

