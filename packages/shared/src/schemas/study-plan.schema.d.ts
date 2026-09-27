import { z } from "zod";
export declare const updateStudyTaskSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["not_started", "in_progress", "completed"]>>;
    isRevision: z.ZodOptional<z.ZodBoolean>;
    actualMinutes: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "not_started" | "in_progress" | "completed" | undefined;
    isRevision?: boolean | undefined;
    actualMinutes?: number | undefined;
}, {
    status?: "not_started" | "in_progress" | "completed" | undefined;
    isRevision?: boolean | undefined;
    actualMinutes?: number | undefined;
}>;
export declare const updateStudyPlanSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    dailyHours: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    startDate?: string | undefined;
    dailyHours?: number | undefined;
}, {
    name?: string | undefined;
    startDate?: string | undefined;
    dailyHours?: number | undefined;
}>;
export type UpdateStudyTaskInput = z.infer<typeof updateStudyTaskSchema>;
export type UpdateStudyPlanInput = z.infer<typeof updateStudyPlanSchema>;
//# sourceMappingURL=study-plan.schema.d.ts.map