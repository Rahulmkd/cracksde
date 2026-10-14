import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth-client";

export { authClient, signIn, signUp, signOut, useSession };

export const authService = {
  signInEmail: (data: { email: string; password: string }) => signIn.email(data),
  signUpEmail: (data: { name: string; email: string; password: string }) => signUp.email(data),
  signOut: async () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("cracksde_auth_token");
      } catch {}
    }
    return signOut();
  },
  useSession,
};

