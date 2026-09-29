import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PageSkeletonProps {
  hasHeader?: boolean;
  cardsCount?: number;
  className?: string;
}

export function PageSkeleton({
  hasHeader = true,
  cardsCount = 4,
  className,
}: PageSkeletonProps) {
  return (
    <div className={cn("space-y-6 animate-pulse", className)}>
      {hasHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-zinc-800/60" />
            <Skeleton className="h-4 w-72 bg-zinc-800/40" />
          </div>
          <Skeleton className="h-8 w-32 bg-zinc-800/60" />
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: cardsCount }).map((_, i) => (
          <Card key={i} className="p-4 border-zinc-800/80 bg-zinc-900/40 space-y-2">
            <Skeleton className="h-3.5 w-20 bg-zinc-800/60" />
            <Skeleton className="h-6 w-14 bg-zinc-800/80" />
            <Skeleton className="h-3 w-28 bg-zinc-800/40" />
          </Card>
        ))}
      </div>

      <Card className="p-6 border-zinc-800/80 bg-zinc-900/40 space-y-4">
        <Skeleton className="h-5 w-44 bg-zinc-800/60" />
        <Skeleton className="h-48 w-full bg-zinc-800/30 rounded-lg" />
      </Card>
    </div>
  );
}
