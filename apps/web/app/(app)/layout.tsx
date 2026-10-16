"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/hooks/use-auth";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isListsPage = pathname === "/lists" || pathname?.startsWith("/lists/");

  useEffect(() => {
    if (!isListsPage && !isLoading && !isAuthenticated && !isLoggingOut) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, isLoggingOut, router, isListsPage]);

  // For the lists page, skip the full-screen roller spinner and render AppShell directly
  // so the page displays its own custom skeleton UI during loading and refresh
  if (isListsPage) {
    return <AppShell>{children}</AppShell>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
