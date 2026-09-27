"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Flame,
  Menu,
  Sparkles,
  X,
  Code2,
  Database,
  Cpu,
  Network,
  Layers,
  BookOpen,
  FileText,
  ListTodo,
  FolderCode,
  HelpCircle,
  Wrench,
  Lock,
  GitBranch,
  Plus,
  Play,
  ArrowRight,
  Compass,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { usePlannerStore } from "@/store/planner-store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchEntry {
  title: string;
  category: "Subjects" | "Topics" | "Spaces" | "Actions" | "Tools & Guides";
  href: string;
  description?: string;
  icon: React.ElementType;
  badge?: string;
}

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { points, streak } = usePlannerStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Master Search Index
  const allSearchEntries: SearchEntry[] = useMemo(
    () => [
      // Core Subjects
      {
        title: "Data Structures & Algorithms (DSA)",
        category: "Subjects",
        href: "/practice?subject=dsa",
        description: "Arrays, Trees, Graphs, DP, and pattern problem solving",
        icon: Code2,
        badge: "116h",
      },
      {
        title: "Database Management Systems (DBMS)",
        category: "Subjects",
        href: "/practice?subject=dbms",
        description: "SQL query optimization, ACID, B+ Trees, indexing",
        icon: Database,
        badge: "57h",
      },
      {
        title: "Operating Systems (OS)",
        category: "Subjects",
        href: "/practice?subject=operating-systems",
        description: "Processes, Threads, Virtual Memory, Deadlocks, Mutex",
        icon: Cpu,
        badge: "24h",
      },
      {
        title: "Computer Networks (CN)",
        category: "Subjects",
        href: "/practice?subject=computer-networks",
        description: "TCP/IP handshake, OSI Model, Sockets, HTTP/HTTPS",
        icon: Network,
        badge: "24h",
      },
      {
        title: "Low Level Design (LLD)",
        category: "Subjects",
        href: "/practice?subject=system-design",
        description: "SOLID principles, Design patterns, UML diagrams",
        icon: Layers,
        badge: "31h",
      },
      {
        title: "Object-Oriented Programming (OOPS)",
        category: "Subjects",
        href: "/prep-hub",
        description: "Encapsulation, Polymorphism, Inheritance, C++/Java",
        icon: BookOpen,
        badge: "18h",
      },

      // Popular Topics
      {
        title: "Dynamic Programming Patterns",
        category: "Topics",
        href: "/practice?subject=dsa&topic=Dynamic-Programming",
        description: "0/1 Knapsack, Subsequences, Grid DP, Interval transitions",
        icon: Code2,
      },
      {
        title: "Binary Trees & Graph BFS/DFS",
        category: "Topics",
        href: "/practice?subject=dsa&topic=Trees-Graphs",
        description: "Traversals, Dijkstra, Topological Sort, Disjoint Sets",
        icon: Code2,
      },
      {
        title: "B+ Tree Indexing & Transaction Isolation",
        category: "Topics",
        href: "/practice?subject=dbms",
        description: "Clustered index scans, 2PL, MVCC, and deadlocks",
        icon: Database,
      },
      {
        title: "Virtual Memory Paging & TLB Misses",
        category: "Topics",
        href: "/practice?subject=operating-systems",
        description: "Page replacement algorithms, segmentation, page faults",
        icon: Cpu,
      },

      // My Spaces
      {
        title: "NoteSpace — Tech Cheatsheets & Notes",
        category: "Spaces",
        href: "/notes",
        description: "Rich text summaries, interview notes, and code snippets",
        icon: FileText,
      },
      {
        title: "CodeSpace — Multi-Language Scratchpad",
        category: "Spaces",
        href: "/codespace",
        description: "Instant sandbox execution for C++, Java, Python, JS",
        icon: FolderCode,
      },
      {
        title: "Quiz Log — Curriculum & Question Manager",
        category: "Spaces",
        href: "/quiz-log",
        description: "Add new coding problems and log quiz challenges",
        icon: HelpCircle,
      },
      {
        title: "All Problem Sheets & Curated Lists",
        category: "Spaces",
        href: "/lists",
        description: "Blind 75, Striver 190, Core CS 100 sheets",
        icon: ListTodo,
      },

      // Actions
      {
        title: "Solve Problem of the Day (+20 pts)",
        category: "Actions",
        href: "/practice",
        description: "Daily challenge for algorithmic consistency",
        icon: Play,
        badge: "+20 pts",
      },
      {
        title: "Planly — View Study Sprint Schedule",
        category: "Actions",
        href: "/planly",
        description: "Review your 9-sprint roadmap and daily tasks",
        icon: GitBranch,
      },
      {
        title: "Build / Personalize My Study Plan",
        category: "Actions",
        href: "/onboarding",
        description: "Configure target role, pacing, and starting levels",
        icon: Sparkles,
      },

      // Tools & Guides
      {
        title: "Bitwise Operations Visualizer",
        category: "Tools & Guides",
        href: "/tools",
        description: "Interactive bit arithmetic and binary converter",
        icon: Wrench,
      },
      {
        title: "Big-O Time & Space Complexity Cheatsheet",
        category: "Tools & Guides",
        href: "/tools",
        description: "Quick complexity references for data structures",
        icon: Wrench,
      },
      {
        title: "Engineering Masterclasses & Tech Blogs",
        category: "Tools & Guides",
        href: "/blogs",
        description: "Deep architecture guides and algorithmic breakdowns",
        icon: BookOpen,
      },
      {
        title: "Candidate Discussions & Network",
        category: "Tools & Guides",
        href: "/community",
        description: "Recent company interview experiences and loops",
        icon: Compass,
      },
    ],
    []
  );

  // Global Keyboard Shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return allSearchEntries;
    }
    const q = searchQuery.toLowerCase();
    return allSearchEntries.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [searchQuery, allSearchEntries]);

  // Handle arrow key navigation in search dialog
  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelectSearch(filteredResults[selectedIndex].href);
    }
  };

  const handleSelectSearch = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
    router.push(href);
  };

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
              onClick={() => {
                setSearchOpen(true);
                setSelectedIndex(0);
              }}
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

      {/* Universal Command Palette Dialog (⌘K) */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent
          className="max-w-xl p-0 overflow-hidden bg-zinc-950 border-zinc-800 shadow-dialog"
          onKeyDown={handleDialogKeyDown}
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 bg-zinc-900/50">
            <Search className="h-4 w-4 text-blue-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search subjects, topics, notes, tools, or actions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              autoFocus
              className="flex-1 bg-transparent text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndex(0);
                }}
                className="text-zinc-500 hover:text-zinc-300 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 select-none">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={`${item.category}-${item.title}`}
                    onClick={() => handleSelectSearch(item.href)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-[12px] transition-colors cursor-pointer group",
                      isSelected
                        ? "bg-zinc-900 text-white border border-zinc-800/80"
                        : "text-zinc-300 hover:bg-zinc-900/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-zinc-400 transition-colors",
                          isSelected
                            ? "bg-blue-600/20 border-blue-500/30 text-blue-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      <div className="truncate">
                        <div className="font-medium text-[13px] text-zinc-200 group-hover:text-white flex items-center gap-1.5">
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div className="text-[11px] text-zinc-500 font-normal truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                        {item.category}
                      </span>
                      <ArrowRight className="h-3 w-3 text-zinc-600 group-hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center space-y-1 text-zinc-500">
                <p className="text-[13px] font-medium text-zinc-400">No results found</p>
                <p className="text-[11px]">
                  No matches for &ldquo;{searchQuery}&rdquo;. Try another keyword.
                </p>
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="border-t border-zinc-800/80 bg-zinc-950/90 px-4 py-2 text-[11px] text-zinc-500 flex items-center justify-between font-mono">
            <div className="flex items-center gap-3">
              <span><kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded">↑↓</kbd> navigate</span>
              <span><kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded">↵</kbd> open</span>
            </div>
            <span><kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded">esc</kbd> close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
