import React from "react";
import Link from "next/link";
import Image from "next/image";
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
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
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
          <span className="font-bold tracking-tight text-[16px] text-zinc-100">
            Crack<span className="text-blue-500 ml-0.5">SDE</span>
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
        &copy; {new Date().getFullYear()} CracksDE. All rights reserved.
      </footer>
    </div>
  );
}
