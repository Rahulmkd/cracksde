import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PracticeLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-zinc-800/60" />
          <Skeleton className="h-4 w-72 bg-zinc-800/40" />
        </div>
        <Skeleton className="h-8 w-32 bg-zinc-800/60" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap gap-2.5">
        <Skeleton className="h-8 w-48 bg-zinc-800/60 rounded-lg" />
        <Skeleton className="h-8 w-32 bg-zinc-800/60 rounded-lg" />
        <Skeleton className="h-8 w-32 bg-zinc-800/60 rounded-lg" />
        <Skeleton className="h-8 w-28 bg-zinc-800/60 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <Card className="border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <Skeleton className="h-4 w-32 bg-zinc-800/60" />
          <Skeleton className="h-4 w-24 bg-zinc-800/40" />
        </div>
        <div className="divide-y divide-zinc-800/60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded bg-zinc-800/60" />
                <Skeleton className="h-4 w-56 bg-zinc-800/60" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 bg-zinc-800/50 rounded-full" />
                <Skeleton className="h-5 w-14 bg-zinc-800/50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
