"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchResultItem } from "./search-result-item";
import { allSearchEntries, searchCatalog, type SearchEntry } from "./search-index";

interface CommandPaletteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPaletteDialog({ open, onOpenChange }: CommandPaletteDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredResults: SearchEntry[] = useMemo(() => {
    return searchCatalog(searchQuery, allSearchEntries);
  }, [searchQuery]);

  const handleSelectSearch = (href: string) => {
    onOpenChange(false);
    setSearchQuery("");
    setSelectedIndex(0);
    router.push(href);
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length ? (prev + 1) % filteredResults.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length ? (prev - 1 + filteredResults.length) % filteredResults.length : 0
      );
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelectSearch(filteredResults[selectedIndex].href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <span>
              <kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded">↵</kbd> open
            </span>
          </div>
          <span>
            <kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded">esc</kbd> close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
