import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white">
      {/* Centered Auth Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-zinc-100 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-600/20 text-white font-semibold text-[13px]">
            ⚡
          </div>
          <span>
            Crack<span className="text-blue-500 font-semibold ml-0.5">SDE</span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>SSL 256-bit Encrypted</span>
        </div>
      </header>

      {/* Main Centered Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-zinc-500 border-t border-zinc-900">
        &copy; {new Date().getFullYear()} Crack SDE. All rights reserved.
      </footer>
    </div>
  );
}
