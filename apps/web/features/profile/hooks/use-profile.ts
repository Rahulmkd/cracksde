"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile-service";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerStore } from "@/store/planner-store";
import type { UpdateProfileRequestDto } from "@starter/shared";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useProfile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => profileService.getProfile(),
    enabled: !isAuthLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function useProfileStats() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useQuery({
    queryKey: ["user-profile-stats", userId],
    queryFn: () => profileService.getStats(),
    enabled: !isAuthLoading,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? "anonymous";

  return useMutation({
    mutationFn: (data: UpdateProfileRequestDto) => profileService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile", userId], data);
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile-stats"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile. Please try again.");
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { signOut } = useAuth();

  return useMutation({
    mutationFn: () => profileService.deleteAccount(),
    onSuccess: async () => {
      // 1. Purge all query caches
      queryClient.clear();
      // 2. Reset Zustand and LocalStorage
      usePlannerStore.getState().resetStore();
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("cracksde-daily-planner-storage");
          localStorage.removeItem("cracksde_planly_expanded_sprints");
          localStorage.removeItem("cracksde_planly_expanded_days");
        } catch {}
      }
      // 3. Invalidate auth session
      try {
        await signOut();
      } catch {
        // Ignore if already deleted on backend
      }
      toast.success("Your account and all study data have been permanently deleted.");
      router.push("/login");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete account. Please try again.");
    },
  });
}
