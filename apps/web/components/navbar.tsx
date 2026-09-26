"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  // Hide marketing navbar on all app routes
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/prep-hub") ||
    pathname.startsWith("/planly") ||
    pathname.startsWith("/practice") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/notes") ||
    pathname.startsWith("/lists") ||
    pathname.startsWith("/codespace") ||
    pathname.startsWith("/buganizer") ||
    pathname.startsWith("/blogs") ||
    pathname.startsWith("/unlock") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/onboarding");

  if (isAppRoute) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold tracking-tight text-zinc-100 hover:opacity-90 transition-opacity"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-600/20 text-white font-bold text-xs">
              ⚡
            </div>
            <span>
              Crack<span className="text-blue-500 font-extrabold ml-0.5">SDE</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1 text-xs">
            <Link
              href="/onboarding"
              className="rounded-md px-3 py-1.5 font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            >
              Build Roadmap
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-1.5 font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            >
              Study Dashboard
            </Link>
            <Link
              href="/prep-hub"
              className="rounded-md px-3 py-1.5 font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            >
              Prep Hub
            </Link>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild size="sm" className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
