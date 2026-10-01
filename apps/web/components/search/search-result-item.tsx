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
      role="option"
      aria-selected={isSelected}
      className={cn(
        "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[12px] transition-all cursor-pointer group select-none",
        isSelected
          ? "bg-[#161924] text-white border border-blue-500/30 shadow-sm shadow-blue-500/5"
          : "text-zinc-300 hover:bg-[#141620] border border-transparent"
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden min-w-0">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
            isSelected
              ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
              : "bg-[#181A24] border-zinc-800 text-zinc-400 group-hover:text-zinc-200"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="truncate min-w-0">
          <div className="font-medium text-[13px] text-zinc-100 group-hover:text-white flex items-center gap-2">
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono shrink-0">
                {item.badge}
              </span>
            )}
          </div>
          {item.description && (
            <div className="text-[11px] text-zinc-500 font-normal truncate mt-0.5 group-hover:text-zinc-400 transition-colors">
              {item.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        <span className="rounded-md border border-zinc-800/80 bg-[#11131B] px-2 py-0.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
          {item.category}
        </span>
        <ArrowRight
          className={cn(
            "h-3.5 w-3.5 transition-all duration-150",
            isSelected
              ? "text-blue-400 translate-x-0.5 opacity-100"
              : "text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-zinc-300"
          )}
        />
      </div>
    </div>
  );
}
