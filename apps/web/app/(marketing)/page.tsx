"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Database,
  Cpu,
  Network,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Zap,
  BookOpen,
  ChevronDown,
  Building2,
  Trophy,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [selectedPreviewTab, setSelectedPreviewTab] = useState<string>("dsa");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const subjects = [
    {
      name: "Data Structures & Algorithms",
      short: "DSA",
      slug: "dsa",
      hours: "116h",
      topics: 16,
      desc: "Arrays, Trees, Graphs, DP, Heaps, and pattern-based problem solving for coding rounds.",
      badge: "Essential",
      icon: Code2,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      sampleTopics: [
        "Two Pointers & Sliding Window",
        "Dynamic Programming (Knapsack & Grid)",
        "Binary Search Trees & Morris Traversal",
        "Graph BFS/DFS & Dijkstra's Algorithm",
      ],
    },
    {
      name: "Database Management Systems",
      short: "DBMS",
      slug: "dbms",
      hours: "57h",
      topics: 16,
      desc: "SQL query optimization, ACID transactions, B+ Trees indexing, and schema design.",
      badge: "Core",
      icon: Database,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      sampleTopics: [
        "B+ Tree Indexing & Range Queries",
        "ACID Isolation Levels & MVCC",
        "Query Execution Plans & EXPLAIN ANALYZE",
        "Database Sharding & Replication",
      ],
    },
    {
      name: "Operating Systems",
      short: "OS",
      slug: "os",
      hours: "24h",
      topics: 14,
      desc: "Processes, Threads, Virtual Memory paging, Deadlocks, Mutex & Linux internals.",
      badge: "Core",
      icon: Cpu,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      sampleTopics: [
        "Virtual Memory Paging & TLB Misses",
        "Process Synchronization & Mutex/Semaphores",
        "Deadlock Banker's Algorithm",
        "Linux File System & Inodes",
      ],
    },
    {
      name: "Computer Networks",
      short: "CN",
      slug: "cn",
      hours: "24h",
      topics: 12,
      desc: "OSI Model, TCP/IP handshake, Sockets, HTTP/HTTPS, DNS, and Web Protocols.",
      badge: "Core",
      icon: Network,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      sampleTopics: [
        "TCP 3-Way Handshake & Teardown",
        "HTTP/2 Multiplexing & HTTP/3 QUIC",
        "DNS Resolution & Sockets Programming",
        "TLS Certificate Handshakes",
      ],
    },
    {
      name: "Object-Oriented Programming",
      short: "OOPS",
      slug: "oops",
      hours: "18h",
      topics: 11,
      desc: "Encapsulation, Polymorphism, Inheritance, Design principles, and C++/Java.",
      badge: "Essential",
      icon: Layers,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      sampleTopics: [
        "Virtual Functions & VTABLEs in C++",
        "Abstract Classes vs Interfaces",
        "Design Principles (Composition over Inheritance)",
        "Memory Model & Garbage Collection",
      ],
    },
    {
      name: "Low-Level Design (LLD)",
      short: "LLD",
      slug: "lld",
      hours: "31h",
      topics: 14,
      desc: "SOLID principles, Design patterns, UML diagrams, and real-world system designs.",
      badge: "Advanced",
      icon: BookOpen,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      sampleTopics: [
        "SOLID Principles & Factory/Strategy Patterns",
        "LRU Cache & Rate Limiter LLD",
        "Parking Lot System & Elevator System Design",
        "Thread-Safe Singleton & Producer-Consumer",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Aman Sharma",
      role: "Software Engineer at Google",
      avatar: "AS",
      text: "The day-by-day sprint pacing on Crack SDE kept me consistent for 2 months. Cleared my L4 interview loop with confidence.",
    },
    {
      name: "Priya V",
      role: "SDE I at Amazon",
      avatar: "PV",
      text: "Having DSA patterns grouped with DBMS internals in the same 9 sprints saved me hours of context switching.",
    },
    {
      name: "Rohan Gupta",
      role: "Software Engineer at Microsoft",
      avatar: "RG",
      text: "The NoteSpace cheatsheets and Buganizer edge-case logger helped me prevent repetitive coding mistakes during technical rounds.",
    },
  ];

  const faqs = [
    {
      q: "How does Crack SDE generate my personalized study plan?",
      a: "Our study engine considers your target role (Intern, SDE 1, SDE 2, Senior), your engineering experience, your baseline proficiency in DSA/DBMS/OS, and your available study hours per day to create a structured 9-sprint calendar.",
    },
    {
      q: "Is the curriculum suitable for FAANG & Big Tech interviews?",
      a: "Yes! All 847 curated problems and system design modules are aligned with the high-frequency interview patterns used by Google, Meta, Amazon, Microsoft, and top tier product startups.",
    },
    {
      q: "What if I miss a few study days due to work or university?",
      a: "Planly includes a built-in 'Smart Catch-Up Mode' that dynamically redistributes overdue backlog tasks across remaining sprint days without overloading your schedule.",
    },
  ];

  const activeSubjectData = subjects.find((s) => s.slug === selectedPreviewTab) || subjects[0];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white select-none">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-12 sm:pt-16 sm:pb-14 border-b border-zinc-800/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-4">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-[11px] font-medium backdrop-blur-sm shadow-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-zinc-300">847 Curated Problems &middot; 9 Structured Sprints</span>
            <span className="text-blue-400">&rarr;</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-[26px] sm:text-[34px] font-semibold leading-tight tracking-tight text-zinc-100 max-w-3xl mx-auto">
            Get a personal study sprint roadmap built around your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">career goals</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-[13px] text-zinc-400 leading-normal font-normal">
            Personalized day-by-day study sprints for Software Engineering preparation.
            Master DSA, DBMS, OS, Computer Networks, OOPS, and LLD with structured milestones.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button
              asChild
              className="w-full sm:w-auto h-8 px-5 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Link href="/onboarding">
                Create My Personalized Roadmap <ArrowRight className="h-3 w-3 ml-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-8 px-5 text-[12px] font-medium border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Link href="/dashboard">Go to Study Dashboard</Link>
            </Button>
          </div>

          {/* Highlights Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[12px] text-zinc-400 font-normal">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>270+ Hours of Curriculum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>61-Day Sprint Roadmap</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Role &amp; Level Pacing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Curriculum Previewer */}
      <section className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <Badge variant="blue" className="text-[11px] font-medium py-0 px-2">Interactive Preview</Badge>
          <h2 className="text-[18px] sm:text-[22px] font-semibold leading-tight tracking-tight text-zinc-100">
            Explore Your Core Curriculum Tracks
          </h2>
          <p className="text-[12px] text-zinc-400 leading-normal">
            Click any domain below to inspect curated topics and high-frequency problem patterns.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {subjects.map((s) => (
            <button
              key={s.slug}
              onClick={() => setSelectedPreviewTab(s.slug)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all select-none border",
                selectedPreviewTab === s.slug
                  ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/30 shadow-sm"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {s.short}
            </button>
          ))}
        </div>

        {/* Selected Domain Card */}
        {activeSubjectData && (
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 shadow-card animate-in fade-in-0 duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
              <div className="space-y-0.5">
                <span className="text-[11px] text-blue-400 font-mono font-medium">{activeSubjectData.short} TRACK</span>
                <h3 className="text-[16px] font-semibold text-zinc-100">{activeSubjectData.name}</h3>
                <p className="text-[12px] text-zinc-400">{activeSubjectData.desc}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <Badge variant="blue" className="text-[11px] py-0 px-2 font-mono">
                  {activeSubjectData.hours} &middot; {activeSubjectData.topics} Modules
                </Badge>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 text-[12px]">
              {activeSubjectData.sampleTopics.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border border-zinc-800/60 bg-zinc-950/60 text-zinc-300">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-semibold shrink-0">
                    ✓
                  </span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button asChild size="sm" className="h-7 text-[12px] bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/onboarding">
                  Start This Track <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Social Proof Testimonials */}
      <section className="border-t border-zinc-800/80 bg-zinc-950/60 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-[18px] font-semibold text-zinc-100">Proven by Engineers at Top Tech Companies</h2>
            <p className="text-[12px] text-zinc-400">Candidates who structured their preparation with Crack SDE sprints.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2.5 shadow-subtle flex flex-col justify-between">
                <p className="text-[12px] text-zinc-300 italic leading-normal">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-semibold text-[10px]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-zinc-200">{t.name}</div>
                    <div className="text-[10px] text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-10 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-[18px] font-semibold text-zinc-100">Frequently Asked Questions</h2>
          <p className="text-[12px] text-zinc-400">Everything you need to know about the personalized sprint planner.</p>
        </div>

        <div className="space-y-2 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-3.5 text-left text-[13px] font-semibold text-zinc-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200", isOpen && "rotate-180 text-blue-400")} />
                </button>
                {isOpen && (
                  <div className="border-t border-zinc-800/60 bg-zinc-950/60 p-3.5 text-[12px] text-zinc-400 leading-relaxed font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
