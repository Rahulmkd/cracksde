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
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore, type NavRect } from "@/store/ui-store";
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
  const {
    sidebarOpen,
    toggleSidebar,
    prepOpen,
    exploreOpen,
    spacesOpen,
    togglePrepOpen,
    toggleExploreOpen,
    toggleSpacesOpen,
    activeNavRect,
    activeNavHref,
    setActiveNavRect,
    setActiveNavHref,
  } = useUIStore();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});

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

  const allNavItems = [...prepItems, ...exploreItems, ...spacesItems];

  const matchedItem = allNavItems.find((item) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  const currentPathHref = matchedItem?.href;

  const measureNavElement = React.useCallback(
    (href: string): NavRect | null => {
      const activeEl = itemRefs.current[href];
      const container = containerRef.current;
      if (!activeEl || !container) return null;

      const containerRect = container.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();

      if (itemRect.height === 0 || itemRect.width === 0) return null;

      return {
        top: itemRect.top - containerRect.top + container.scrollTop,
        left: itemRect.left - containerRect.left,
        width: itemRect.width,
        height: itemRect.height,
        opacity: 1,
      };
    },
    []
  );

  // Sync position on mount, route change, and state changes
  React.useEffect(() => {
    const targetHref = activeNavHref || currentPathHref;
    if (!targetHref) {
      setActiveNavRect(null);
      return;
    }

    const syncPosition = () => {
      const rect = measureNavElement(targetHref);
      if (rect) {
        setActiveNavRect(rect);
      }
    };

    syncPosition();
    const r1 = requestAnimationFrame(syncPosition);
    const t1 = setTimeout(syncPosition, 50);
    const t2 = setTimeout(syncPosition, 220);

    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [
    pathname,
    prepOpen,
    exploreOpen,
    spacesOpen,
    sidebarOpen,
    currentPathHref,
    activeNavHref,
    measureNavElement,
    setActiveNavRect,
  ]);

  // Sync position on resize
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleSync = () => {
      const targetHref = activeNavHref || currentPathHref;
      if (targetHref) {
        const rect = measureNavElement(targetHref);
        if (rect) {
          setActiveNavRect(rect);
        }
      }
    };

    window.addEventListener("resize", handleSync);
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleSync);
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener("resize", handleSync);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [activeNavHref, currentPathHref, measureNavElement, setActiveNavRect]);

  const handleItemClick = (href: string) => {
    setActiveNavHref(href);
    const nextRect = measureNavElement(href);
    if (nextRect) {
      setActiveNavRect(nextRect);
    }
  };

  const renderNavGroup = (
    title: string,
    items: NavItem[],
    isOpen: boolean,
    onToggle: () => void
  ) => {
    return (
      <div className="space-y-1">
        {sidebarOpen ? (
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between px-2.5 py-1 text-[12px] font-medium text-zinc-500 hover:text-zinc-300 uppercase tracking-wider transition-colors select-none group"
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
              const isMatch =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              const isActive = activeNavHref ? activeNavHref === item.href : isMatch;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[item.href] = el;
                  }}
                  onClick={() => handleItemClick(item.href)}
                  className={cn(
                    "relative z-10 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14px] leading-[1.4] transition-colors duration-150 group select-none",
                    isActive
                      ? "text-blue-400 font-medium"
                      : "text-zinc-400 font-normal hover:bg-zinc-900/60 hover:text-zinc-100",
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
            onClick={() => handleItemClick("/dashboard")}
            className="flex items-center gap-2.5 overflow-hidden group focus-visible:outline-none"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-[13px] shadow-sm shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
              ⚡
            </div>
            {sidebarOpen && (
              <span className="font-semibold text-[15px] tracking-tight text-zinc-100 flex items-center">
                Crack<span className="text-blue-400 font-semibold ml-0.5">SDE</span>
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
        <div
          ref={containerRef}
          className="relative flex-1 overflow-y-auto px-2.5 py-3 space-y-4 text-[13px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Sliding Active Navigation Highlight & Indicator */}
          {activeNavRect && activeNavRect.opacity > 0 && (
            <div
              className="pointer-events-none absolute z-0 transition-all duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)] will-change-transform"
              style={{
                transform: `translate3d(${activeNavRect.left}px, ${activeNavRect.top}px, 0)`,
                width: `${activeNavRect.width}px`,
                height: `${activeNavRect.height}px`,
                top: 0,
                left: 0,
              }}
            >
              <div className="relative h-full w-full rounded-lg bg-blue-600/10 border border-blue-500/25 shadow-sm overflow-hidden">
                {/* Blue active indicator bar on the left edge */}
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              </div>
            </div>
          )}

          {renderNavGroup("Prep", prepItems, prepOpen, togglePrepOpen)}
          {renderNavGroup("Explore", exploreItems, exploreOpen, toggleExploreOpen)}
          {renderNavGroup("My Spaces", spacesItems, spacesOpen, toggleSpacesOpen)}
        </div>

        {/* Bottom Notification & User Profile */}
        <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950/80 space-y-2">
          {sidebarOpen ? (
            <>
              {/* Notification Badge */}
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2.5 space-y-1.5 transition-colors hover:border-zinc-700/80">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[12px] text-zinc-400 font-medium flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    4 updates
                  </span>
                  <span className="text-[12px] text-zinc-500">1d ago</span>
                </div>
                <p className="text-zinc-300 line-clamp-2 text-[12px] leading-[1.4] font-normal">
                  Your Crack SDE study roadmap is active. Sprints are organized for your target role.
                </p>
              </div>

              {/* Profile Drawer */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-[12px] font-semibold text-blue-400 border border-blue-500/30">
                    RA
                  </div>
                  <div className="truncate">
                    <div className="text-[13px] font-medium text-zinc-100 truncate">Rahul</div>
                    <div className="text-[12px] text-zinc-400 font-normal">Free Plan</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-[12px] font-medium border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
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
