"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { SavedResourceDto } from "@cracksde/shared";

interface SavedResourceCardProps {
  resource: SavedResourceDto;
  onDelete: (id: string) => Promise<void> | void;
  isDeleting?: boolean;
}

export function SavedResourceCard({
  resource,
  onDelete,
  isDeleting = false,
}: SavedResourceCardProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

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
        {/* Domain & Date Header */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="blue"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium py-0.5 px-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 max-w-[180px] truncate"
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

          <span className="text-[11px] text-zinc-500 font-mono whitespace-nowrap">
            {formattedDate}
          </span>
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
            className="h-7 text-[11px] font-medium border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-blue-400 hover:border-blue-500/40 px-2.5 flex-1 sm:flex-initial"
          >
            <ExternalLink className="h-3 w-3 mr-1 text-zinc-400 group-hover:text-blue-400" />
            <span>Open</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-7 text-[11px] font-medium border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 px-2.5 flex-1 sm:flex-initial"
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
          className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
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
