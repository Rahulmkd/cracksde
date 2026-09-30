"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
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
  BookOpen,
  FileText,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>("dsa");

  const getStartedHref = isAuthenticated ? "/dashboard" : "/login";

  const coreFeatures = [
    {
      title: "Planly Sprint Planner",
      description:
        "Structured day-by-day study sprints tailored to your target role, with milestone tracking, daily targets, and calendar scheduling.",
      icon: Calendar,
      href: "/planly",
      actionText: "Explore Planner",
    },
    {
      title: "Smart Catch-Up Engine",
      description:
        "Automatically redistributes overdue or missed tasks across future sprint days so you maintain steady progress without feeling overwhelmed.",
      icon: Sparkles,
      href: "/planly",
      actionText: "Learn Catch-Up",
    },
    {
      title: "Prep Hub Curriculum",
      description:
        "Comprehensive, in-depth study modules covering DSA, DBMS, Operating Systems, Computer Networks, OOPS, and Low-Level Design.",
      icon: BookOpen,
      href: "/prep-hub",
      actionText: "View Curriculum",
    },
    {
      title: "Curated Problem Bank",
      description:
        "800+ curated technical interview questions categorized by topic, difficulty, and high-frequency company interview patterns.",
      icon: Code2,
      href: "/practice",
      actionText: "Browse Problems",
    },
    {
      title: "NoteSpace & Cheatsheets",
      description:
        "Integrated note-taking for capturing algorithmic insights, design patterns, and quick-reference revision cheatsheets.",
      icon: FileText,
      href: "/notes",
      actionText: "Open NoteSpace",
    },
    {
      title: "Developer Prep Tools",
      description:
        "Interactive preparation utilities including the Bitwise Visualizer and Big-O Complexity Cheatsheet for technical mastery.",
      icon: Wrench,
      href: "/tools",
      actionText: "Launch Tools",
    },
  ];

  const subjects = [
    {
      name: "Data Structures & Algorithms",
      short: "DSA",
      slug: "dsa",
      modules: "19 Topics",
      desc: "Arrays, Trees, Graphs, Dynamic Programming, Heaps, and pattern-based problem solving for technical interviews.",
      badge: "Essential",
      icon: Code2,
      sampleTopics: [
        "Sliding Window & Two Pointers",
        "Dynamic Programming Patterns",
        "Binary Search Trees & Traversal",
        "Graph BFS/DFS & Shortest Path",
      ],
    },
    {
      name: "Database Management Systems",
      short: "DBMS",
      slug: "dbms",
      modules: "23 Topics",
      desc: "SQL query optimization, ACID transactions, B+ Trees indexing, concurrency control, and distributed databases.",
      badge: "Core",
      icon: Database,
      sampleTopics: [
        "B+ Tree Indexing & Range Queries",
        "ACID Isolation Levels & MVCC",
        "Query Optimization & Execution Plans",
        "Transactions & Concurrency Control",
      ],
    },
    {
      name: "Operating Systems",
      short: "OS",
      slug: "os",
      modules: "7 Modules",
      desc: "Processes, Threads, CPU Scheduling, Virtual Memory, Deadlocks, Mutex/Semaphores, and Linux internals.",
      badge: "Core",
      icon: Cpu,
      sampleTopics: [
        "Virtual Memory & Paging",
        "Process Synchronization & Mutex",
        "CPU Scheduling Algorithms",
        "Deadlocks & Concurrency Bugs",
      ],
    },
    {
      name: "Computer Networks",
      short: "CN",
      slug: "cn",
      modules: "15 Modules",
      desc: "OSI & TCP/IP models, Sockets, HTTP/HTTPS, DNS, Routing protocols, and Network Security.",
      badge: "Core",
      icon: Network,
      sampleTopics: [
        "TCP Handshake & Congestion Control",
        "Application Layer & DNS Resolution",
        "Network Layer & IP Routing",
        "Network Security & TLS Protocols",
      ],
    },
    {
      name: "Object-Oriented Programming",
      short: "OOPS",
      slug: "oops",
      modules: "6 Modules",
      desc: "Encapsulation, Polymorphism, Inheritance, Object Lifecycle, and C++/Java design paradigms.",
      badge: "Essential",
      icon: Layers,
      sampleTopics: [
        "Core Principles of OOP",
        "Virtual Functions & Polymorphism",
        "Object Relationships & Behaviour",
        "OOP Design & Lifecycle Management",
      ],
    },
    {
      name: "Low-Level Design (LLD)",
      short: "LLD",
      slug: "lld",
      modules: "13 Modules",
      desc: "SOLID principles, Creational, Structural & Behavioural Design Patterns, UML, and real-world system designs.",
      badge: "Advanced",
      icon: BookOpen,
      sampleTopics: [
        "SOLID Principles & Clean Architecture",
        "Creational & Structural Patterns",
        "Multithreading & Concurrency",
        "Real-World LLD Interview Problems",
      ],
    },
  ];

  const activeSubject = subjects.find((s) => s.slug === selectedSubjectSlug) || subjects[0];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-16 sm:pt-24 sm:pb-20 border-b border-zinc-800/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
          {/* Announcement / Focus Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1 text-[12px] font-medium text-zinc-300 backdrop-blur-sm shadow-subtle">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Personalized SDE Preparation Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 max-w-3xl mx-auto leading-[1.2]">
            Master Software Engineering Interviews with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Structured Sprints
            </span>
          </h1>

          {/* Short Supporting Description */}
          <p className="mx-auto max-w-2xl text-[14px] sm:text-[15px] text-zinc-400 leading-relaxed font-normal">
            A disciplined, day-by-day study roadmap designed around your schedule and target roles.
            Master DSA, System Design, Operating Systems, DBMS, and core computer science fundamentals with milestone tracking.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="w-full sm:w-auto h-10 px-6 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <Link href={getStartedHref}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-10 px-6 text-[13px] font-medium border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>

          {/* Platform Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[13px] text-zinc-400 font-normal">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>6 Core CS Tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Day-by-Day Sprint Planner</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Smart Catch-Up Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features Section */}
      <section id="features" className="py-16 sm:py-20 border-b border-zinc-800/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="blue" className="text-[11px] font-medium py-0 px-2.5">
              Core Platform Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Everything You Need to Prepare with Confidence
            </h2>
            <p className="text-[14px] text-zinc-400 leading-relaxed">
              Designed specifically for structured, consistent software engineering interview preparation.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-200 shadow-subtle group"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[16px] font-semibold text-zinc-100">{feature.title}</h3>
                    <p className="text-[13px] text-zinc-400 leading-relaxed">{feature.description}</p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-zinc-800/60 flex items-center justify-between">
                    <Link
                      href={feature.href}
                      className="text-[13px] font-medium text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
                    >
                      {feature.actionText}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum Tracks Section */}
      <section className="py-16 sm:py-20 border-b border-zinc-800/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="blue" className="text-[11px] font-medium py-0 px-2.5">
              Curriculum Tracks
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Core Engineering Subject Tracks
            </h2>
            <p className="text-[14px] text-zinc-400 leading-relaxed">
              In-depth curriculum modules mapped directly to high-frequency technical interview questions.
            </p>
          </div>

          {/* Subject Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {subjects.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setSelectedSubjectSlug(s.slug)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all select-none border",
                  selectedSubjectSlug === s.slug
                    ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/30 shadow-sm"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                )}
              >
                {s.short}
              </button>
            ))}
          </div>

          {/* Active Subject Detail Card */}
          {activeSubject && (
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 space-y-6 shadow-card animate-in fade-in-0 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-blue-400 font-mono font-medium">
                      {activeSubject.short} TRACK
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 px-2 border-zinc-700 text-zinc-300">
                      {activeSubject.badge}
                    </Badge>
                  </div>
                  <h3 className="text-[18px] sm:text-[20px] font-semibold text-zinc-100">
                    {activeSubject.name}
                  </h3>
                  <p className="text-[13px] text-zinc-400 max-w-2xl">{activeSubject.desc}</p>
                </div>

                <div className="shrink-0">
                  <span className="inline-block rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-[12px] font-mono font-medium text-zinc-300">
                    {activeSubject.modules}
                  </span>
                </div>
              </div>

              {/* Sample Topics */}
              <div className="space-y-3">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
                  Key Topics Covered
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  {activeSubject.sampleTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-zinc-800/60 bg-zinc-950/60 text-zinc-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <Button asChild size="sm" className="h-8 text-[13px] bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/prep-hub">
                    Explore All {activeSubject.short} Modules
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ready to Prepare CTA Section */}
      <section className="py-16 sm:py-20 bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Start Your Structured Preparation Today
          </h2>
          <p className="text-[14px] text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Create your personalized roadmap, track your daily milestones, and build problem-solving confidence step by step.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="w-full sm:w-auto h-10 px-6 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <Link href={getStartedHref}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-10 px-6 text-[13px] font-medium border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <Link href="/prep-hub">Browse Curriculum</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

