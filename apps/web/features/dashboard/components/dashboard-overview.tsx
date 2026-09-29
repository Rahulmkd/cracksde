"use client";

import React, { useMemo } from "react";
import { Code2, Layers, Cpu, Database } from "lucide-react";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { usePlannerStore } from "@/store/planner-store";
import { DailyPlanner } from "@/components/layout/daily-planner";
import { DailyStatsRibbon } from "./daily-stats-ribbon";
import { SprintStatusCard } from "./sprint-status-card";
import { ProgressDonut } from "./progress-donut";
import { SubjectProgressBar } from "./subject-progress-bar";
import { QuickActionsCard } from "./quick-actions-card";
import type { CategoryProgress, PopularTopicItem } from "../types";

const POPULAR_TOPICS: PopularTopicItem[] = [
  {
    title: "Arrays & Strings Patterns",
    category: "DSA",
    desc: "Two Pointers, Sliding Window, Prefix Sums, and Matrix manipulations.",
    problems: 36,
    badge: "Fundamental",
    link: "/practice?subject=dsa&topic=Arrays",
  },
  {
    title: "Dynamic Programming Patterns",
    category: "DSA",
    desc: "0/1 Knapsack, Subsequences, Grid DP, and Interval State transitions.",
    problems: 42,
    badge: "High Frequency",
    link: "/practice?subject=dsa&topic=Dynamic-Programming",
  },
  {
    title: "Binary Trees & Graphs",
    category: "DSA",
    desc: "DFS, BFS, Dijkstra, Topological Sort, Disjoint Set Union, and MST.",
    problems: 58,
    badge: "Essential",
    link: "/practice?subject=dsa&topic=Trees-Graphs",
  },
  {
    title: "System Design & LLD Primer",
    category: "System Design",
    desc: "Load Balancing, Caching Layers, Sharding, Message Queues & CAP Theorem.",
    problems: 18,
    badge: "Architecture",
    link: "/practice?subject=system-design",
  },
  {
    title: "Operating Systems Internals",
    category: "Core Subjects",
    desc: "Virtual Memory, Paging, Concurrency, Deadlocks, Mutex & Linux commands.",
    problems: 24,
    badge: "Interview Core",
    link: "/practice?subject=operating-systems",
  },
  {
    title: "Database Internals & SQL",
    category: "Core Subjects",
    desc: "B+ Trees, ACID Properties, Transaction Isolation Levels & Indexing.",
    problems: 28,
    badge: "Interview Core",
    link: "/practice?subject=dbms",
  },
];

export function DashboardOverview() {
  const { plan } = useStudyPlan("crack-sde");
  const { points, streak } = usePlannerStore();

  const sprints = plan?.sprints || [];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);
  const totalTasks = allTasks.length || 847;
  const completedTasks = allTasks.filter((t) => t.status === "completed").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Dynamic Category Stats
  const categories: CategoryProgress[] = useMemo(() => {
    const dsaTasks = allTasks.filter((t) => (t.item?.subjectSlug || "").toLowerCase().includes("dsa"));
    const dsaTotal = dsaTasks.length || 412;
    const dsaCompleted = dsaTasks.filter((t) => t.status === "completed").length;
    const dsaPercent = Math.round((dsaCompleted / dsaTotal) * 100);

    const sysDesignTasks = allTasks.filter(
      (t) =>
        (t.item?.subjectSlug || "").toLowerCase().includes("system") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("lld")
    );
    const sysDesignTotal = sysDesignTasks.length || 104;
    const sysDesignCompleted = sysDesignTasks.filter((t) => t.status === "completed").length;
    const sysDesignPercent = Math.round((sysDesignCompleted / sysDesignTotal) * 100);

    const coreTasks = allTasks.filter(
      (t) =>
        (t.item?.subjectSlug || "").toLowerCase().includes("os") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("operat") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("netw")
    );
    const coreTotal = coreTasks.length || 186;
    const coreCompleted = coreTasks.filter((t) => t.status === "completed").length;
    const corePercent = Math.round((coreCompleted / coreTotal) * 100);

    const dbmsTasks = allTasks.filter((t) => (t.item?.subjectSlug || "").toLowerCase().includes("dbms"));
    const dbmsTotal = dbmsTasks.length || 145;
    const dbmsCompleted = dbmsTasks.filter((t) => t.status === "completed").length;
    const dbmsPercent = Math.round((dbmsCompleted / dbmsTotal) * 100);

    return [
      {
        name: "DSA",
        count: `${dsaCompleted} / ${dsaTotal}`,
        percent: dsaPercent,
        icon: Code2,
        color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      },
      {
        name: "System Design & LLD",
        count: `${sysDesignCompleted} / ${sysDesignTotal}`,
        percent: sysDesignPercent,
        icon: Layers,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        name: "Core Subjects (OS + CN)",
        count: `${coreCompleted} / ${coreTotal}`,
        percent: corePercent,
        icon: Cpu,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      },
      {
        name: "Database & SQL",
        count: `${dbmsCompleted} / ${dbmsTotal}`,
        percent: dbmsPercent,
        icon: Database,
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      },
    ];
  }, [allTasks]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* 1. Header Ribbon */}
      <DailyStatsRibbon streak={streak} points={points} />

      {/* 2. Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5">
          <SprintStatusCard />

          <div className="space-y-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight text-zinc-100">
              Your Progress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <ProgressDonut
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                progressPercent={progressPercent}
              />
              <SubjectProgressBar categories={categories} />
            </div>
          </div>

          <QuickActionsCard topics={POPULAR_TOPICS} />
        </div>

        {/* Right Column: Shared Daily Planner */}
        <aside className="lg:col-span-4 xl:col-span-3 w-full">
          <div className="sticky top-20">
            <DailyPlanner showProblemOfTheDay={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
