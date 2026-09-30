"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession, signIn, signUp, signOut as rawSignOut } from "@/lib/auth-client";
import { authService } from "@/services/auth-service";
import { usePlannerStore } from "@/store/planner-store";

export function useAuthSession() {
  const { data: session, isPending, error } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id ?? null;
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = userId;
      usePlannerStore.getState().syncUser(userId);
      return;
    }

    // Detect user ID transition (login, switch user, or logout)
    if (prevUserIdRef.current !== userId) {
      prevUserIdRef.current = userId;
      queryClient.clear();
      usePlannerStore.getState().syncUser(userId);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("cracksde_planly_expanded_sprints");
          localStorage.removeItem("cracksde_planly_expanded_days");
        } catch {}
      }
    }
  }, [userId, queryClient]);

  const handleSignOut = async () => {
    queryClient.clear();
    usePlannerStore.getState().resetStore();
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("cracksde-daily-planner-storage");
        localStorage.removeItem("cracksde_planly_expanded_sprints");
        localStorage.removeItem("cracksde_planly_expanded_days");
      } catch {}
    }
    return authService.signOut();
  };

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,
    signInEmail: authService.signInEmail,
    signUpEmail: authService.signUpEmail,
    signOut: handleSignOut,
    signIn,
    signUp,
    rawSignOut,
  };
}

export const useAuth = useAuthSession;
