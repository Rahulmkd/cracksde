"use client";

import React from "react";
import { ListTodo, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyTask } from "@/store/planner-store";

interface TaskListProps {
  tasks: DailyTask[];
  onToggleTask: (id: string, title: string) => void;
  onDeleteTask: (id: string, e: React.MouseEvent) => void;
  onAddNewTaskClick: () => void;
}

export function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddNewTaskClick,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-5 text-center space-y-1.5 select-none">
        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-500">
          <ListTodo className="h-3.5 w-3.5 text-zinc-400" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[12px] font-medium text-zinc-300">No tasks for today</p>
          <p
            onClick={onAddNewTaskClick}
            className="text-[11px] text-zinc-500 hover:text-blue-400 cursor-pointer transition-colors"
          >
            Click here to add custom task
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5 select-none">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-center justify-between p-2.5 rounded-lg border border-zinc-800/70 bg-[#080c14]/80 text-[12px] hover:bg-zinc-900/50 hover:border-zinc-700/80 transition-all group",
            task.completed && "opacity-60 bg-zinc-950/20"
          )}
        >
          <div className="flex items-start gap-2.5 overflow-hidden">
            <button
              type="button"
              onClick={() => onToggleTask(task.id, task.title)}
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors mt-0.5",
                task.completed
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-zinc-700 bg-zinc-900/80 hover:border-blue-500"
              )}
              aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
            >
              {task.completed && <Check className="h-3 w-3 stroke-[3]" />}
            </button>

            <div className="truncate pr-1">
              <span
                onClick={() => onToggleTask(task.id, task.title)}
                className={cn(
                  "truncate cursor-pointer font-medium text-zinc-200 text-[12px] leading-snug hover:text-blue-400 transition-colors block",
                  task.completed && "line-through text-zinc-500"
                )}
              >
                {task.title}
              </span>
              {task.category && (
                <span className="text-[10px] text-zinc-500 font-normal mt-0.5 block">
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
              onClick={(e) => onDeleteTask(task.id, e)}
              className="text-zinc-600 hover:text-red-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
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

