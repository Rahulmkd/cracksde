"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Code2,
  GitBranch,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Prep Hub", href: "/prep-hub", icon: Compass },
    { name: "Practice", href: "/practice", icon: Code2 },
    { name: "Planly", href: "/planly", icon: GitBranch },
    { name: "Notes", href: "/notes", icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/90 bg-zinc-950/95 backdrop-blur-lg lg:hidden px-2 py-1.5 shadow-dialog safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
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
                "flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors min-w-[56px] text-center select-none",
                isActive
                  ? "text-blue-400 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-150",
                    isActive && "scale-110 text-blue-400"
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-medium leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
