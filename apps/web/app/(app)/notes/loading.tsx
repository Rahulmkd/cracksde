import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function NotesLoading() {
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 animate-pulse">
      {/* Left sidebar list */}
      <Card className="w-80 h-full p-4 border-zinc-800/80 bg-zinc-900/40 flex flex-col gap-3 shrink-0">
        <Skeleton className="h-8 w-full bg-zinc-800/60 rounded-lg" />
        <div className="space-y-2 flex-1 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg border border-zinc-800/50 bg-zinc-950/40 space-y-1.5">
              <Skeleton className="h-4 w-3/4 bg-zinc-800/60" />
              <Skeleton className="h-3 w-1/2 bg-zinc-800/40" />
            </div>
          ))}
        </div>
      </Card>

      {/* Right editor pane */}
      <Card className="flex-1 h-full p-6 border-zinc-800/80 bg-zinc-900/40 space-y-4">
        <Skeleton className="h-8 w-1/2 bg-zinc-800/60" />
        <Skeleton className="h-6 w-full bg-zinc-800/40" />
        <Skeleton className="h-48 w-full bg-zinc-800/30 rounded-lg" />
      </Card>
    </div>
  );
}
