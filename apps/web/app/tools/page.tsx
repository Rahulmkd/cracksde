"use client";

import React, { useState } from "react";
import {
  Wrench,
  Calculator,
  Binary,
  Code2,
  Database,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ToolsPage() {
  // Bitwise Tool State
  const [numA, setNumA] = useState<number>(12);
  const [numB, setNumB] = useState<number>(25);

  const bitAnd = numA & numB;
  const bitOr = numA | numB;
  const bitXor = numA ^ numB;
  const bitNotA = ~numA;
  const bitLeftShift = numA << 1;
  const bitRightShift = numA >> 1;

  const toBin = (n: number) => (n >>> 0).toString(2).padStart(8, "0");

  const handleCopyValue = (val: string | number) => {
    navigator.clipboard.writeText(val.toString());
    toast.success(`Copied: ${val}`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[12px] font-medium text-zinc-300 uppercase tracking-wider">
            <Wrench className="h-3.5 w-3.5 text-blue-400" />
            <span>Developer Tools</span>
          </div>
          <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
            Interview Utility Tools
          </h1>
          <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
            Interactive bitwise calculators, Big-O complexity tables, and SQL visualizers to support your preparation.
          </p>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOOL 1: INTERACTIVE BITWISE CALCULATOR */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 shadow-subtle flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[16px] font-semibold leading-[1.35] text-zinc-100">
                <Binary className="h-4 w-4 text-blue-400" />
                <span>Bitwise Operations Visualizer</span>
              </div>
              <Badge variant="blue" className="text-[12px] font-medium">Bit Manipulation</Badge>
            </div>
            <p className="text-[13px] font-normal text-zinc-400 leading-[1.45]">
              Experiment with binary arithmetic and bitwise operators for low-level &amp; bitmask problems.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-zinc-300">Operand A (decimal)</label>
              <input
                type="number"
                value={numA}
                onChange={(e) => setNumA(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[12px] font-mono text-zinc-500">Bin: {toBin(numA)}</span>
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-medium text-zinc-300">Operand B (decimal)</label>
              <input
                type="number"
                value={numB}
                onChange={(e) => setNumB(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[12px] font-mono text-zinc-500">Bin: {toBin(numB)}</span>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-[13px] font-mono space-y-2 divide-y divide-zinc-800/60">
            <div
              onClick={() => handleCopyValue(bitAnd)}
              className="flex items-center justify-between pt-1 cursor-pointer hover:text-blue-400 transition-colors"
            >
              <span className="text-zinc-400">A &amp; B (AND):</span>
              <span className="text-zinc-200 font-semibold">{bitAnd} ({toBin(bitAnd)})</span>
            </div>
            <div
              onClick={() => handleCopyValue(bitOr)}
              className="flex items-center justify-between pt-1.5 cursor-pointer hover:text-blue-400 transition-colors"
            >
              <span className="text-zinc-400">A | B (OR):</span>
              <span className="text-zinc-200 font-semibold">{bitOr} ({toBin(bitOr)})</span>
            </div>
            <div
              onClick={() => handleCopyValue(bitXor)}
              className="flex items-center justify-between pt-1.5 cursor-pointer hover:text-blue-400 transition-colors"
            >
              <span className="text-zinc-400">A ^ B (XOR):</span>
              <span className="text-zinc-200 font-semibold">{bitXor} ({toBin(bitXor)})</span>
            </div>
            <div
              onClick={() => handleCopyValue(bitLeftShift)}
              className="flex items-center justify-between pt-1.5 cursor-pointer hover:text-blue-400 transition-colors"
            >
              <span className="text-zinc-400">A &lt;&lt; 1 (Shift Left):</span>
              <span className="text-zinc-200 font-semibold">{bitLeftShift} ({toBin(bitLeftShift)})</span>
            </div>
          </div>
        </div>

        {/* TOOL 2: BIG-O COMPLEXITY CHEATSHEET */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 shadow-subtle flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[16px] font-semibold leading-[1.35] text-zinc-100">
                <Calculator className="h-4 w-4 text-emerald-400" />
                <span>Common Time &amp; Space Complexities</span>
              </div>
              <Badge variant="success" className="text-[12px] font-medium">Cheatsheet</Badge>
            </div>
            <p className="text-[13px] font-normal text-zinc-400 leading-[1.45]">
              Quick reference for standard operations across common data structures and algorithms.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
            <div className="grid grid-cols-4 gap-2 border-b border-zinc-800 px-3 py-2 text-[12px] font-medium text-zinc-400 bg-zinc-900/60 uppercase tracking-wider">
              <div>Data Structure</div>
              <div className="text-center">Access</div>
              <div className="text-center">Search</div>
              <div className="text-center">Insertion</div>
            </div>
            <div className="divide-y divide-zinc-800/60 font-mono text-[12px]">
              <div className="grid grid-cols-4 gap-2 px-3 py-2 text-zinc-300 items-center">
                <span className="font-sans font-normal text-[13px] text-zinc-200">Array / Vector</span>
                <span className="text-emerald-400 text-center">O(1)</span>
                <span className="text-amber-400 text-center">O(n)</span>
                <span className="text-amber-400 text-center">O(n)</span>
              </div>
              <div className="grid grid-cols-4 gap-2 px-3 py-2 text-zinc-300 items-center">
                <span className="font-sans font-normal text-[13px] text-zinc-200">Hash Map</span>
                <span className="text-zinc-500 text-center">N/A</span>
                <span className="text-emerald-400 text-center">O(1)</span>
                <span className="text-emerald-400 text-center">O(1)</span>
              </div>
              <div className="grid grid-cols-4 gap-2 px-3 py-2 text-zinc-300 items-center">
                <span className="font-sans font-normal text-[13px] text-zinc-200">Binary Search Tree</span>
                <span className="text-cyan-400 text-center">O(log n)</span>
                <span className="text-cyan-400 text-center">O(log n)</span>
                <span className="text-cyan-400 text-center">O(log n)</span>
              </div>
              <div className="grid grid-cols-4 gap-2 px-3 py-2 text-zinc-300 items-center">
                <span className="font-sans font-normal text-[13px] text-zinc-200">Min/Max Heap</span>
                <span className="text-emerald-400 text-center">O(1)</span>
                <span className="text-amber-400 text-center">O(n)</span>
                <span className="text-cyan-400 text-center">O(log n)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
