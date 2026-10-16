import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  showProgress?: boolean;
}

export function CardSkeleton({ showProgress = true }: CardSkeletonProps) {
  return (
    <div className="min-h-[240px] rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3.5 flex flex-col justify-between shadow-subtle">
      <div className="space-y-2.5">
        {/* Header: Badge on left, Topics/Date + Bookmark on right */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-24 bg-zinc-800/80 rounded-md" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-16 bg-zinc-800/50 rounded" />
            <Skeleton className="h-6.5 w-6.5 bg-zinc-800/80 rounded-md" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <Skeleton className="h-5 w-3/4 bg-zinc-800/80 rounded" />
          <Skeleton className="h-3.5 w-24 bg-zinc-800/50 rounded" />
        </div>

        {/* Description body */}
        <div className="space-y-1.5 pt-0.5">
          <Skeleton className="h-3.5 w-full bg-zinc-800/50 rounded" />
          <Skeleton className="h-3.5 w-4/5 bg-zinc-800/40 rounded" />
        </div>
      </div>

      {/* Footer: Progress bar + Action Button */}
      <div className="space-y-2.5 pt-2.5 border-t border-zinc-800/60">
        {showProgress && (
          <div className="space-y-1 pb-0.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-12 bg-zinc-800/50 rounded" />
              <Skeleton className="h-3 w-14 bg-zinc-800/50 rounded" />
            </div>
            <Skeleton className="h-1.5 w-full bg-zinc-800/50 rounded-full" />
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-7 flex-1 bg-zinc-800/80 rounded-md" />
          {!showProgress && <Skeleton className="h-7 w-7 bg-zinc-800/60 rounded-md" />}
        </div>
      </div>
    </div>
  );
}

export function ListsPageSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-44 bg-zinc-800/80 rounded-md" />
          <Skeleton className="h-7 w-56 bg-zinc-800/90 rounded-md" />
          <Skeleton className="h-4 w-96 max-w-full bg-zinc-800/60 rounded-md" />
        </div>
        <Skeleton className="h-8 w-28 bg-zinc-800/80 rounded-md self-start sm:self-center" />
      </div>

      {/* Tabs / Filter Navigation Skeleton */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-36 bg-zinc-800/80 rounded-lg" />
          <Skeleton className="h-8 w-36 bg-zinc-800/50 rounded-lg" />
        </div>
      </div>

      {/* Bookmarked Sheets Section Skeleton */}
      <div className="space-y-3.5 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-md bg-zinc-800/80" />
            <Skeleton className="h-5 w-36 bg-zinc-800/80 rounded-md" />
            <Skeleton className="h-4 w-6 rounded-full bg-zinc-800/60" />
          </div>
        </div>

        {/* 3 Card Skeletons for Bookmarked Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <CardSkeleton key={`bookmarked-skel-${n}`} showProgress={n % 2 === 1} />
          ))}
        </div>
      </div>

      {/* All Problem Sheets Section Skeleton */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded bg-zinc-800/80" />
            <Skeleton className="h-5 w-40 bg-zinc-800/80 rounded-md" />
          </div>
          <Skeleton className="h-4 w-20 bg-zinc-800/50 rounded-md" />
        </div>

        {/* 6 Card Skeletons for All Problem Sheets Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CardSkeleton key={`all-skel-${n}`} showProgress />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ListsLoading() {
  return <ListsPageSkeleton />;
}
