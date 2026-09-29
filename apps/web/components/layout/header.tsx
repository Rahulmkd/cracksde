"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Flame, Menu } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { usePlannerStore } from "@/store/planner-store";
import { CommandPaletteDialog } from "@/components/search/command-palette-dialog";

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { points, streak } = usePlannerStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile Navigation Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Right: Universal Search, Gamified Points, Streak, User Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-8 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 text-[12px] font-normal text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <Search className="h-3.5 w-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Search problems, tracks, tools...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden rounded bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline">
                ⌘K
              </kbd>
            </button>

            {/* Reactive Coins / Points Counter */}
            <div
              className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2.5 text-[12px] font-semibold text-amber-300 select-none shadow-subtle hover:border-amber-500/30 transition-colors"
              title={`${points} CrackSDE Study Points (Earn +15 per task solved)`}
            >
              <span className="text-[12px]">🟡</span>
              <span className="text-[12px] font-mono font-medium">{points}</span>
            </div>

            {/* Reactive Streak Counter */}
            <div
              className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2.5 text-[12px] font-semibold text-orange-400 select-none shadow-subtle hover:border-orange-500/30 transition-colors"
              title={`Current Daily Streak: ${streak} days`}
            >
              <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span className="text-[12px] font-mono font-medium">{streak}</span>
            </div>

            {/* Profile Avatar */}
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-blue-600/20 text-[11px] font-semibold text-blue-400 transition-colors hover:border-blue-500/50 hover:bg-blue-600/30"
              aria-label="User Profile"
              title="Rahul Mahakud"
            >
              RA
            </button>
          </div>
        </div>
      </header>

      {/* Universal Command Palette (⌘K) */}
      <CommandPaletteDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
