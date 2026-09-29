import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-10 text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-zinc-800/60">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-zinc-100"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-600/20 text-white font-semibold text-[13px]">
                ⚡
              </div>
              <span>
                Crack<span className="text-blue-500 font-semibold ml-0.5">SDE</span>
              </span>
            </Link>
            <p className="text-[12px] text-zinc-400 leading-relaxed">
              Personalized day-by-day study sprints and practice engine for software engineering interview preparation.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-200">Curriculum</h4>
            <ul className="space-y-1.5 text-[12px]">
              <li><Link href="/prep-hub" className="hover:text-zinc-100 transition-colors">Data Structures & Algorithms</Link></li>
              <li><Link href="/prep-hub" className="hover:text-zinc-100 transition-colors">Database Management Systems</Link></li>
              <li><Link href="/prep-hub" className="hover:text-zinc-100 transition-colors">Operating Systems</Link></li>
              <li><Link href="/prep-hub" className="hover:text-zinc-100 transition-colors">Computer Networks</Link></li>
              <li><Link href="/prep-hub" className="hover:text-zinc-100 transition-colors">Low-Level Design (LLD)</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-200">Platform</h4>
            <ul className="space-y-1.5 text-[12px]">
              <li><Link href="/onboarding" className="hover:text-zinc-100 transition-colors">Personalized Roadmap</Link></li>
              <li><Link href="/planly" className="hover:text-zinc-100 transition-colors">Planly Sprint Planner</Link></li>
              <li><Link href="/practice" className="hover:text-zinc-100 transition-colors">847 Problem Bank</Link></li>
              <li><Link href="/codespace" className="hover:text-zinc-100 transition-colors">In-Browser Sandbox</Link></li>
              <li><Link href="/notes" className="hover:text-zinc-100 transition-colors">NoteSpace Cheatsheets</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-200">Community & Tools</h4>
            <ul className="space-y-1.5 text-[12px]">
              <li><Link href="/community" className="hover:text-zinc-100 transition-colors">Interview Discussions</Link></li>
              <li><Link href="/tools" className="hover:text-zinc-100 transition-colors">Bitwise Visualizer</Link></li>
              <li><Link href="/blogs" className="hover:text-zinc-100 transition-colors">Engineering Blogs</Link></li>
              <li><Link href="/unlock" className="hover:text-zinc-100 transition-colors">Pro Membership</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Crack SDE Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built for high-performance software engineering preparation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
