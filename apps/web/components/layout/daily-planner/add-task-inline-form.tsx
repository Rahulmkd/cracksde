"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddTaskInlineFormProps {
  onAddTask: (title: string, duration: string, category: string) => void;
  onCancel: () => void;
}

export function AddTaskInlineForm({ onAddTask, onCancel }: AddTaskInlineFormProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState("15m");
  const [newTaskCategory, setNewTaskCategory] = useState("DSA");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskDuration, newTaskCategory);
    setNewTaskTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 pt-1 border border-zinc-800 bg-zinc-950/80 p-2.5 rounded-lg animate-in fade-in-0 duration-150 select-none"
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
            onClick={onCancel}
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
  );
}
