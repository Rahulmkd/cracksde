"use client";

import React from "react";
import { Wrench } from "lucide-react";
import { BitwiseVisualizer } from "./bitwise-visualizer";
import { BigOCheatsheet } from "./big-o-cheatsheet";

export function DeveloperTools() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <Wrench className="h-3 w-3 text-blue-400" />
            <span>Developer Tools</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            Interview Utility Tools
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Interactive bitwise calculators, Big-O complexity tables, and utility reference guides to support your preparation.
          </p>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BitwiseVisualizer />
        <BigOCheatsheet />
      </div>
    </div>
  );
}
