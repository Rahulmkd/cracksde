"use client";

import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Globe,
  Loader2,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { SavedResourceDto } from "@cracksde/shared";

interface SavedResourceCardProps {
  resource: SavedResourceDto;
  onDelete: (id: string) => Promise<void> | void;
  onToggleBookmark?: (id: string, isBookmarked: boolean) => void;
  isDeleting?: boolean;
}

export function SavedResourceCard({
  resource,
  onDelete,
  onToggleBookmark,
  isDeleting = false,
}: SavedResourceCardProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(Boolean(resource.isBookmarked));

  useEffect(() => {
    setLocalBookmarked(Boolean(resource.isBookmarked));
  }, [resource.isBookmarked]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !localBookmarked;
    setLocalBookmarked(nextState); // Instant 0ms visual feedback
    onToggleBookmark?.(resource.id, nextState);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resource.url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleOpen = () => {
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  const formattedDate = (() => {
    try {
      const d = new Date(resource.createdAt);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  })();

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3.5 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col justify-between shadow-subtle">
      <div className="space-y-2.5">
        {/* Domain, Date & Bookmark Header */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="blue"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium py-0.5 px-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 max-w-[170px] truncate"
          >
            {resource.favicon && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resource.favicon}
                alt=""
                onError={() => setImgError(true)}
                className="h-3.5 w-3.5 flex-shrink-0 rounded-sm object-contain"
              />
            ) : (
              <Globe className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
            )}
            <span className="truncate">{resource.domain}</span>
          </Badge>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-mono whitespace-nowrap hidden sm:inline">
              {formattedDate}
            </span>

            {/* Bookmark button - compact, dark theme, smooth transitions */}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleToggleBookmark}
              aria-label={localBookmarked ? "Remove bookmark" : "Bookmark resource"}
              title={localBookmarked ? "Remove bookmark" : "Bookmark resource"}
              className={cn(
                "h-6.5 w-6.5 p-0 flex items-center justify-center rounded-md border transition-all duration-150 touch-manipulation active:scale-95",
                localBookmarked
                  ? "bg-blue-950/40 border-blue-500/30 text-blue-400 hover:bg-blue-900/40 hover:border-blue-500/40 shadow-xs"
                  : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 hover:border-zinc-700/60"
              )}
            >
              <Bookmark
                className={cn(
                  "h-3.5 w-3.5 transition-colors duration-150",
                  localBookmarked
                    ? "fill-blue-400 text-blue-400"
                    : "text-current"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Title & URL Body */}
        <div className="space-y-1">
          <h3
            onClick={handleOpen}
            className="text-[14px] font-semibold leading-snug text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer"
            title={resource.title}
          >
            {resource.title}
          </h3>
          <p
            onClick={handleOpen}
            className="text-[11px] text-zinc-500 font-mono truncate cursor-pointer hover:underline"
            title={resource.url}
          >
            {resource.url}
          </p>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleOpen}
            className="h-7 text-[11px] font-medium border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-blue-400 hover:border-blue-500/40 px-2.5 flex-1 sm:flex-initial touch-manipulation"
          >
            <ExternalLink className="h-3 w-3 mr-1 text-zinc-400 group-hover:text-blue-400" />
            <span>Open</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-7 text-[11px] font-medium border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 px-2.5 flex-1 sm:flex-initial touch-manipulation"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1 text-zinc-400" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isDeleting}
          onClick={() => onDelete(resource.id)}
          aria-label="Delete saved resource"
          className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 touch-manipulation active:scale-95"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
