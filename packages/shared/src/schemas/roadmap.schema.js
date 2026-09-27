import { z } from "zod";
export const createRoadmapItemSchema = z.object({
    title: z.string().min(1, "Question title is required").max(255),
    subjectId: z.coerce.number().int().positive("A valid subject ID is required"),
    topicId: z.coerce.number().int().positive("A valid topic ID is required"),
    subtopicId: z.coerce.number().int().positive().nullable().optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().default("Medium"),
    estimatedMinutes: z.coerce.number().int().min(1).max(300).optional().default(15),
    type: z.enum(["Problem", "Quiz", "Concept", "Code"]).optional().default("Problem"),
});
export const solveQuestionSchema = z.object({
    isCorrect: z.boolean().default(true),
    notes: z.string().max(2000).optional(),
});
export const practiceQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    search: z.string().optional().default(""),
    subject: z.string().optional().default("all"),
    track: z.string().optional(),
    topic: z.string().optional().default("all"),
    pattern: z.string().optional(),
    difficulty: z.string().optional().default("all"),
    level: z.string().optional(),
    status: z.string().optional().default("all"),
});
//# sourceMappingURL=roadmap.schema.js.map