"use client";

import React, { useState } from "react";
import { Binary } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function BitwiseVisualizer() {
  const [numA, setNumA] = useState<number>(12);
  const [numB, setNumB] = useState<number>(25);

  const bitAnd = numA & numB;
  const bitOr = numA | numB;
  const bitXor = numA ^ numB;
  const bitLeftShift = numA << 1;

  const toBin = (n: number) => (n >>> 0).toString(2).padStart(8, "0");

  const handleCopyValue = (val: string | number) => {
    navigator.clipboard.writeText(val.toString());
    toast.success(`Copied: ${val}`);
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3.5 shadow-subtle flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] font-semibold leading-snug text-zinc-100">
            <Binary className="h-4 w-4 text-blue-400" />
            <span>Bitwise Operations Visualizer</span>
          </div>
          <Badge variant="blue" className="text-[11px] font-medium py-0 px-2">
            Bit Manipulation
          </Badge>
        </div>
        <p className="text-[12px] font-normal text-zinc-400 leading-normal">
          Experiment with binary arithmetic and bitwise operators for low-level &amp; bitmask problems.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-zinc-300">Operand A (decimal)</label>
          <input
            type="number"
            value={numA}
            onChange={(e) => setNumA(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500"
          />
          <span className="text-[11px] font-mono text-zinc-500">Bin: {toBin(numA)}</span>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-medium text-zinc-300">Operand B (decimal)</label>
          <input
            type="number"
            value={numB}
            onChange={(e) => setNumB(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500"
          />
          <span className="text-[11px] font-mono text-zinc-500">Bin: {toBin(numB)}</span>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-[12px] font-mono space-y-1.5 divide-y divide-zinc-800/60">
        <div
          onClick={() => handleCopyValue(bitAnd)}
          className="flex items-center justify-between pt-1 cursor-pointer hover:text-blue-400 transition-colors"
        >
          <span className="text-zinc-400">A &amp; B (AND):</span>
          <span className="text-zinc-200 font-semibold">{bitAnd} ({toBin(bitAnd)})</span>
        </div>
        <div
          onClick={() => handleCopyValue(bitOr)}
          className="flex items-center justify-between pt-1 cursor-pointer hover:text-blue-400 transition-colors"
        >
          <span className="text-zinc-400">A | B (OR):</span>
          <span className="text-zinc-200 font-semibold">{bitOr} ({toBin(bitOr)})</span>
        </div>
        <div
          onClick={() => handleCopyValue(bitXor)}
          className="flex items-center justify-between pt-1 cursor-pointer hover:text-blue-400 transition-colors"
        >
          <span className="text-zinc-400">A ^ B (XOR):</span>
          <span className="text-zinc-200 font-semibold">{bitXor} ({toBin(bitXor)})</span>
        </div>
        <div
          onClick={() => handleCopyValue(bitLeftShift)}
          className="flex items-center justify-between pt-1 cursor-pointer hover:text-blue-400 transition-colors"
        >
          <span className="text-zinc-400">A &lt;&lt; 1 (Shift Left):</span>
          <span className="text-zinc-200 font-semibold">{bitLeftShift} ({toBin(bitLeftShift)})</span>
        </div>
      </div>
    </div>
  );
}
