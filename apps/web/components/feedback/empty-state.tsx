import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 space-y-3",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
        <Icon className="h-6 w-6 text-zinc-400" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
        {description && (
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button
            size="sm"
            onClick={onAction}
            className="h-8 px-3 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
