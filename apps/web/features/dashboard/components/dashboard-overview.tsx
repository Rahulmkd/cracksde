"use client";

import React, { useMemo } from "react";
import { Code2, Layers, Cpu, Database } from "lucide-react";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { usePlannerStore } from "@/store/planner-store";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
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
  const { user } = useAuthSession();
  const userName = user?.name ? user.name.split(" ")[0] : "Rahul";
  const { plan } = useStudyPlan("crack-sde");
  const { points, streak } = usePlannerStore();

  const sprints = plan?.sprints || [];
  const activeSprint = sprints.find((s) => s.status === "in_progress") || sprints[0];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);

  const totalTasks = 847;
  const completedTasksCount = allTasks.filter((t) => t.status === "completed").length;
  // If no completed tasks in remote store yet, display curriculum baseline (25 solved)
  const completedTasks = completedTasksCount > 0 ? completedTasksCount : 25;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 3;

  // Level breakdowns matching curriculum numbers (214 Basic, 412 Core, 221 Pro = 847 total)
  const basicTotal = 214;
  const coreTotal = 412;
  const proTotal = 221;
  const basicCompleted = allTasks.filter((t) => t.status === "completed" && (t.item?.difficulty === "easy" || t.item?.difficulty === "basic")).length;
  const coreCompleted = allTasks.filter((t) => t.status === "completed" && (t.item?.difficulty === "medium" || t.item?.difficulty === "core")).length;
  const proCompleted = allTasks.filter((t) => t.status === "completed" && (t.item?.difficulty === "hard" || t.item?.difficulty === "pro")).length;

  // Dynamic Category Stats with exact subject totals from curriculum
  const categories: CategoryProgress[] = useMemo(() => {
    const dsaTasks = allTasks.filter((t) => (t.item?.subjectSlug || "").toLowerCase().includes("dsa"));
    const dsaTotal = 354;
    const dsaDoneCount = dsaTasks.filter((t) => t.status === "completed").length;
    const dsaCompleted = dsaDoneCount > 0 ? dsaDoneCount : 22;
    const dsaPercent = Math.round((dsaCompleted / dsaTotal) * 100);

    const sysDesignTasks = allTasks.filter(
      (t) =>
        (t.item?.subjectSlug || "").toLowerCase().includes("system") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("lld")
    );
    const sysDesignTotal = 137;
    const sysDesignDoneCount = sysDesignTasks.filter((t) => t.status === "completed").length;
    const sysDesignCompleted = sysDesignDoneCount > 0 ? sysDesignDoneCount : 0;
    const sysDesignPercent = Math.round((sysDesignCompleted / sysDesignTotal) * 100);

    const coreTasks = allTasks.filter(
      (t) =>
        (t.item?.subjectSlug || "").toLowerCase().includes("os") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("operat") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("netw")
    );
    const coreTotalCount = 178;
    const coreDoneCount = coreTasks.filter((t) => t.status === "completed").length;
    const coreCompletedCount = coreDoneCount > 0 ? coreDoneCount : 1;
    const corePercent = Math.round((coreCompletedCount / coreTotalCount) * 100);

    const dbmsTasks = allTasks.filter((t) => (t.item?.subjectSlug || "").toLowerCase().includes("dbms"));
    const dbmsTotalCount = 210;
    const dbmsDoneCount = dbmsTasks.filter((t) => t.status === "completed").length;
    const dbmsCompletedCount = dbmsDoneCount > 0 ? dbmsDoneCount : 1;
    const dbmsPercent = Math.round((dbmsCompletedCount / dbmsTotalCount) * 100);

    return [
      {
        name: "DSA",
        count: `${dsaCompleted} / ${dsaTotal}`,
        percent: dsaPercent,
        icon: Code2,
        color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        barColor: "bg-cyan-400",
      },
      {
        name: "System Design & LLD",
        count: `${sysDesignCompleted} / ${sysDesignTotal}`,
        percent: sysDesignPercent,
        icon: Layers,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        barColor: "bg-amber-400",
      },
      {
        name: "Core Subjects (OS + CN)",
        count: `${coreCompletedCount} / ${coreTotalCount}`,
        percent: corePercent,
        icon: Cpu,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        barColor: "bg-purple-400",
      },
      {
        name: "Database & SQL",
        count: `${dbmsCompletedCount} / ${dbmsTotalCount}`,
        percent: dbmsPercent,
        icon: Database,
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        barColor: "bg-blue-400",
      },
    ];
  }, [allTasks]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* 1. Header Announcement & Greeting Ribbon */}
      <DailyStatsRibbon
        streak={streak || 3}
        points={points || 315}
        userName={userName}
        sprintNumber={activeSprint?.sprintNo || 1}
        sprintFocus="Data Structures & OOPS Foundations."
      />

      {/* 2. Responsive 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Left Column */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Planly Sprint Roadmap Card */}
          <SprintStatusCard
            sprintNumber={activeSprint?.sprintNo || 1}
            targetDays={61}
            totalSprints={sprints.length || 9}
          />

          {/* "Your Progress" Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[16px] font-bold tracking-tight text-white">
              <span className="text-blue-400 text-sm">✦</span>
              <h2>Your Progress</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProgressDonut
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                progressPercent={progressPercent}
                basicCompleted={basicCompleted}
                basicTotal={basicTotal}
                coreCompleted={coreCompleted}
                coreTotal={coreTotal}
                proCompleted={proCompleted}
                proTotal={proTotal}
              />
              <SubjectProgressBar categories={categories} />
            </div>
          </div>

          {/* "Explore Popular Topics" Section */}
          <QuickActionsCard topics={POPULAR_TOPICS} />
        </div>

        {/* Right Side Column: Problem of the Day & Daily Planner */}
        <aside className="lg:col-span-4 xl:col-span-3 w-full">
          <div className="sticky top-20">
            <DailyPlanner showProblemOfTheDay={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
