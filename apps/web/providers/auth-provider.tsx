"use client";

import React, { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { usePlannerStore } from "@/store/planner-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending, error } = useSession();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    useAuthStore.getState().syncSession(sessionData, isPending, error);

    if (isPending) return;

    const currentUserId = sessionData?.user?.id ?? null;

    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = currentUserId;
      usePlannerStore.getState().syncUser(currentUserId);
      return;
    }

    if (prevUserIdRef.current !== currentUserId) {
      const hadPreviousUser = Boolean(prevUserIdRef.current);
      prevUserIdRef.current = currentUserId;

      if (hadPreviousUser) {
        queryClient.clear();
      } else {
        queryClient.invalidateQueries();
      }

      usePlannerStore.getState().syncUser(currentUserId);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("cracksde_planly_expanded_sprints");
          localStorage.removeItem("cracksde_planly_expanded_days");
        } catch {}
      }
    }
  }, [sessionData, isPending, error, queryClient]);

  return <>{children}</>;
}
