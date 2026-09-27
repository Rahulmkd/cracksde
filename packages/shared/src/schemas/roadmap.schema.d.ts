import { z } from "zod";
export declare const createRoadmapItemSchema: z.ZodObject<{
    title: z.ZodString;
    subjectId: z.ZodNumber;
    topicId: z.ZodNumber;
    subtopicId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    difficulty: z.ZodDefault<z.ZodOptional<z.ZodEnum<["Easy", "Medium", "Hard"]>>>;
    estimatedMinutes: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["Problem", "Quiz", "Concept", "Code"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "Problem" | "Quiz" | "Concept" | "Code";
    title: string;
    subjectId: number;
    topicId: number;
    difficulty: "Easy" | "Medium" | "Hard";
    estimatedMinutes: number;
    subtopicId?: number | null | undefined;
}, {
    title: string;
    subjectId: number;
    topicId: number;
    type?: "Problem" | "Quiz" | "Concept" | "Code" | undefined;
    subtopicId?: number | null | undefined;
    difficulty?: "Easy" | "Medium" | "Hard" | undefined;
    estimatedMinutes?: number | undefined;
}>;
export declare const solveQuestionSchema: z.ZodObject<{
    isCorrect: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    isCorrect: boolean;
    notes?: string | undefined;
}, {
    isCorrect?: boolean | undefined;
    notes?: string | undefined;
}>;
export declare const practiceQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    subject: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    track: z.ZodOptional<z.ZodString>;
    topic: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    pattern: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    level: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    difficulty: string;
    page: number;
    limit: number;
    search: string;
    subject: string;
    topic: string;
    track?: string | undefined;
    pattern?: string | undefined;
    level?: string | undefined;
}, {
    status?: string | undefined;
    difficulty?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    subject?: string | undefined;
    track?: string | undefined;
    topic?: string | undefined;
    pattern?: string | undefined;
    level?: string | undefined;
}>;
export type CreateRoadmapItemInput = z.infer<typeof createRoadmapItemSchema>;
export type SolveQuestionInput = z.infer<typeof solveQuestionSchema>;
export type PracticeQueryInput = z.infer<typeof practiceQuerySchema>;
//# sourceMappingURL=roadmap.schema.d.ts.map