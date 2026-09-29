"use client";

import React from "react";
import { Terminal } from "lucide-react";

interface ExecutionConsoleProps {
  stdout: string;
  stdin: string;
  onStdinChange: (val: string) => void;
}

export function ExecutionConsole({
  stdout,
  stdin,
  onStdinChange,
}: ExecutionConsoleProps) {
  return (
    <div className="lg:col-span-4 space-y-3.5">
      {/* Output Terminal Card */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle flex flex-col">
        <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2 text-[12px] font-semibold text-zinc-200">
          <Terminal className="h-3.5 w-3.5 text-blue-400" />
          <span>Console Output</span>
        </div>
        <pre className="p-3.5 bg-zinc-950 text-[11px] font-mono text-zinc-300 leading-relaxed min-h-[160px] max-h-[240px] overflow-y-auto whitespace-pre-wrap">
          {stdout}
        </pre>
      </div>

      {/* Stdin Card */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle p-3.5 space-y-1.5">
        <span className="text-[12px] font-semibold text-zinc-200">Custom Input (stdin)</span>
        <textarea
          placeholder="Enter standard input values (optional)..."
          value={stdin}
          onChange={(e) => onStdinChange(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2 font-mono text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}
