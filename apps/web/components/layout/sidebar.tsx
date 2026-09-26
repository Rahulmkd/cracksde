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
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
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
    { name: "Buganizer", href: "/buganizer", icon: CalendarCheck2 },
  ];

  const renderNavGroup = (
    title: string,
    items: NavItem[],
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (
      <div className="space-y-1">
        {sidebarOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 uppercase tracking-wider transition-colors select-none group"
          >
            <span>{title}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200",
                isOpen ? "rotate-0" : "-rotate-90"
              )}
            />
          </button>
        ) : (
          <div className="mx-auto my-1 h-px w-6 bg-zinc-800" />
        )}

        <div
          className={cn(
            "grid transition-all duration-200 ease-in-out",
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
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 group select-none",
                    isActive
                      ? "bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/25 shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100 border border-transparent",
                    !sidebarOpen && "justify-center px-0 py-2"
                  )}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-blue-400"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    )}
                  />
                  {sidebarOpen && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in-0 duration-200"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-300 transition-all duration-300 select-none",
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-3.5 border-b border-zinc-800/80 bg-zinc-950">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden group focus-visible:outline-none"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
              ⚡
            </div>
            {sidebarOpen && (
              <span className="font-bold text-sm tracking-tight text-zinc-100 flex items-center">
                Crack<span className="text-blue-400 font-extrabold ml-0.5">SDE</span>
              </span>
            )}
          </Link>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors focus-visible:outline-none"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Scrollable Nav Sections without visible scrollbar */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {renderNavGroup("Prep", prepItems, prepOpen, setPrepOpen)}
          {renderNavGroup("Explore", exploreItems, exploreOpen, setExploreOpen)}
          {renderNavGroup("My Spaces", spacesItems, spacesOpen, setSpacesOpen)}
        </div>

        {/* Bottom Notification & User Profile */}
        <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950/80 space-y-2">
          {sidebarOpen ? (
            <>
              {/* Notification Badge */}
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2.5 text-[11px] space-y-1.5 transition-colors hover:border-zinc-700/80">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    4 updates
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">1d ago</span>
                </div>
                <p className="text-zinc-300 line-clamp-2 text-[11px] leading-tight font-normal">
                  Your Crack SDE study roadmap is active. Sprints are organized for your target role.
                </p>
              </div>

              {/* Profile Drawer */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
                    RA
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-zinc-100 truncate">Rahul</div>
                    <div className="text-[10px] text-zinc-400 font-medium">Free Plan</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-[10px] font-medium border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                >
                  <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
                  Upgrade
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 text-xs font-semibold text-blue-400 border border-blue-500/30 cursor-pointer"
                title="Rahul (Free Plan)"
              >
                RA
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
