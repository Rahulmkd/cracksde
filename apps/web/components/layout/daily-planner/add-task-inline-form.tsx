"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddTaskInlineFormProps {
  onAddTask: (title: string, duration: string, category: string) => void;
  onCancel: () => void;
}

const CATEGORIES = ["DSA", "DBMS", "OS", "System Design", "LLD", "Custom"];
const DURATIONS = ["10m", "15m", "20m", "30m", "45m", "60m"];

export function AddTaskInlineForm({ onAddTask, onCancel }: AddTaskInlineFormProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState("15m");
  const [newTaskCategory, setNewTaskCategory] = useState("DSA");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskDuration, newTaskCategory);
    setNewTaskTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border border-zinc-800 bg-zinc-950/80 p-3.5 rounded-xl animate-in fade-in-0 duration-150 select-none shadow-subtle"
    >
      <div className="space-y-1.5">
        <input
          ref={inputRef}
          type="text"
          placeholder="What do you plan to solve today?..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="w-full rounded-lg border border-zinc-700/80 bg-zinc-900/90 px-3 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal transition-colors"
        />

        {/* Quick Category Selector Chips */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setNewTaskCategory(cat)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors border",
                newTaskCategory === cat
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <Clock className="h-3 w-3 text-zinc-500" />
          <select
            value={newTaskDuration}
            onChange={(e) => setNewTaskDuration(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-900/90 px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-blue-500"
          >
            {DURATIONS.map((dur) => (
              <option key={dur} value={dur}>
                {dur}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-6 px-2 text-[11px] font-medium border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!newTaskTitle.trim()}
            className="h-6 px-2.5 text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md disabled:opacity-40"
          >
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
}
