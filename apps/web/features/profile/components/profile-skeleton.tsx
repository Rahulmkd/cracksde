"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-pulse">
      {/* Header Banner Skeleton */}
      <Card className="border-zinc-800/80 bg-zinc-900/30 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-zinc-900 via-zinc-800/50 to-zinc-900" />
        <CardContent className="p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <Skeleton className="h-24 w-24 rounded-2xl border-4 border-zinc-950 bg-zinc-800" />
              <div className="space-y-2 pb-1">
                <Skeleton className="h-6 w-48 bg-zinc-800" />
                <Skeleton className="h-4 w-36 bg-zinc-850" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-lg bg-zinc-800" />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-full max-w-xl bg-zinc-800" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-6 w-24 rounded-full bg-zinc-800" />
              <Skeleton className="h-6 w-28 rounded-full bg-zinc-800" />
              <Skeleton className="h-6 w-20 rounded-full bg-zinc-800" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-zinc-800/80 bg-zinc-900/30 p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-zinc-800" />
              <Skeleton className="h-7 w-16 bg-zinc-800" />
              <Skeleton className="h-3 w-28 bg-zinc-850" />
            </div>
          </Card>
        ))}
      </div>

      {/* Content Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-800/80 bg-zinc-900/30 p-6 space-y-4">
            <Skeleton className="h-5 w-40 bg-zinc-800" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32 bg-zinc-800" />
                    <Skeleton className="h-4 w-12 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full bg-zinc-800" />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="border-zinc-800/80 bg-zinc-900/30 p-6 space-y-4">
            <Skeleton className="h-5 w-36 bg-zinc-800" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg bg-zinc-800" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-full bg-zinc-800" />
                    <Skeleton className="h-3 w-20 bg-zinc-850" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
