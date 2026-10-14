"use client";

import { useQueryClient } from "@tanstack/react-query";
import { authClient, signIn, signUp, signOut as rawSignOut } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { usePlannerStore } from "@/store/planner-store";

export function useAuthSession() {
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isLoggingIn = useAuthStore((s) => s.isLoggingIn);
  const isLoggingOut = useAuthStore((s) => s.isLoggingOut);
  const error = useAuthStore((s) => s.error);
  const queryClient = useQueryClient();

  const handleSignInEmail = async (data: { email: string; password: string }) => {
    useAuthStore.getState().setLoggingIn(true);
    try {
      const res = await authClient.signIn.email(data);
      if (res?.error) {
        useAuthStore.getState().setLoggingIn(false);
        return res;
      }

      if (res?.data?.user) {
        const token = (res.data as any)?.token || (res.data as any)?.session?.token;
        if (token && typeof window !== "undefined") {
          try {
            localStorage.setItem("cracksde_auth_token", token);
          } catch {}
        }
        // Immediate synchronous global auth state update
        useAuthStore.getState().setSession(res.data.user, (res.data as any)?.session ?? null);
        usePlannerStore.getState().syncUser(res.data.user.id);
        queryClient.invalidateQueries();
        try {
          authClient.$store?.notify?.("$sessionSignal");
        } catch {}
      }
      return res;
    } catch (err: any) {
      useAuthStore.getState().setLoggingIn(false);
      throw err;
    }
  };

  const handleSignUpEmail = async (data: { name: string; email: string; password: string }) => {
    useAuthStore.getState().setLoggingIn(true);
    try {
      const res = await authClient.signUp.email(data);
      if (res?.error) {
        useAuthStore.getState().setLoggingIn(false);
        return res;
      }

      if (res?.data?.user) {
        const token = (res.data as any)?.token || (res.data as any)?.session?.token;
        if (token && typeof window !== "undefined") {
          try {
            localStorage.setItem("cracksde_auth_token", token);
          } catch {}
        }
        // Immediate synchronous global auth state update
        useAuthStore.getState().setSession(res.data.user, (res.data as any)?.session ?? null);
        usePlannerStore.getState().syncUser(res.data.user.id);
        queryClient.invalidateQueries();
        try {
          authClient.$store?.notify?.("$sessionSignal");
        } catch {}
      }
      return res;
    } catch (err: any) {
      useAuthStore.getState().setLoggingIn(false);
      throw err;
    }
  };

  const handleSignOut = async () => {
    useAuthStore.getState().setLoggingOut(true);
    try {
      // 1. Invalidate and clear react-query cache immediately
      queryClient.clear();

      // 2. Clear planner store and local caches immediately
      usePlannerStore.getState().resetStore();
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("cracksde_auth_token");
          localStorage.removeItem("cracksde-daily-planner-storage");
          localStorage.removeItem("cracksde_planly_expanded_sprints");
          localStorage.removeItem("cracksde_planly_expanded_days");
        } catch {}
      }

      // 3. Clear auth store immediately across all subscribing components
      useAuthStore.getState().clearSession();

      // 4. Invalidate session cookie on server
      await authClient.signOut();

      try {
        authClient.$store?.notify?.("$sessionSignal");
      } catch {}

      return { success: true };
    } catch (err: any) {
      useAuthStore.getState().setLoggingOut(false);
      throw err;
    }
  };

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    isLoggingIn,
    isLoggingOut,
    error,
    signInEmail: handleSignInEmail,
    signUpEmail: handleSignUpEmail,
    signOut: handleSignOut,
    signIn,
    signUp,
    rawSignOut,
  };
}

export const useAuth = useAuthSession;

