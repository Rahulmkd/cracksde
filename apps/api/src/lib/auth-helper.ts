import type { Request } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
}

/**
 * Extracts authenticated user from request headers/cookies using Better Auth
 */
export async function getAuthenticatedUser(req: Request): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return null;
    }

    return session.user as AuthUser;
  } catch (error) {
    console.error("Error retrieving auth session:", error);
    return null;
  }
}
