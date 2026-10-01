"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Menu } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { usePlannerStore } from "@/store/planner-store";
import { useAuth } from "@/hooks/use-auth";
import { CommandPaletteDialog } from "@/components/search/command-palette-dialog";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { cn } from "@/lib/utils";

/**
 * Search icon with top-right sparkle matching the reference UI design.
 */
function SearchWithSparkleIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="6" />
      <path d="m14.5 14.5 5 5" />
      <path d="M18.5 2.5v3.5M16.75 4.25h3.5" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Gold faceted hexagon badge matching the reference image.
 */
function GoldHexagonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="12,2.5 20.2,7.2 20.2,16.8 12,21.5 3.8,16.8 3.8,7.2"
        fill="url(#goldHexGradient)"
        stroke="url(#goldStrokeGradient)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8.5h3.2a2 2 0 0 1 0 4H9.5V8.5zm0 4l3 3.5"
        stroke="#451A03"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <defs>
        <linearGradient
          id="goldHexGradient"
          x1="3.8"
          y1="2.5"
          x2="20.2"
          y2="21.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient
          id="goldStrokeGradient"
          x1="3.8"
          y1="2.5"
          x2="20.2"
          y2="21.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Header() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { points, streak } = usePlannerStore();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "ME";

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800/60 bg-[#0B0C10]/95 backdrop-blur-md">
        <div className="flex h-12 items-center justify-between px-3 sm:px-4 lg:px-6">
          {/* Left: Mobile/Tablet Sidebar Drawer Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 lg:hidden transition-colors focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-blue-500/50"
              aria-label="Toggle navigation menu"
              aria-expanded={sidebarOpen}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Right: Minimal Dark Header Action Strip */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Quick Search Action */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group relative flex h-8 items-center justify-center rounded-md px-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-blue-500/50"
              aria-label="Search problems, tracks, and tools (⌘K)"
              title="Search problems, tracks, tools... (⌘K)"
            >
              <SearchWithSparkleIcon className="h-4 w-4 text-zinc-300 group-hover:text-white transition-colors" />
            </button>

            {/* Subtle Divider 1 */}
            <div
              className="h-3.5 w-[1px] bg-zinc-800/80 shrink-0"
              aria-hidden="true"
            />

            {/* Gamified Points Counter Badge */}
            <button
              type="button"
              onClick={() => router.push("/unlock")}
              className="group flex h-8 items-center gap-1.5 rounded-md px-2 text-zinc-300 hover:text-amber-300 hover:bg-zinc-800/50 transition-colors select-none focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-amber-500/50"
              title={`${points} Study Points (Earn +15 per task solved)`}
              aria-label={`${points} Study Points`}
            >
              <GoldHexagonIcon className="h-4 w-4 shrink-0 group-hover:scale-105 transition-transform" />
              <span className="text-[12px] font-mono font-medium text-amber-400/90 group-hover:text-amber-300">
                {points}
              </span>
            </button>

            {/* Subtle Divider 2 */}
            <div
              className="h-3.5 w-[1px] bg-zinc-800/80 shrink-0"
              aria-hidden="true"
            />

            {/* Daily Streak Flame Counter */}
            <button
              type="button"
              onClick={() => router.push("/planly")}
              className="group flex h-8 items-center gap-1.5 rounded-md px-2 text-zinc-300 hover:text-orange-300 hover:bg-zinc-800/50 transition-colors select-none focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-orange-500/50"
              title={`Current Daily Streak: ${streak} days`}
              aria-label={`Current Daily Streak: ${streak} days`}
            >
              <Flame className="h-4 w-4 shrink-0 text-orange-500 fill-orange-500/85 drop-shadow-[0_0_6px_rgba(249,115,22,0.45)] group-hover:scale-110 transition-transform" />
              <span className="text-[12px] font-mono font-medium text-orange-400/90 group-hover:text-orange-300">
                {streak}
              </span>
            </button>

            {/* Subtle Divider 3 */}
            <div
              className="h-3.5 w-[1px] bg-zinc-800/80 shrink-0"
              aria-hidden="true"
            />

            {/* User Profile Avatar Dropdown Trigger */}
            <div className="relative pl-0.5">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/80 bg-blue-600/20 text-[11px] font-semibold text-blue-400 transition-all hover:border-blue-400 hover:bg-blue-600/30 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                  dropdownOpen && "ring-2 ring-blue-500/50 border-blue-400",
                )}
                aria-label="User Profile Menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                title={
                  user?.name ? `${user.name} - Account Menu` : "Account Menu"
                }
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{userInitials}</span>
                )}
              </button>

              {/* User Profile Dropdown Menu */}
              <UserDropdown
                isOpen={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
                placement="bottom-right"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Universal Command Palette (⌘K) */}
      <CommandPaletteDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
