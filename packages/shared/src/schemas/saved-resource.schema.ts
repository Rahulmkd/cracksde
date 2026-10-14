import { z } from "zod";

export const saveResourceSchema = z.object({
  url: z
    .string({ required_error: "URL is required" })
    .trim()
    .min(1, "URL is required")
    .refine(
      (val) => {
        try {
          const toTest = val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`;
          const parsed = new URL(toTest);
          return (
            (parsed.protocol === "http:" || parsed.protocol === "https:") &&
            parsed.hostname.length > 0 &&
            parsed.hostname.includes(".")
          );
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid URL (e.g. https://leetcode.com or https://github.com)",
      }
    ),
});

export type SaveResourceInput = z.infer<typeof saveResourceSchema>;
