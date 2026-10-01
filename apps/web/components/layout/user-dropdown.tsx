"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import {
  User,
  Bell,
  Settings,
  Puzzle,
  Palette,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: "bottom-right" | "top-right" | "top-left" | "bottom-left";
  className?: string;
}

export function UserDropdown({
  isOpen,
  onClose,
  placement = "bottom-right",
  className,
}: UserDropdownProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTheme = theme || resolvedTheme || "dark";
  const isDark = currentTheme === "dark";

  const handleToggleTheme = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    toast.success(`Theme switched to ${nextTheme} mode`);
  };

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLogout = async () => {
    onClose();
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  // Placement positioning classes
  const placementClasses = {
    "bottom-right": "right-0 top-full mt-2",
    "bottom-left": "left-0 top-full mt-2",
    "top-right": "right-0 bottom-full mb-2",
    "top-left": "left-0 bottom-full mb-2",
  }[placement];

  return (
    <div
      ref={dropdownRef}
      role="menu"
      aria-orientation="vertical"
      className={cn(
        "absolute z-50 min-w-[218px] w-56 select-none",
        "rounded-[18px] border border-zinc-800/90 bg-[#13141a]/95 backdrop-blur-xl",
        "p-1.5 shadow-2xl shadow-black/90 text-zinc-300",
        "animate-in fade-in-0 zoom-in-95 duration-150 ease-out will-change-[transform,opacity]",
        placementClasses,
        className
      )}
    >
      {/* Group 1: Profile, Notifications, Account, Troubleshooting */}
      <div className="space-y-0.5">
        {/* Profile Item */}
        <button
          type="button"
          role="menuitem"
          onClick={() => handleNavigate("/profile")}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-normal text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 transition-colors group focus-visible:outline-none focus-visible:bg-zinc-800/60"
        >
          <User className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0 stroke-[1.8]" />
          <span className="flex-1 text-left">Profile</span>
        </button>

        {/* Notifications Item */}
        <button
          type="button"
          role="menuitem"
          onClick={() => handleNavigate("/notifications")}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-normal text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 transition-colors group focus-visible:outline-none focus-visible:bg-zinc-800/60"
        >
          <Bell className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0 stroke-[1.8]" />
          <span className="flex-1 text-left">Notifications</span>
        </button>

        {/* Account Item with Chevron */}
        <button
          type="button"
          role="menuitem"
          onClick={() => handleNavigate("/account")}
          className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-[13px] font-normal text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 transition-colors group focus-visible:outline-none focus-visible:bg-zinc-800/60"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0 stroke-[1.8]" />
            <span>Account</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
        </button>

        {/* Troubleshooting Item */}
        <button
          type="button"
          role="menuitem"
          onClick={() => handleNavigate("/troubleshooting")}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-normal text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 transition-colors group focus-visible:outline-none focus-visible:bg-zinc-800/60"
        >
          <Puzzle className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0 stroke-[1.8]" />
          <span className="flex-1 text-left">Troubleshooting</span>
        </button>
      </div>

      {/* Divider 1 */}
      <div className="h-px bg-zinc-800/80 my-1 mx-1" role="separator" />

      {/* Group 2: Theme Toggle */}
      <div className="py-0.5">
        <button
          type="button"
          role="menuitem"
          onClick={handleToggleTheme}
          className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-[13px] font-normal text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 transition-colors group focus-visible:outline-none focus-visible:bg-zinc-800/60"
        >
          <div className="flex items-center gap-3">
            <Palette className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0 stroke-[1.8]" />
            <span>Theme</span>
          </div>

          {/* Styled Pill Toggle with Moon/Sun knob */}
          <div
            className={cn(
              "w-11 h-6 rounded-full border border-zinc-800 bg-zinc-900/90 relative flex items-center p-0.5 transition-colors",
              isDark ? "justify-end" : "justify-start"
            )}
            aria-label={`Toggle theme (currently ${currentTheme})`}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full bg-zinc-950 border border-zinc-800/80 flex items-center justify-center shadow-sm transition-transform duration-200",
                isDark ? "text-zinc-100" : "text-amber-400"
              )}
            >
              {isDark ? (
                <Moon className="h-2.5 w-2.5 fill-zinc-100 text-zinc-100" />
              ) : (
                <Sun className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Divider 2 */}
      <div className="h-px bg-zinc-800/80 my-1 mx-1" role="separator" />

      {/* Group 3: Logout */}
      <div className="pt-0.5">
        <button
          type="button"
          role="menuitem"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors group focus-visible:outline-none focus-visible:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4 text-rose-400 group-hover:text-rose-300 transition-colors shrink-0 stroke-[1.8]" />
          <span className="flex-1 text-left">Logout</span>
        </button>
      </div>
    </div>
  );
}
