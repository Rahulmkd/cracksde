"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile-service";
import type { UpdateProfileRequestDto } from "@starter/shared";
import { toast } from "sonner";

export function useProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => profileService.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function useProfileStats() {
  return useQuery({
    queryKey: ["user-profile-stats"],
    queryFn: () => profileService.getStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequestDto) => profileService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], data);
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile-stats"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile. Please try again.");
    },
  });
}
