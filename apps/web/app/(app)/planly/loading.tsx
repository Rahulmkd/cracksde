import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PlanlyLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56 bg-zinc-800/60" />
          <Skeleton className="h-4 w-80 bg-zinc-800/40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 bg-zinc-800/60" />
          <Skeleton className="h-8 w-32 bg-zinc-800/60" />
        </div>
      </div>

      {/* Sprint cards list */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5 border-zinc-800/80 bg-zinc-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 bg-zinc-800/70 rounded-full" />
                <Skeleton className="h-5 w-44 bg-zinc-800/60" />
              </div>
              <Skeleton className="h-4 w-24 bg-zinc-800/40" />
            </div>
            <Skeleton className="h-2.5 w-full bg-zinc-800/50 rounded-full" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-10 w-full bg-zinc-800/30 rounded-lg" />
              <Skeleton className="h-10 w-full bg-zinc-800/30 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
