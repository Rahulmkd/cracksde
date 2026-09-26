"use client";

import React from "react";
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

  const prepItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Prep Hub", href: "/prep-hub", icon: Compass },
    { name: "Practice", href: "/practice", icon: Code2, hasSubmenu: true },
    { name: "Planly", href: "/onboarding", icon: GitBranch },
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
    { name: "Organizer", href: "#", icon: CalendarCheck2 },
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

        {/* Scrollable Nav Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs scrollbar-thin scrollbar-thumb-zinc-800">
          {/* Section: Prep */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                <span>Prep</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            )}
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

          {/* Section: Explore */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                <span>Explore</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            )}
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

          {/* Section: My Spaces */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                <span>My Spaces</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            )}
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

        {/* Bottom Notification & User Profile */}
        {sidebarOpen && (
          <div className="p-3 border-t border-zinc-800/80 space-y-2.5 bg-zinc-950/60">
            {/* Notification Badge */}
            <div className="rounded-lg border border-zinc-800/90 bg-zinc-900/60 p-2.5 text-[11px]">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                  <Bell className="h-3 w-3" /> 3 unread
                </span>
                <span className="text-[10px] text-zinc-600">22h</span>
              </div>
              <p className="text-zinc-200 line-clamp-2 text-[11px] leading-tight">
                Hi Rahul, your account is ready. Start preparing on Crack SDE.
              </p>
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
