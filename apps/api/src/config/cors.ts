import type { CorsOptions } from "cors";
import { env } from "./env.js";

const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server, health checks)
    if (!origin) {
      return callback(null, true);
    }

    // Auto-allow all Vercel deployments, localhost, local network IPs, and dev tunnels
    const isLocalOrTunnel =
      origin.endsWith(".vercel.app") ||
      origin.includes("vercel.app") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      /https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /https?:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /https?:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+(:\d+)?$/.test(origin) ||
      origin.endsWith(".ngrok-free.app") ||
      origin.endsWith(".ngrok.io") ||
      origin.endsWith(".trycloudflare.com") ||
      origin.endsWith(".loca.lt");

    if (isLocalOrTunnel) {
      return callback(null, true);
    }

    // Check direct equality or wildcard
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return callback(null, true);
    }

    // Check wildcard subdomain pattern like *.vercel.app or https://*.vercel.app
    const isMatched = allowedOrigins.some((allowed) => {
      const cleanAllowed = allowed.replace(/^https?:\/\//, "");
      const cleanOrigin = origin.replace(/^https?:\/\//, "");
      if (cleanAllowed.startsWith("*.")) {
        const rootDomain = cleanAllowed.slice(2);
        return cleanOrigin.endsWith(rootDomain) || cleanOrigin.endsWith(`.${rootDomain}`);
      }
      return cleanOrigin === cleanAllowed;
    });

    if (isMatched) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
    "set-auth-token",
  ],
  exposedHeaders: ["Set-Cookie", "set-auth-token"],
};

