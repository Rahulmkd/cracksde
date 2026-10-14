import { api } from "./api-client";
import type { ApiResponse, SavedResourceDto } from "@cracksde/shared";

export const savedResourceService = {
  /**
   * Fetch all saved resources for the authenticated user
   */
  async getSavedResources(): Promise<SavedResourceDto[]> {
    const res = await api.get<ApiResponse<SavedResourceDto[]>>("/api/saved-resources");
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch saved resources");
    }
    return res.data;
  },

  /**
   * Save a new link for the authenticated user with automatic metadata extraction
   */
  async saveResource(url: string): Promise<SavedResourceDto> {
    const res = await api.post<ApiResponse<SavedResourceDto>>("/api/saved-resources", { url });
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to save resource link");
    }
    return res.data;
  },

  /**
   * Delete a saved resource by ID
   */
  async deleteResource(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await api.delete<ApiResponse<{ message?: string }>>(`/api/saved-resources/${id}`);
    if (!res.success) {
      throw new Error(res.error || "Failed to delete saved resource");
    }
    return { success: true, message: res.message };
  },

  /**
   * Toggle or set bookmark status on a saved resource
   */
  async toggleBookmark(id: string, isBookmarked?: boolean): Promise<SavedResourceDto> {
    const res = await api.patch<ApiResponse<SavedResourceDto>>(`/api/saved-resources/${id}/bookmark`, {
      ...(typeof isBookmarked === "boolean" ? { isBookmarked } : {}),
    });
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to update bookmark status");
    }
    return res.data;
  },
};
