import { z } from "zod";

export const createQuestionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(250, "Title must not exceed 250 characters"),
  subjectId: z
    .number({ invalid_type_error: "Please select a valid subject" })
    .positive("Subject is required"),
  topicId: z
    .number({ invalid_type_error: "Please select a valid topic" })
    .positive("Topic is required"),
  subtopicId: z
    .number()
    .positive()
    .optional()
    .nullable(),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    errorMap: () => ({ message: "Difficulty must be Easy, Medium, or Hard" }),
  }),
  estimatedMinutes: z
    .number()
    .min(1, "Estimated time must be at least 1 minute")
    .max(300, "Estimated time cannot exceed 300 minutes")
    .default(15),
  type: z
    .string()
    .default("Problem"),
  problemUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  solutionCode: z
    .string()
    .optional(),
  notes: z
    .string()
    .optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
