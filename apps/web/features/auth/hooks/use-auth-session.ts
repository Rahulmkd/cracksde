"use client";

import { useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import { authService } from "@/services/auth-service";

export function useAuthSession() {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,
    signInEmail: authService.signInEmail,
    signUpEmail: authService.signUpEmail,
    signOut: authService.signOut,
    signIn,
    signUp,
    rawSignOut: signOut,
  };
}

export const useAuth = useAuthSession;
