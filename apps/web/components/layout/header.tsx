"use client";

import React, { useState } from "react";
import { Search, Flame, Menu, User, Sparkles, X } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function Header() {
  const { toggleSidebar } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Search quick links
  const searchResults = [
    { title: "Data Structures & Algorithms", category: "Subject", href: "/prep-hub" },
    { title: "Dynamic Programming Patterns", category: "Topic", href: "/practice" },
    { title: "Binary Trees & Graphs", category: "Topic", href: "/practice" },
    { title: "Database Management Systems", category: "Subject", href: "/prep-hub" },
    { title: "Operating Systems Internals", category: "Subject", href: "/prep-hub" },
    { title: "Low Level Design (LLD)", category: "Subject", href: "/prep-hub" },
    { title: "Planly Study Sprint", category: "Planner", href: "/planly" },
    { title: "Revision List", category: "Practice", href: "/planly" },
  ].filter(
    (item) =>
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSearch = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Right: Quick Search, Points, Streak, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-8 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <Search className="h-3.5 w-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Search problems, subjects...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden rounded bg-zinc-800 border border-zinc-700/60 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline">
                ⌘K
              </kbd>
            </button>

            {/* Coin / Points Counter */}
            <div
              className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2.5 text-xs font-semibold text-amber-300 select-none"
              title="2 CrackSDE Points"
            >
              <span className="text-xs">🟡</span>
              <span className="font-mono text-xs">2</span>
            </div>

            {/* Streak Counter */}
            <div
              className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2.5 text-xs font-semibold text-orange-400 select-none"
              title="Current Daily Streak: 0 days"
            >
              <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
              <span className="font-mono text-xs">0</span>
            </div>

            {/* Profile Avatar Button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-blue-600/20 text-xs font-semibold text-blue-400 transition-colors hover:border-blue-500/50 hover:bg-blue-600/30"
              aria-label="User Profile"
              title="Rahul Mahakud"
            >
              RA
            </button>
          </div>
        </div>
      </header>

      {/* Global Quick Search Dialog (⌘K) */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-zinc-950 border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 bg-zinc-900/50">
            <Search className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="Type a subject, topic, or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-zinc-500 hover:text-zinc-300 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {searchResults.length > 0 ? (
              searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSearch(item.href)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white cursor-pointer transition-colors"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                    {item.category}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-zinc-500">
                No matching results found for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800/80 bg-zinc-950/80 px-4 py-2 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Navigate with click</span>
            <span>ESC to close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
