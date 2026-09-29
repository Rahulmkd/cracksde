import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
});

export const { signIn, signUp, signOut, useSession } = authClient;

export const authService = {
  signInEmail: (data: { email: string; password: string }) => signIn.email(data),
  signUpEmail: (data: { name: string; email: string; password: string }) => signUp.email(data),
  signOut: () => signOut(),
  useSession,
};
