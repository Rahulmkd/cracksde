"use client";

import React from "react";
import { Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COMPLEXITY_DATA = [
  { name: "Array / Vector", access: "O(1)", search: "O(n)", insert: "O(n)" },
  { name: "Hash Map / Set", access: "N/A", search: "O(1)", insert: "O(1)" },
  { name: "Binary Search Tree", access: "O(log n)", search: "O(log n)", insert: "O(log n)" },
  { name: "Binary Heap (Priority Queue)", access: "O(1)", search: "O(n)", insert: "O(log n)" },
  { name: "Singly Linked List", access: "O(n)", search: "O(n)", insert: "O(1)" },
  { name: "Graph (Adjacency List)", access: "O(1)", search: "O(V + E)", insert: "O(1)" },
];

export function BigOCheatsheet() {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3.5 shadow-subtle flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] font-semibold leading-snug text-zinc-100">
            <Calculator className="h-4 w-4 text-emerald-400" />
            <span>Common Time &amp; Space Complexities</span>
          </div>
          <Badge variant="success" className="text-[11px] font-medium py-0 px-2">
            Cheatsheet
          </Badge>
        </div>
        <p className="text-[12px] font-normal text-zinc-400 leading-normal">
          Quick reference for standard operations across common data structures and algorithms.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
        <div className="grid grid-cols-4 gap-2 border-b border-zinc-800 px-3 py-1.5 text-[11px] font-medium text-zinc-400 bg-zinc-900/60 uppercase tracking-wider">
          <div>Data Structure</div>
          <div className="text-center">Access</div>
          <div className="text-center">Search</div>
          <div className="text-center">Insertion</div>
        </div>
        <div className="divide-y divide-zinc-800/60 font-mono text-[11px]">
          {COMPLEXITY_DATA.map((row) => (
            <div key={row.name} className="grid grid-cols-4 gap-2 px-3 py-1.5 text-zinc-300 items-center">
              <span className="font-sans font-normal text-[12px] text-zinc-200">{row.name}</span>
              <span
                className={`text-center ${
                  row.access === "O(1)"
                    ? "text-emerald-400"
                    : row.access === "N/A"
                    ? "text-zinc-500"
                    : "text-amber-400"
                }`}
              >
                {row.access}
              </span>
              <span
                className={`text-center ${
                  row.search === "O(1)"
                    ? "text-emerald-400"
                    : row.search === "O(log n)"
                    ? "text-blue-400"
                    : "text-amber-400"
                }`}
              >
                {row.search}
              </span>
              <span
                className={`text-center ${
                  row.insert === "O(1)"
                    ? "text-emerald-400"
                    : row.insert === "O(log n)"
                    ? "text-blue-400"
                    : "text-amber-400"
                }`}
              >
                {row.insert}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
