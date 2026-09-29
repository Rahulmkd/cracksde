import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchEntry } from "./search-index";

interface SearchResultItemProps {
  item: SearchEntry;
  isSelected: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}

export function SearchResultItem({
  item,
  isSelected,
  onSelect,
  onMouseEnter,
}: SearchResultItemProps) {
  const Icon = item.icon;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2 text-[12px] transition-colors cursor-pointer group select-none",
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
}
