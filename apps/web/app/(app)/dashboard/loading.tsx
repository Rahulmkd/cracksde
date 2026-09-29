import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top greeting header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-zinc-800/60" />
          <Skeleton className="h-4 w-72 bg-zinc-800/40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 bg-zinc-800/60" />
          <Skeleton className="h-8 w-32 bg-zinc-800/60" />
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 border-zinc-800/80 bg-zinc-900/40 space-y-2">
            <Skeleton className="h-3.5 w-20 bg-zinc-800/60" />
            <Skeleton className="h-6 w-14 bg-zinc-800/80" />
            <Skeleton className="h-3 w-28 bg-zinc-800/40" />
          </Card>
        ))}
      </div>

      {/* Main 2-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-zinc-800/80 bg-zinc-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36 bg-zinc-800/60" />
            <Skeleton className="h-5 w-20 bg-zinc-800/60" />
          </div>
          <Skeleton className="h-40 w-full bg-zinc-800/40 rounded-lg" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Skeleton className="h-16 bg-zinc-800/40 rounded-lg" />
            <Skeleton className="h-16 bg-zinc-800/40 rounded-lg" />
            <Skeleton className="h-16 bg-zinc-800/40 rounded-lg" />
          </div>
        </Card>

        <Card className="p-6 border-zinc-800/80 bg-zinc-900/40 space-y-4">
          <Skeleton className="h-5 w-32 bg-zinc-800/60" />
          <div className="flex justify-center py-4">
            <Skeleton className="h-36 w-36 rounded-full bg-zinc-800/50" />
          </div>
          <Skeleton className="h-4 w-full bg-zinc-800/40" />
          <Skeleton className="h-4 w-3/4 bg-zinc-800/40" />
        </Card>
      </div>
    </div>
  );
}
