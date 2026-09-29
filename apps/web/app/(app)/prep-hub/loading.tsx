import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PrepHubLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-zinc-800/60" />
          <Skeleton className="h-4 w-72 bg-zinc-800/40" />
        </div>
        <Skeleton className="h-8 w-36 bg-zinc-800/60" />
      </div>

      {/* 6 Subject Track Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5 border-zinc-800/80 bg-zinc-900/40 space-y-3.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 rounded-lg bg-zinc-800/70" />
              <Skeleton className="h-4 w-16 bg-zinc-800/50" />
            </div>
            <Skeleton className="h-5 w-36 bg-zinc-800/60" />
            <Skeleton className="h-3.5 w-full bg-zinc-800/40" />
            <Skeleton className="h-2 w-full bg-zinc-800/40 rounded-full" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-3 w-20 bg-zinc-800/40" />
              <Skeleton className="h-3 w-16 bg-zinc-800/40" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
