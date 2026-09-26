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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const subjects = [
    {
      name: "Data Structures & Algorithms",
      short: "DSA",
      hours: "116h",
      topics: 16,
      desc: "Arrays, Trees, Graphs, DP, Heaps, and pattern-based problem solving for coding rounds.",
      badge: "Essential",
      icon: Code2,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      name: "Database Management Systems",
      short: "DBMS",
      hours: "57h",
      topics: 16,
      desc: "SQL query optimization, ACID transactions, B+ Trees indexing, and schema design.",
      badge: "Core",
      icon: Database,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      name: "Operating Systems",
      short: "OS",
      hours: "24h",
      topics: 14,
      desc: "Processes, Threads, Virtual Memory paging, Deadlocks, Mutex & Linux internals.",
      badge: "Core",
      icon: Cpu,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      name: "Computer Networks",
      short: "CN",
      hours: "24h",
      topics: 12,
      desc: "OSI Model, TCP/IP handshake, Sockets, HTTP/HTTPS, DNS, and Web Protocols.",
      badge: "Core",
      icon: Network,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      name: "Object-Oriented Programming",
      short: "OOPS",
      hours: "18h",
      topics: 11,
      desc: "Encapsulation, Polymorphism, Inheritance, Design principles, and C++/Java.",
      badge: "Essential",
      icon: Layers,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      name: "Low-Level Design (LLD)",
      short: "LLD",
      hours: "31h",
      topics: 14,
      desc: "SOLID principles, Design patterns, UML diagrams, and real-world system designs.",
      badge: "Advanced",
      icon: BookOpen,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-12 sm:pt-16 sm:pb-14 border-b border-zinc-800/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-4">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-[11px] font-medium backdrop-blur-sm shadow-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-zinc-300">847 Curated Problems &middot; 9 Structured Sprints</span>
            <span className="text-blue-400">&rarr;</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-[24px] sm:text-[28px] font-semibold leading-tight tracking-tight text-zinc-100 max-w-3xl mx-auto">
            Get a personal roadmap built around your{" "}
            <span className="text-blue-400">career goals</span>
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
              <span>Target Role &amp; Level Customization</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Subjects Grid */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <Badge variant="blue" className="text-[11px] font-medium py-0 px-2">Comprehensive Curriculum</Badge>
          <h2 className="text-[18px] sm:text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            6 Core Domains for SDE Mastery
          </h2>
          <p className="text-[12px] text-zinc-400 leading-normal font-normal">
            Complete knowledge tree and practice roadmap structured for top-tier software engineering interviews.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.short}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col justify-between shadow-subtle"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg border", sub.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 font-medium">{sub.hours}</span>
                  </div>

                  <h3 className="text-[14px] font-semibold leading-snug text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {sub.name}
                  </h3>

                  <p className="text-[12px] font-normal text-zinc-400 leading-normal">{sub.desc}</p>
                </div>

                <div className="pt-2.5 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60">
                  <span className="text-[11px] text-zinc-500 font-mono">{sub.topics} Modules</span>
                  <Link
                    href="/onboarding"
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 text-[12px]"
                  >
                    Start Track <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
