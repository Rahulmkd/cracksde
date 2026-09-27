import { z } from "zod";

export const updateStudyTaskSchema = z.object({
  status: z.enum(["not_started", "in_progress", "completed"]).optional(),
  isRevision: z.boolean().optional(),
  actualMinutes: z.coerce.number().int().min(0).max(1440).optional(),
});

export const updateStudyPlanSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  startDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
  dailyHours: z.coerce.number().min(1).max(24).optional(),
});

export type UpdateStudyTaskInput = z.infer<typeof updateStudyTaskSchema>;
export type UpdateStudyPlanInput = z.infer<typeof updateStudyPlanSchema>;
