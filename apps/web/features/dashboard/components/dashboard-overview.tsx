"use client";

import React, { useMemo } from "react";
import { Code2, Layers, Cpu, Database, Sparkles, BookOpen } from "lucide-react";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useProfileStats } from "@/features/profile/hooks/use-profile";
import { useRoadmapSubjects } from "@/features/prep-hub/hooks/use-roadmap";
import { usePlannerStore } from "@/store/planner-store";
import { useAuth } from "@/hooks/use-auth";
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
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(" ")[0] : "Developer";

  // Dynamic remote data hooks with user-isolated queries
  const { plan, isLoading: isPlanLoading } = useStudyPlan("crack-sde");
  const { data: profileStatsData, isLoading: isProfileLoading } = useProfileStats();
  const { data: subjectsData, isLoading: isSubjectsLoading } = useRoadmapSubjects();
  const { points: storePoints, streak: storeStreak } = usePlannerStore();

  const sprints = plan?.sprints || [];
  const activeSprint = sprints.find((s) => s.status === "in_progress") || sprints[0];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);

  // Dynamic user streak and gamified study points
  const points = profileStatsData?.studyPoints ?? storePoints ?? 0;
  const streak = profileStatsData?.streakDays ?? storeStreak ?? 0;

  // Real curriculum totals & completion counts
  const totalTasks =
    plan?.totalTasks || profileStatsData?.totalCurriculumItems || (allTasks.length > 0 ? allTasks.length : 847);
  const completedTasks =
    profileStatsData?.totalSolved ?? allTasks.filter((t) => t.status === "completed").length;
  const progressPercent =
    profileStatsData?.overallPercentage ??
    (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  // Difficulty level breakdowns (Basic, Core, Pro)
  const basicTotal =
    allTasks.filter(
      (t) => (t.item?.difficulty || "").toLowerCase() === "easy" || (t.item?.difficulty || "").toLowerCase() === "basic"
    ).length || 214;
  const basicCompleted = allTasks.filter(
    (t) =>
      t.status === "completed" &&
      ((t.item?.difficulty || "").toLowerCase() === "easy" || (t.item?.difficulty || "").toLowerCase() === "basic")
  ).length;

  const coreTotal =
    allTasks.filter(
      (t) => (t.item?.difficulty || "").toLowerCase() === "medium" || (t.item?.difficulty || "").toLowerCase() === "core"
    ).length || 412;
  const coreCompleted = allTasks.filter(
    (t) =>
      t.status === "completed" &&
      ((t.item?.difficulty || "").toLowerCase() === "medium" || (t.item?.difficulty || "").toLowerCase() === "core")
  ).length;

  const proTotal =
    allTasks.filter(
      (t) => (t.item?.difficulty || "").toLowerCase() === "hard" || (t.item?.difficulty || "").toLowerCase() === "pro"
    ).length || 221;
  const proCompleted = allTasks.filter(
    (t) =>
      t.status === "completed" &&
      ((t.item?.difficulty || "").toLowerCase() === "hard" || (t.item?.difficulty || "").toLowerCase() === "pro")
  ).length;

  // Real Category-wise Progress from live database subjects
  const categories: CategoryProgress[] = useMemo(() => {
    if (subjectsData && subjectsData.length > 0) {
      return subjectsData.map((sub) => {
        const slug = sub.slug.toLowerCase();
        let icon = Code2;
        let color = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
        let barColor = "bg-cyan-400";

        if (slug.includes("system") || slug.includes("lld") || slug.includes("design")) {
          icon = Layers;
          color = "text-amber-400 bg-amber-500/10 border-amber-500/20";
          barColor = "bg-amber-400";
        } else if (slug.includes("os") || slug.includes("operat") || slug.includes("netw")) {
          icon = Cpu;
          color = "text-purple-400 bg-purple-500/10 border-purple-500/20";
          barColor = "bg-purple-400";
        } else if (slug.includes("dbms") || slug.includes("sql") || slug.includes("data")) {
          icon = Database;
          color = "text-blue-400 bg-blue-500/10 border-blue-500/20";
          barColor = "bg-blue-400";
        }

        const solved = sub.totalSolved || 0;
        const total = sub.totalItems || 1;
        const percent = Math.round((solved / Math.max(1, total)) * 100);

        return {
          name: sub.name,
          count: `${solved} / ${total}`,
          percent,
          icon,
          color,
          barColor,
        };
      });
    }

    // Fallback based on tasks
    const dsaTasks = allTasks.filter((t) => (t.item?.subjectSlug || "").toLowerCase().includes("dsa"));
    const dsaTotal = dsaTasks.length || 354;
    const dsaDoneCount = dsaTasks.filter((t) => t.status === "completed").length;
    const dsaPercent = Math.round((dsaDoneCount / dsaTotal) * 100);

    const sysDesignTasks = allTasks.filter(
      (t) =>
        (t.item?.subjectSlug || "").toLowerCase().includes("system") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("lld")
    );
    const sysDesignTotal = sysDesignTasks.length || 137;
    const sysDesignDoneCount = sysDesignTasks.filter((t) => t.status === "completed").length;
    const sysDesignPercent = Math.round((sysDesignDoneCount / sysDesignTotal) * 100);

    const coreTasks = allTasks.filter(
      (t) =>
        (t.item?.subjectSlug || "").toLowerCase().includes("os") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("operat") ||
        (t.item?.subjectSlug || "").toLowerCase().includes("netw")
    );
    const coreTotalCount = coreTasks.length || 178;
    const coreDoneCount = coreTasks.filter((t) => t.status === "completed").length;
    const corePercent = Math.round((coreDoneCount / coreTotalCount) * 100);

    const dbmsTasks = allTasks.filter((t) => (t.item?.subjectSlug || "").toLowerCase().includes("dbms"));
    const dbmsTotalCount = dbmsTasks.length || 210;
    const dbmsDoneCount = dbmsTasks.filter((t) => t.status === "completed").length;
    const dbmsPercent = Math.round((dbmsDoneCount / dbmsTotalCount) * 100);

    return [
      {
        name: "Data Structures & Algorithms",
        count: `${dsaDoneCount} / ${dsaTotal}`,
        percent: dsaPercent,
        icon: Code2,
        color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        barColor: "bg-cyan-400",
      },
      {
        name: "System Design & Architecture",
        count: `${sysDesignDoneCount} / ${sysDesignTotal}`,
        percent: sysDesignPercent,
        icon: Layers,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        barColor: "bg-amber-400",
      },
      {
        name: "Operating Systems & Networks",
        count: `${coreDoneCount} / ${coreTotalCount}`,
        percent: corePercent,
        icon: Cpu,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        barColor: "bg-purple-400",
      },
      {
        name: "Database Management & SQL",
        count: `${dbmsDoneCount} / ${dbmsTotalCount}`,
        percent: dbmsPercent,
        icon: Database,
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        barColor: "bg-blue-400",
      },
    ];
  }, [subjectsData, allTasks]);

  const sprintNumber = activeSprint?.sprintNo || 1;
  const sprintFocus =
    sprintNumber === 1
      ? "Data Structures & OOPS Foundations."
      : sprintNumber === 2
      ? "Binary Trees, BSTs & Graph Traversals."
      : sprintNumber === 3
      ? "Dynamic Programming & Optimization Techniques."
      : "Full Stack SDE Problem Solving.";

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* 1. Header Announcement & Greeting Ribbon */}
      <DailyStatsRibbon
        streak={streak}
        points={points}
        userName={userName}
        sprintNumber={sprintNumber}
        sprintFocus={sprintFocus}
      />

      {/* 2. Responsive 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Left Column */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Planly Sprint Roadmap Card */}
          <SprintStatusCard
            sprintNumber={sprintNumber}
            targetDays={plan?.totalDays || 61}
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
