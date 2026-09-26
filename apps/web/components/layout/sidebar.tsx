"use client";

import React, { useState } from "react";
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
  CalendarCheck2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Bell,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  hasSubmenu?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const [prepOpen, setPrepOpen] = useState(true);
  const [exploreOpen, setExploreOpen] = useState(true);
  const [spacesOpen, setSpacesOpen] = useState(true);

  const prepItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Prep Hub", href: "/prep-hub", icon: Compass },
    { name: "Practice", href: "/practice", icon: Code2, hasSubmenu: true },
    { name: "Planly", href: "/planly", icon: GitBranch },
    { name: "Community", href: "/community", icon: Users },
  ];

  const exploreItems: NavItem[] = [
    { name: "Blogs", href: "#", icon: BookOpen },
    { name: "Unlock", href: "#", icon: Lock, hasSubmenu: true },
    { name: "Dev Tools", href: "#", icon: Wrench, hasSubmenu: true },
  ];

  const spacesItems: NavItem[] = [
    { name: "NoteSpace", href: "#", icon: FileText },
    { name: "All Lists", href: "#", icon: ListTodo },
    { name: "CodeSpace", href: "#", icon: FolderCode },
    { name: "Buganizer", href: "#", icon: CalendarCheck2 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-300 transition-all duration-300",
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-800/60">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/30">
              ⚡
            </div>
            {sidebarOpen && (
              <span className="font-bold text-sm tracking-tight text-zinc-100 flex items-center gap-1">
                Crack<span className="text-blue-500 font-extrabold">SDE</span>
              </span>
            )}
          </Link>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Scrollable Nav Sections without visible scrollbar */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Section: Prep */}
          <div className="space-y-1">
            {sidebarOpen && (
              <button
                type="button"
                onClick={() => setPrepOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-2 pb-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 uppercase tracking-wider transition-colors cursor-pointer select-none"
              >
                <span>Prep</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    prepOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>
            )}
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                prepOpen || !sidebarOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden space-y-1">
                {prepItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors",
                        isActive
                          ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                      )}
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-blue-400" : "text-zinc-400")} />
                      {sidebarOpen && (
                        <div className="flex flex-1 items-center justify-between">
                          <span>{item.name}</span>
                          {item.hasSubmenu && <ChevronDown className="h-3 w-3 text-zinc-600" />}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Explore */}
          <div className="space-y-1">
            {sidebarOpen && (
              <button
                type="button"
                onClick={() => setExploreOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-2 pb-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 uppercase tracking-wider transition-colors cursor-pointer select-none"
              >
                <span>Explore</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    exploreOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>
            )}
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                exploreOpen || !sidebarOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden space-y-1">
                {exploreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
                      {sidebarOpen && (
                        <div className="flex flex-1 items-center justify-between">
                          <span>{item.name}</span>
                          {item.hasSubmenu && <ChevronDown className="h-3 w-3 text-zinc-600" />}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: My Spaces */}
          <div className="space-y-1">
            {sidebarOpen && (
              <button
                type="button"
                onClick={() => setSpacesOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-2 pb-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 uppercase tracking-wider transition-colors cursor-pointer select-none"
              >
                <span>My Spaces</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    spacesOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>
            )}
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                spacesOpen || !sidebarOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden space-y-1">
                {spacesItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
                      {sidebarOpen && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Notification & User Profile */}
        {sidebarOpen && (
          <div className="p-3 border-t border-zinc-800/80 space-y-2.5 bg-zinc-950/60">
            {/* Notification Badge */}
            <div className="rounded-lg border border-zinc-800/90 bg-zinc-900/60 p-2.5 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                  4 unread
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">• 1d</span>
              </div>
              <p className="text-zinc-300 line-clamp-2 text-[11px] leading-tight font-normal">
                Hi rahulmakd, your Planly roadmap is ready. You have 36 hours of free...
              </p>
              <div className="pt-1 text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer text-center border-t border-zinc-800/60">
                Notifications
              </div>
            </div>

            {/* Profile Drawer */}
            <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-700">
                  RA
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-zinc-100 truncate">Rahul</div>
                  <div className="text-[10px] text-zinc-400 font-medium">Free</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px] font-medium border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
              >
                <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
                Upgrade
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
