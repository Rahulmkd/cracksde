"use client";

import React, { useState } from "react";
import {
  useSavedResources,
  useDeleteSavedResource,
  useToggleBookmarkResource,
} from "../hooks/use-saved-resources";
import { SavedResourceCard } from "./saved-resource-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkPlus, Bookmark, LogIn, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SavedResourcesListProps {
  onOpenSaveModal: () => void;
}

export function SavedResourcesList({ onOpenSaveModal }: SavedResourcesListProps) {
  const router = useRouter();
  const {
    data: resources,
    isLoading,
    error,
    refetch,
    isAuthenticated,
    isAuthLoading,
  } = useSavedResources();

  const deleteMutation = useDeleteSavedResource();
  const toggleBookmarkMutation = useToggleBookmarkResource();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bookmarkFilter, setBookmarkFilter] = useState<"all" | "bookmarked">("all");

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleBookmark = (id: string, isBookmarked: boolean) => {
    toggleBookmarkMutation.mutate({ id, isBookmarked });
  };

  // Auth Loading
  if (isAuthLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24 bg-zinc-800" />
              <Skeleton className="h-4 w-16 bg-zinc-800" />
            </div>
            <Skeleton className="h-5 w-full bg-zinc-800" />
            <Skeleton className="h-4 w-2/3 bg-zinc-800" />
            <div className="pt-2 border-t border-zinc-800/60 flex justify-between">
              <Skeleton className="h-7 w-20 bg-zinc-800" />
              <Skeleton className="h-7 w-7 bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <EmptyState
          icon={LogIn}
          title="Sign in to Access Saved Resources"
          description="Log in to your CrackSDE account to bookmark, store, and organize key links, technical write-ups, and problem sheets."
          actionLabel="Sign In Now"
          onAction={() => router.push("/login")}
        />
      </div>
    );
  }

  // Query Loading
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24 bg-zinc-800" />
              <Skeleton className="h-4 w-16 bg-zinc-800" />
            </div>
            <Skeleton className="h-5 w-full bg-zinc-800" />
            <Skeleton className="h-4 w-2/3 bg-zinc-800" />
            <div className="pt-2 border-t border-zinc-800/60 flex justify-between">
              <Skeleton className="h-7 w-20 bg-zinc-800" />
              <Skeleton className="h-7 w-7 bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Query Error
  if (error) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <ErrorState
          title="Could not load saved resources"
          message={error.message || "An unexpected error occurred while fetching your saved links."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Empty List
  if (!resources || resources.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <EmptyState
          icon={BookmarkPlus}
          title="No Saved Resources Yet"
          description="Save problem links, articles, system design docs, and cheat sheets for quick reference during your interview prep."
          actionLabel="Save Your First Link"
          onAction={onOpenSaveModal}
        />
      </div>
    );
  }

  const bookmarkedCount = resources.filter((r) => r.isBookmarked).length;
  const displayResources =
    bookmarkFilter === "bookmarked"
      ? resources.filter((r) => r.isBookmarked)
      : resources;

  return (
    <div className="space-y-4">
      {/* Sub-filters for saved resources */}
      {bookmarkedCount > 0 && (
        <div className="flex items-center gap-2 pb-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setBookmarkFilter("all")}
            className={cn(
              "h-7 px-2.5 text-[11px] font-medium rounded-md transition-colors",
              bookmarkFilter === "all"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <span>All Links</span>
            <span className="ml-1.5 font-mono text-[10px] text-zinc-400">
              ({resources.length})
            </span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setBookmarkFilter("bookmarked")}
            className={cn(
              "h-7 px-2.5 text-[11px] font-medium rounded-md transition-colors flex items-center gap-1.5",
              bookmarkFilter === "bookmarked"
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                : "text-zinc-400 hover:text-blue-400"
            )}
          >
            <Bookmark className="h-3 w-3 fill-blue-400 text-blue-400" />
            <span>Bookmarked</span>
            <span className="ml-0.5 font-mono text-[10px] text-blue-400">
              ({bookmarkedCount})
            </span>
          </Button>
        </div>
      )}

      {/* Filtered Empty State */}
      {displayResources.length === 0 && bookmarkFilter === "bookmarked" ? (
        <div className="max-w-md mx-auto py-8 text-center space-y-2">
          <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
            <Bookmark className="h-5 w-5 text-zinc-500" />
          </div>
          <h3 className="text-[13px] font-semibold text-zinc-300">No Bookmarked Links</h3>
          <p className="text-[12px] text-zinc-500">
            Click the bookmark icon on any card to pin your favorite resources for rapid access.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayResources.map((resource) => (
            <SavedResourceCard
              key={resource.id}
              resource={resource}
              onDelete={handleDelete}
              onToggleBookmark={handleToggleBookmark}
              isDeleting={deletingId === resource.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
