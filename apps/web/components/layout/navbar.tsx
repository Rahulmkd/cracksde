"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      if (pathname !== "/") return;
      const featuresEl = document.getElementById("features");
      if (featuresEl) {
        const rect = featuresEl.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActiveSection("features");
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("home");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const getStartedHref = isAuthenticated ? "/dashboard" : "/login";

  const isHomeActive = pathname === "/" && activeSection !== "features";
  const isFeaturesActive = pathname === "/" && activeSection === "features";
  const isDashboardActive = pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: CracksDE Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md py-1"
            aria-label="CracksDE Home"
          >
            <Image
              src="/cracksde_logo.png"
              alt="CracksDE Logo"
              width={32}
              height={32}
              priority
              className="h-8 w-auto object-contain"
            />
            <span className="font-bold tracking-tight text-[16px] text-zinc-100 flex items-center">
              Crack<span className="text-blue-500 ml-0.5">SDE</span>
            </span>
          </Link>

          {/* Desktop Navigation Links: Home, Features, Dashboard */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            <Link
              href="/"
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                isHomeActive
                  ? "bg-zinc-800/80 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
              )}
            >
              Home
            </Link>
            <Link
              href="/#features"
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                isFeaturesActive
                  ? "bg-zinc-800/80 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
              )}
            >
              Features
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                isDashboardActive
                  ? "bg-zinc-800/80 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
              )}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Side: CTA Button + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop CTA Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Button
              asChild
              size="sm"
              className="h-8 px-4 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <Link href={getStartedHref}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 md:hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-800/80 bg-zinc-950/95 px-4 py-3 md:hidden animate-in fade-in-0 duration-150">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
                isHomeActive
                  ? "bg-zinc-800/80 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              )}
            >
              Home
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
                isFeaturesActive
                  ? "bg-zinc-800/80 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              )}
            >
              Features
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
                isDashboardActive
                  ? "bg-zinc-800/80 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              )}
            >
              Dashboard
            </Link>
            <div className="pt-2 border-t border-zinc-800/60">
              <Button
                asChild
                className="w-full h-9 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href={getStartedHref} onClick={() => setMobileMenuOpen(false)}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
