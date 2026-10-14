"use client";

import React, { useState } from "react";
import { useSavedResources, useDeleteSavedResource } from "../hooks/use-saved-resources";
import { SavedResourceCard } from "./saved-resource-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkPlus, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface SavedResourcesListProps {
  onOpenSaveModal: () => void;
}

export function SavedResourcesList({ onOpenSaveModal }: SavedResourcesListProps) {
  const router = useRouter();
  const { data: resources, isLoading, error, refetch, isAuthenticated, isAuthLoading } =
    useSavedResources();
  const deleteMutation = useDeleteSavedResource();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
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

  // Resources Grid
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <SavedResourceCard
          key={resource.id}
          resource={resource}
          onDelete={handleDelete}
          isDeleting={deletingId === resource.id}
        />
      ))}
    </div>
  );
}
