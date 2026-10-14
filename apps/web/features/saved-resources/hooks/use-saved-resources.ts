"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savedResourceService } from "@/services/saved-resource-service";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { SavedResourceDto } from "@cracksde/shared";

export function useSavedResources() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  const query = useQuery<SavedResourceDto[], Error>({
    queryKey: ["saved-resources", userId],
    queryFn: () => savedResourceService.getSavedResources(),
    enabled: !isAuthLoading && isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });

  return {
    ...query,
    isAuthenticated,
    isAuthLoading,
  };
}

export function useSaveResource(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useMutation({
    mutationFn: (url: string) => savedResourceService.saveResource(url),
    onSuccess: (newResource) => {
      // Invalidate queries so lists refresh immediately
      queryClient.invalidateQueries({ queryKey: ["saved-resources"] });
      toast.success("Resource saved successfully!");
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save link. Please check the URL and try again.");
    },
  });
}

export function useDeleteSavedResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => savedResourceService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-resources"] });
      toast.success("Resource deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete resource. Please try again.");
    },
  });
}

export function useToggleBookmarkResource() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useMutation({
    mutationFn: ({ id, isBookmarked }: { id: string; isBookmarked?: boolean }) =>
      savedResourceService.toggleBookmark(id, isBookmarked),
    onMutate: async ({ id, isBookmarked }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["saved-resources", userId] });

      // Snapshot previous value
      const previousResources = queryClient.getQueryData<SavedResourceDto[]>([
        "saved-resources",
        userId,
      ]);

      // Optimistically update cache instantly
      queryClient.setQueryData<SavedResourceDto[]>(["saved-resources", userId], (old) => {
        if (!old) return [];
        return old.map((res) => {
          if (res.id === id) {
            const nextState =
              typeof isBookmarked === "boolean" ? isBookmarked : !res.isBookmarked;
            return { ...res, isBookmarked: nextState };
          }
          return res;
        });
      });

      return { previousResources };
    },
    onError: (error: Error, _vars, context) => {
      // Rollback to previous state on failure
      if (context?.previousResources) {
        queryClient.setQueryData(["saved-resources", userId], context.previousResources);
      }
      toast.error(error.message || "Failed to update bookmark status");
    },
    onSuccess: (data) => {
      toast.success(data.isBookmarked ? "Bookmarked sheet" : "Bookmark removed", {
        duration: 1800,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-resources", userId] });
    },
  });
}
