import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { prisma } from "./prisma.js";
import { env } from "../config/env.js";

const customOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
const staticTrustedOrigins = Array.from(
  new Set([
    ...customOrigins,
    "*.vercel.app",
    "https://*.vercel.app",
    "http://localhost:3000",
    "http://localhost:5001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5001",
  ])
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [bearer()],
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: async (request) => {
    const origins = [...staticTrustedOrigins];
    const origin = request?.headers.get("origin");
    if (origin) {
      try {
        const url = new URL(origin);
        const hostname = url.hostname;
        const isPrivateIP =
          hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          hostname.startsWith("192.168.") ||
          hostname.startsWith("10.") ||
          /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);
        const isDevTunnel =
          hostname.endsWith(".ngrok-free.app") ||
          hostname.endsWith(".ngrok.io") ||
          hostname.endsWith(".trycloudflare.com") ||
          hostname.endsWith(".loca.lt");
        if (isPrivateIP || isDevTunnel) {
          origins.push(origin);
        }
      } catch {}
    }
    return origins;
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
    },
    defaultCookieAttributes: {
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      secure: env.NODE_ENV === "production",
      partitioned: env.NODE_ENV === "production",
    },
  },
});

