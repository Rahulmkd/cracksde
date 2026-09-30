import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),
  image: z
    .string()
    .url("Invalid avatar image URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  headline: z
    .string()
    .max(255, "Headline cannot exceed 255 characters")
    .nullable()
    .optional(),
  bio: z
    .string()
    .max(2000, "Bio cannot exceed 2000 characters")
    .nullable()
    .optional(),
  targetRole: z
    .string()
    .max(100, "Target role cannot exceed 100 characters")
    .optional(),
  targetCompany: z
    .string()
    .max(100, "Target company cannot exceed 100 characters")
    .optional(),
  experience: z
    .string()
    .max(50, "Experience cannot exceed 50 characters")
    .optional(),
  targetRegion: z
    .string()
    .max(100, "Target region cannot exceed 100 characters")
    .optional(),
  preferredLanguage: z
    .string()
    .max(50, "Preferred language cannot exceed 50 characters")
    .optional(),
  dailyGoalMinutes: z
    .number()
    .int()
    .min(5, "Daily goal must be at least 5 minutes")
    .max(1440, "Daily goal cannot exceed 24 hours")
    .optional(),
  githubUrl: z
    .string()
    .url("Invalid GitHub URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Invalid LinkedIn URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  leetcodeUrl: z
    .string()
    .url("Invalid LeetCode URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Invalid Website URL")
    .nullable()
    .optional()
    .or(z.literal("")),
  emailNotifications: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
