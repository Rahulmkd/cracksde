import { z } from "zod";

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  image: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
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
    .min(1, "Target role is required")
    .max(100, "Target role cannot exceed 100 characters"),
  targetCompany: z
    .string()
    .min(1, "Target company is required")
    .max(100, "Target company cannot exceed 100 characters"),
  experience: z
    .string()
    .min(1, "Experience is required")
    .max(50, "Experience cannot exceed 50 characters"),
  targetRegion: z
    .string()
    .min(1, "Target region is required")
    .max(100, "Target region cannot exceed 100 characters"),
  preferredLanguage: z
    .string()
    .min(1, "Preferred language is required")
    .max(50, "Preferred language cannot exceed 50 characters"),
  dailyGoalMinutes: z
    .number()
    .min(5, "Daily goal must be at least 5 minutes")
    .max(1440, "Daily goal cannot exceed 24 hours"),
  githubUrl: z
    .string()
    .url("Must be a valid GitHub URL (e.g. https://github.com/username)")
    .or(z.literal(""))
    .nullable()
    .optional(),
  linkedinUrl: z
    .string()
    .url("Must be a valid LinkedIn URL (e.g. https://linkedin.com/in/username)")
    .or(z.literal(""))
    .nullable()
    .optional(),
  leetcodeUrl: z
    .string()
    .url("Must be a valid LeetCode URL (e.g. https://leetcode.com/username)")
    .or(z.literal(""))
    .nullable()
    .optional(),
  websiteUrl: z
    .string()
    .url("Must be a valid URL (e.g. https://example.com)")
    .or(z.literal(""))
    .nullable()
    .optional(),
  emailNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
