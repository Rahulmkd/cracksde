"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, GitBranch, ListTodo, FileText } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchResultItem } from "./search-result-item";
import {
  allSearchEntries,
  searchCatalog,
  type SearchEntry,
  type SearchTab,
} from "./search-index";
import { cn } from "@/lib/utils";

interface CommandPaletteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS: SearchTab[] = [
  "All",
  "Problems",
  "Editorials",
  "Notes",
  "Lists",
  "Blogs",
  "Pages",
];

const QUICK_ACCESS_ITEMS = [
  {
    name: "Planly",
    href: "/planly",
    icon: GitBranch,
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/25",
  },
  {
    name: "lists",
    href: "/lists",
    icon: ListTodo,
    iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/25",
  },
  {
    name: "Prep hub",
    href: "/prep-hub",
    icon: FileText,
    iconBg: "bg-sky-500/10 text-sky-400 border-sky-500/25",
  },
];

/**
 * Search icon with top-right sparkle matching the reference image.
 */
function SearchWithSparkleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="6" />
      <path d="m14.5 14.5 5 5" />
      <path d="M18.5 2.5v3.5M16.75 4.25h3.5" strokeWidth="1.6" />
    </svg>
  );
}

export function CommandPaletteDialog({
  open,
  onOpenChange,
}: CommandPaletteDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Reset states on open
  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
      setActiveTab("All");
    }
  }, [open]);

  const filteredResults: SearchEntry[] = useMemo(() => {
    return searchCatalog(searchQuery, activeTab, allSearchEntries);
  }, [searchQuery, activeTab]);

  const handleSelectSearch = (href: string) => {
    onOpenChange(false);
    setSearchQuery("");
    setSelectedIndex(0);
    router.push(href);
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length ? (prev + 1) % filteredResults.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length
          ? (prev - 1 + filteredResults.length) % filteredResults.length
          : 0
      );
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelectSearch(filteredResults[selectedIndex].href);
    }
  };

  const isQueryActive = searchQuery.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-2xl sm:max-w-3xl w-full p-0 overflow-hidden bg-[#0A0C11] border border-[#20232E] rounded-2xl shadow-2xl text-zinc-100 animate-in fade-in-0 zoom-in-95 duration-200"
        onKeyDown={handleDialogKeyDown}
      >
        {/* Top Prominent Search Input */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 bg-[#0E1017] border-b border-[#1E222D]">
          <SearchWithSparkleIcon className="h-5 w-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="flex-1 bg-transparent text-[14px] sm:text-[15px] font-normal text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (searchQuery) {
                setSearchQuery("");
                setSelectedIndex(0);
              } else {
                onOpenChange(false);
              }
            }}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800/50 transition-colors focus-visible:outline-none"
            aria-label="Close or clear search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-5 sm:gap-7 px-4 sm:px-6 pt-3 border-b border-[#1A1D27] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedIndex(0);
                }}
                className={cn(
                  "relative pb-2.5 text-[13px] whitespace-nowrap transition-colors select-none focus-visible:outline-none",
                  isActive
                    ? "text-blue-400 font-medium"
                    : "text-zinc-400 hover:text-zinc-200 font-normal"
                )}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Access Section (Visible in default state or alongside search) */}
        {!isQueryActive && (
          <div className="px-4 sm:px-6 pt-4 pb-2">
            <div className="text-[12px] font-normal text-zinc-500 select-none">
              Quick Access
            </div>
            <div className="flex items-center flex-wrap gap-2.5 mt-2.5">
              {QUICK_ACCESS_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelectSearch(item.href)}
                    className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#13151D] border border-zinc-800/70 hover:border-zinc-700 hover:bg-[#181B26] transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50"
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border text-[11px]",
                        item.iconBg
                      )}
                    >
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="text-[13px] font-normal text-zinc-300 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Center Area */}
        <div className="min-h-[220px] sm:min-h-[250px] flex flex-col justify-center">
          {!isQueryActive ? (
            /* Clean Centered Default State */
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center select-none">
              <h3 className="text-[15px] sm:text-[16px] font-medium text-zinc-300">
                Search anything
              </h3>
              <p className="text-[13px] text-zinc-500 mt-1.5">
                Type at least 2 characters to begin search
              </p>
            </div>
          ) : (
            /* Filtered Search Results List */
            <div className="max-h-[360px] overflow-y-auto px-3 sm:px-4 py-3 space-y-1.5 [scrollbar-width:thin]">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => (
                  <SearchResultItem
                    key={`${item.category}-${item.title}`}
                    item={item}
                    isSelected={idx === selectedIndex}
                    onSelect={() => handleSelectSearch(item.href)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  />
                ))
              ) : (
                <div className="py-16 text-center space-y-1 text-zinc-500 select-none">
                  <p className="text-[14px] font-medium text-zinc-300">
                    No results found
                  </p>
                  <p className="text-[12px] text-zinc-500">
                    No matches found for &ldquo;{searchQuery}&rdquo;. Try
                    searching with different keywords.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Keyboard Shortcuts Footer */}
        <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-2.5 border-t border-[#1A1D27] bg-[#090A0E] text-[11px] font-mono text-zinc-500 select-none">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1">
              <kbd className="bg-[#14161F] border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-400">
                ↑
              </kbd>
              <kbd className="bg-[#14161F] border border-zinc-800 px-1 py-0.5 rounded text-[10px] text-zinc-400">
                ↓
              </kbd>
            </span>
            <span className="uppercase tracking-wider ml-1">MOVE</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="bg-[#14161F] border border-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-400">
              ↵
            </kbd>
            <span className="uppercase tracking-wider">SELECT</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="bg-[#14161F] border border-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-400">
              ESC
            </kbd>
            <span className="uppercase tracking-wider">QUIT</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
