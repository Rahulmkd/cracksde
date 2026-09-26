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
  Flame,
  Calendar,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const subjects = [
    {
      name: "Data Structures & Algorithms",
      short: "DSA",
      hours: "116h",
      topics: 16,
      desc: "Arrays, Trees, Graphs, DP, Heaps, and pattern-based problem solving.",
      badge: "Essential",
      color: "from-blue-600/20 to-cyan-600/10 border-blue-500/30 text-blue-400",
    },
    {
      name: "Database Management Systems",
      short: "DBMS",
      hours: "57h",
      topics: 16,
      desc: "SQL, ACID properties, Indexing, Transactions, Normalization, and NoSQL.",
      badge: "Core",
      color: "from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400",
    },
    {
      name: "Operating Systems",
      short: "OS",
      hours: "24h",
      topics: 14,
      desc: "Processes, Threads, Memory management, Deadlocks, Synchronization, and Linux.",
      badge: "Core",
      color: "from-purple-600/20 to-indigo-600/10 border-purple-500/30 text-purple-400",
    },
    {
      name: "Computer Networks",
      short: "CN",
      hours: "24h",
      topics: 12,
      desc: "OSI Model, TCP/IP, Routing, Sockets, HTTP/HTTPS, DNS, and Web Protocols.",
      badge: "Core",
      color: "from-amber-600/20 to-orange-600/10 border-amber-500/30 text-amber-400",
    },
    {
      name: "Object-Oriented Programming",
      short: "OOPS",
      hours: "18h",
      topics: 11,
      desc: "Encapsulation, Polymorphism, Inheritance, Design principles, and C++/Java.",
      badge: "Essential",
      color: "from-rose-600/20 to-pink-600/10 border-rose-500/30 text-rose-400",
    },
    {
      name: "Low-Level Design",
      short: "LLD",
      hours: "31h",
      topics: 14,
      desc: "SOLID principles, Design patterns, UML diagrams, and real-world system designs.",
      badge: "Advanced",
      color: "from-cyan-600/20 to-blue-600/10 border-cyan-500/30 text-cyan-400",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-24">
        {/* Glow ambient backgrounds */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-zinc-400">847 Curated Problems &middot; 9 Structured Sprints</span>
            <span className="text-blue-400">&rarr;</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100">
            Get a personal roadmap built around your{" "}
            <span className="italic font-serif font-normal text-blue-400">goals</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            Personalized day-by-day study sprints for Software Engineering preparation.
            Master DSA, DBMS, OS, Computer Networks, OOPS, and LLD.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              asChild
              className="w-full sm:w-auto h-12 px-8 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/25"
            >
              <Link href="/onboarding">
                Create My Personalized Roadmap <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 text-sm border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Link href="/dashboard">Go to Study Dashboard</Link>
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>270+ Hours of Curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span>61-Day Sprint Roadmap</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Target Role &amp; Level Customization</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Subjects Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 border-t border-zinc-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="blue" className="mb-2">Comprehensive Curriculum</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            6 Core Domains for SDE Mastery
          </h2>
          <p className="mt-2 text-xs text-zinc-400">
            Single source of truth knowledge tree backed by PostgreSQL.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((sub) => (
            <div
              key={sub.short}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">{sub.short}</span>
                <span className="text-xs font-mono text-zinc-500">{sub.hours}</span>
              </div>
              <h3 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors">
                {sub.name}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{sub.desc}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/60">
                <span>{sub.topics} Modules</span>
                <Link
                  href="/onboarding"
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  Explore <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
