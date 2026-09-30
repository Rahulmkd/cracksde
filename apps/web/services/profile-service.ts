import { api } from "./api-client";
import type {
  ApiResponse,
  UserProfileResponseDto,
  ProfileStatsDto,
  UpdateProfileRequestDto,
} from "@starter/shared";

export const profileService = {
  /**
   * Fetch current user's profile and progress statistics
   */
  async getProfile(): Promise<UserProfileResponseDto> {
    const res = await api.get<ApiResponse<UserProfileResponseDto>>("/api/profile");
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch user profile");
    }
    return res.data;
  },

  /**
   * Update user profile information
   */
  async updateProfile(payload: UpdateProfileRequestDto): Promise<UserProfileResponseDto> {
    const res = await api.patch<ApiResponse<UserProfileResponseDto>>("/api/profile", payload);
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to update profile");
    }
    return res.data;
  },

  /**
   * Fetch user learning statistics and activity breakdown
   */
  async getStats(): Promise<ProfileStatsDto> {
    const res = await api.get<ApiResponse<ProfileStatsDto>>("/api/profile/stats");
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch learning statistics");
    }
    return res.data;
  },
};
