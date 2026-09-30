"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Code2,
  GitBranch,
  Users,
  BookOpen,
  Lock,
  Wrench,
  FileText,
  ListTodo,
  FolderCode,
  HelpCircle,
  Sparkles,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  X,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    prepOpen,
    exploreOpen,
    spacesOpen,
    togglePrepOpen,
    toggleExploreOpen,
    toggleSpacesOpen,
  } = useUIStore();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Close sidebar drawer on mobile/tablet when route changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024 && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  // Handle ESC key to dismiss mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen && typeof window !== "undefined" && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  // Lock background scrolling on small screens when drawer is open
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024 && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLinkClick = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  const prepItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Prep Hub", href: "/prep-hub", icon: Compass },
    { name: "Practice", href: "/practice", icon: Code2 },
    { name: "Planly", href: "/planly", icon: GitBranch },
    { name: "Community", href: "/community", icon: Users },
  ];

  const exploreItems: NavItem[] = [
    { name: "Blogs", href: "/blogs", icon: BookOpen },
    { name: "Unlock", href: "/unlock", icon: Lock },
    { name: "Dev Tools", href: "/tools", icon: Wrench },
  ];

  const spacesItems: NavItem[] = [
    { name: "NoteSpace", href: "/notes", icon: FileText },
    { name: "All Lists", href: "/lists", icon: ListTodo },
    { name: "CodeSpace", href: "/codespace", icon: FolderCode },
    { name: "Quiz Log", href: "/quiz-log", icon: HelpCircle },
  ];

  const renderNavGroup = (
    title: string,
    items: NavItem[],
    isOpen: boolean,
    onToggle: () => void
  ) => {
    return (
      <div className="space-y-1">
        {/* Group Section Header */}
        <div className="px-1">
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              sidebarOpen
                ? "max-h-8 opacity-100"
                : "max-h-0 opacity-0 pointer-events-none lg:max-h-0"
            )}
          >
            <button
              type="button"
              onClick={onToggle}
              className="flex w-full items-center justify-between px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors select-none group focus-visible:outline-none rounded-md"
              aria-expanded={isOpen}
            >
              <span>{title}</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200",
                  isOpen ? "rotate-0" : "-rotate-90"
                )}
              />
            </button>
          </div>

          {/* Subtle separator in collapsed mode */}
          <div
            className={cn(
              "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              !sidebarOpen ? "hidden lg:block h-px w-6 bg-zinc-800/80 mx-auto my-2" : "hidden"
            )}
          />
        </div>

        {/* Group Items Accordion */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
            isOpen || !sidebarOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 pointer-events-none"
          )}
        >
          <div className="overflow-hidden space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <div
                  key={item.name}
                  className="relative group/item"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "relative z-10 flex items-center rounded-lg text-[13px] leading-snug select-none",
                      "transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                      sidebarOpen ? "gap-2.5 px-2.5 py-2" : "justify-center px-0 py-2.5 lg:w-10 lg:h-10 lg:mx-auto",
                      isActive
                        ? "bg-blue-600/15 text-blue-400 font-medium border border-blue-500/30 shadow-sm shadow-blue-500/10"
                        : "text-zinc-400 font-normal hover:bg-zinc-900/80 hover:text-zinc-100 border border-transparent active:scale-[0.98]"
                    )}
                  >
                    {/* Active Bar Indicator */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.9)] transition-all duration-200",
                          sidebarOpen
                            ? "left-0 top-1.5 bottom-1.5 w-[3px]"
                            : "left-0 top-2 bottom-2 w-[3px]"
                        )}
                      />
                    )}

                    <Icon
                      className={cn(
                        "shrink-0 transition-transform duration-200",
                        sidebarOpen ? "h-4 w-4" : "h-4 w-4",
                        isActive
                          ? "text-blue-400 scale-105"
                          : "text-zinc-400 group-hover/item:text-zinc-200 group-hover/item:scale-105"
                      )}
                    />

                    {/* Animated Text Label */}
                    <span
                      className={cn(
                        "truncate font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] whitespace-nowrap",
                        sidebarOpen
                          ? "max-w-[160px] opacity-100 translate-x-0"
                          : "max-w-0 opacity-0 -translate-x-2 pointer-events-none hidden lg:inline-block"
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>

                  {/* Collapsed Tooltip on Desktop Hover */}
                  <div
                    className={cn(
                      "hidden lg:block absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none whitespace-nowrap",
                      "px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700/90 text-[11px] font-medium text-zinc-100 shadow-dialog",
                      "transition-all duration-150 ease-out",
                      !sidebarOpen && hoveredItem === item.name
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 -translate-x-1 scale-95"
                    )}
                    role="tooltip"
                  >
                    {item.name}
                    {/* Arrow Pointer */}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-zinc-900 border-l border-b border-zinc-700/90" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile & Tablet Backdrop Blur Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Main Responsive Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 lg:z-30 flex flex-col border-r border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md text-zinc-300 select-none",
          "transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[width,transform]",
          sidebarOpen
            ? "w-72 lg:w-64 translate-x-0 shadow-2xl shadow-black/80 lg:shadow-none"
            : "-translate-x-full lg:translate-x-0 lg:w-[68px]"
        )}
        aria-label="Application Sidebar"
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-3.5 border-b border-zinc-800/80 bg-zinc-950/90 shrink-0">
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            className="flex items-center gap-2 overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-lg p-0.5"
            aria-label="CrackSDE Home"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-blue-500 text-white font-bold text-[13px] shadow-sm shadow-blue-600/30 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <span
              className={cn(
                "font-semibold text-[14px] tracking-tight text-zinc-100 flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                sidebarOpen
                  ? "max-w-[140px] opacity-100 translate-x-0 ml-1"
                  : "max-w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
              )}
            >
              Crack<span className="text-blue-400 font-semibold ml-0.5">SDE</span>
            </span>
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </button>

          {/* Mobile & Tablet Close Button */}
          <button
            onClick={toggleSidebar}
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors focus-visible:outline-none"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Nav Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5 text-[13px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {renderNavGroup("Prep", prepItems, prepOpen, togglePrepOpen)}
          {renderNavGroup("Explore", exploreItems, exploreOpen, toggleExploreOpen)}
          {renderNavGroup("My Spaces", spacesItems, spacesOpen, toggleSpacesOpen)}
        </div>

        {/* Bottom Notification & User Profile */}
        <div className="p-2 border-t border-zinc-800/80 bg-zinc-950/90 space-y-1.5 shrink-0">
          {/* Expanded State Content */}
          <div
            className={cn(
              "space-y-1.5 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              sidebarOpen
                ? "max-h-44 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 translate-y-2 pointer-events-none hidden lg:block"
            )}
          >
            {/* Notification Badge */}
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2 space-y-1 transition-colors hover:border-zinc-700/80">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  4 updates
                </span>
                <span className="text-[11px] text-zinc-500">1d ago</span>
              </div>
              <p className="text-zinc-300 line-clamp-2 text-[11px] leading-normal font-normal">
                Your Crack SDE study roadmap is active. Sprints are organized for your target role.
              </p>
            </div>

            {/* Profile Drawer */}
            <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-1.5">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
                  RA
                </div>
                <div className="truncate">
                  <div className="text-[12px] font-medium text-zinc-100 truncate">Rahul</div>
                  <div className="text-[11px] text-zinc-500 font-normal leading-none">Free Plan</div>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-5 px-1.5 text-[10px] font-medium border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 transition-transform"
              >
                <Link href="/unlock" onClick={handleLinkClick}>
                  <Sparkles className="h-2.5 w-2.5 mr-1 text-amber-400" />
                  Upgrade
                </Link>
              </Button>
            </div>
          </div>

          {/* Collapsed State Compact View */}
          <div
            className={cn(
              "flex-col items-center gap-2 py-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              !sidebarOpen ? "hidden lg:flex opacity-100" : "hidden"
            )}
          >
            {/* Notification Dot Trigger */}
            <div
              className="relative group/notif cursor-pointer"
              title="4 updates available"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">
                <BellRing className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-zinc-950 animate-pulse" />
              </div>

              {/* Tooltip */}
              <div className="hidden lg:block absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700/90 text-[11px] font-medium text-zinc-100 shadow-dialog opacity-0 -translate-x-1 group-hover/notif:opacity-100 group-hover/notif:translate-x-0 transition-all duration-150">
                4 new roadmap updates
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-zinc-900 border-l border-b border-zinc-700/90" />
              </div>
            </div>

            {/* Profile Avatar */}
            <div className="relative group/prof">
              <Link
                href="/dashboard"
                onClick={handleLinkClick}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/20 text-[11px] font-semibold text-blue-400 border border-blue-500/30 cursor-pointer hover:scale-105 hover:border-blue-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                aria-label="Rahul profile"
              >
                RA
              </Link>
              {/* Tooltip */}
              <div className="hidden lg:block absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700/90 text-[11px] font-medium text-zinc-100 shadow-dialog opacity-0 -translate-x-1 group-hover/prof:opacity-100 group-hover/prof:translate-x-0 transition-all duration-150">
                Rahul (Free Plan)
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-zinc-900 border-l border-b border-zinc-700/90" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
