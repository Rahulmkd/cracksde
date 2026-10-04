import type { CorsOptions } from "cors";
import { env } from "./env.js";

const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server, health checks)
    if (!origin) {
      return callback(null, true);
    }

    // Check direct equality or wildcard
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return callback(null, true);
    }

    // Check wildcard subdomain pattern like *.vercel.app
    const isMatched = allowedOrigins.some((allowed) => {
      if (allowed.startsWith("*.")) {
        const rootDomain = allowed.slice(2);
        return origin.endsWith(rootDomain) || origin.endsWith(`.${rootDomain}`);
      }
      return false;
    });

    if (isMatched) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};

