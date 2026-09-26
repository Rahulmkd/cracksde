import { z } from "zod";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

// Look for .env in current directory, parent directories, or root
const potentialEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(import.meta.dirname, "../../../.env"),
  path.resolve(import.meta.dirname, "../../.env"),
];

for (const envPath of potentialEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(16, "BETTER_AUTH_SECRET must be at least 16 characters").default("default-development-secret-change-in-production-min-32-chars"),
  BETTER_AUTH_URL: z.string().default("http://localhost:5001"),
  PORT: z.coerce.number().default(5001),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
