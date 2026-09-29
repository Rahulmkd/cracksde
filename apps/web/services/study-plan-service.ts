import { api } from "./api-client";
import type { ApiResponse, StudyPlanDto, StudyTaskDto } from "@starter/shared";

export interface UpdateTaskPayload {
  status?: string;
  isRevision?: boolean;
  actualMinutes?: number;
}

export interface UpdatePlanPayload {
  name?: string;
  startDate?: string;
  dailyHours?: number;
}

export const studyPlanService = {
  /**
   * Fetch a study plan by its slug identifier (e.g. "crack-sde")
   */
  async getStudyPlan(slug: string = "crack-sde"): Promise<StudyPlanDto> {
    const res = await api.get<ApiResponse<StudyPlanDto>>(`/api/study-plans/${slug}`);
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to load study plan");
    }
    return res.data;
  },

  /**
   * Update completion status, revision flag, or actual spent minutes on a specific task
   */
  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<StudyTaskDto> {
    const res = await api.patch<ApiResponse<StudyTaskDto>>(
      `/api/study-plans/tasks/${taskId}`,
      payload
    );
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to update task");
    }
    return res.data;
  },

  /**
   * Update plan parameters like title, start date, or daily study hours target
   */
  async updatePlan(slug: string, payload: UpdatePlanPayload): Promise<StudyPlanDto> {
    const res = await api.patch<ApiResponse<StudyPlanDto>>(
      `/api/study-plans/${slug}`,
      payload
    );
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to update study plan");
    }
    return res.data;
  },

  /**
   * Fetch all spaced repetition tasks due or scheduled across active study plans
   */
  async getRevisionList(): Promise<StudyTaskDto[]> {
    const res = await api.get<ApiResponse<StudyTaskDto[]>>("/api/study-plans/revision-list");
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to fetch revision list");
    }
    return res.data;
  },
};
