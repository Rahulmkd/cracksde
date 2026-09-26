"use client";

import React from "react";
import { Search, Flame, Menu, User } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

export function Header() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Search, Coins, Streak, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search */}
          <button
            onClick={() => {}}
            className="flex items-center gap-2 rounded-lg border border-zinc-800/90 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              Search problems, subjects...
            </span>
            <kbd className="hidden rounded bg-zinc-800 px-1 py-0.2 font-mono text-[10px] text-zinc-400 sm:inline">
              ⌘
            </kbd>
          </button>

          {/* Coin Counter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-xs font-semibold text-amber-300">
            <span>🟡</span>
            <span>2</span>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-xs font-semibold text-orange-400">
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            <span>0</span>
          </div>

          {/* Profile */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Profile"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
