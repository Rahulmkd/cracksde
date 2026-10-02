"use client";

import React, { useMemo } from "react";
import { Code2 } from "lucide-react";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { useProfileStats } from "@/features/profile/hooks/use-profile";
import { useRoadmapSubjects, useRoadmapSubjectDetail } from "@/features/prep-hub/hooks/use-roadmap";
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
  const { user, isLoading: isAuthLoading } = useAuth();
  const userName = user?.name ? user.name.trim().split(" ")[0] : isAuthLoading ? undefined : "Developer";

  // Dynamic remote data hooks with user-isolated queries
  const { plan, isLoading: isPlanLoading } = useStudyPlan("crack-sde");
  const { data: profileStatsData, isLoading: isProfileLoading } = useProfileStats();
  const { data: subjectsData, isLoading: isSubjectsLoading } = useRoadmapSubjects();
  const { data: dsaSubjectDetail, isLoading: isDsaLoading } = useRoadmapSubjectDetail("dsa");
  const { points: storePoints, streak: storeStreak } = usePlannerStore();

  const isProgressLoading =
    isAuthLoading ||
    isSubjectsLoading ||
    isDsaLoading ||
    (!subjectsData && !dsaSubjectDetail);

  const sprints = plan?.sprints || [];
  const activeSprint = sprints.find((s) => s.status === "in_progress") || sprints[0];
  const allDays = sprints.flatMap((s) => s.days || []);
  const allTasks = allDays.flatMap((d) => d.tasks || []);

  // Dynamic user streak and gamified study points
  const points = profileStatsData?.studyPoints ?? storePoints ?? 0;
  const streak = profileStatsData?.streakDays ?? storeStreak ?? 0;

  // Extract DSA specific items and calculate real dynamic breakdown
  const dsaItems = useMemo(() => {
    if (!dsaSubjectDetail?.topics) return [];
    return dsaSubjectDetail.topics.flatMap((t) => [
      ...(t.items || []),
      ...(t.subtopics?.flatMap((s) => s.items || []) || []),
    ]);
  }, [dsaSubjectDetail]);

  const {
    dsaBasicTotal,
    dsaBasicCompleted,
    dsaCoreTotal,
    dsaCoreCompleted,
    dsaProTotal,
    dsaProCompleted,
    dsaTotalCount,
    dsaCompletedCount,
  } = useMemo(() => {
    if (dsaItems.length > 0) {
      const isItemSolved = (item: any) =>
        item.progress?.status === "completed" ||
        (item.progress?.solveCount && item.progress.solveCount > 0) ||
        Boolean(item.solved);

      const basicItems = dsaItems.filter(
        (t) =>
          (t.difficulty || "").toLowerCase() === "easy" ||
          (t.difficulty || "").toLowerCase() === "basic"
      );
      const coreItems = dsaItems.filter(
        (t) =>
          (t.difficulty || "").toLowerCase() === "medium" ||
          (t.difficulty || "").toLowerCase() === "core"
      );
      const proItems = dsaItems.filter(
        (t) =>
          (t.difficulty || "").toLowerCase() === "hard" ||
          (t.difficulty || "").toLowerCase() === "pro"
      );

      const bTotal = basicItems.length || 214;
      const bSolved = basicItems.filter(isItemSolved).length;

      const cTotal = coreItems.length || 843;
      const cSolved = coreItems.filter(isItemSolved).length;

      const pTotal = proItems.length || 312;
      const pSolved = proItems.filter(isItemSolved).length;

      return {
        dsaBasicTotal: bTotal,
        dsaBasicCompleted: bSolved,
        dsaCoreTotal: cTotal,
        dsaCoreCompleted: cSolved,
        dsaProTotal: pTotal,
        dsaProCompleted: pSolved,
        dsaTotalCount: bTotal + cTotal + pTotal,
        dsaCompletedCount: bSolved + cSolved + pSolved,
      };
    }

    // Fallback based on plan tasks
    const dsaTasks = allTasks.filter((t) =>
      (t.item?.subjectSlug || "").toLowerCase().includes("dsa")
    );
    const isTaskSolved = (t: any) => t.status === "completed";

    const bTasks = dsaTasks.filter(
      (t) =>
        (t.item?.difficulty || "").toLowerCase() === "easy" ||
        (t.item?.difficulty || "").toLowerCase() === "basic"
    );
    const cTasks = dsaTasks.filter(
      (t) =>
        (t.item?.difficulty || "").toLowerCase() === "medium" ||
        (t.item?.difficulty || "").toLowerCase() === "core"
    );
    const pTasks = dsaTasks.filter(
      (t) =>
        (t.item?.difficulty || "").toLowerCase() === "hard" ||
        (t.item?.difficulty || "").toLowerCase() === "pro"
    );

    const bTotal = bTasks.length || 214;
    const bSolved = bTasks.filter(isTaskSolved).length;

    const cTotal = cTasks.length || 843;
    const cSolved = cTasks.filter(isTaskSolved).length;

    const pTotal = pTasks.length || 312;
    const pSolved = pTasks.filter(isTaskSolved).length;

    return {
      dsaBasicTotal: bTotal,
      dsaBasicCompleted: bSolved,
      dsaCoreTotal: cTotal,
      dsaCoreCompleted: cSolved,
      dsaProTotal: pTotal,
      dsaProCompleted: pSolved,
      dsaTotalCount: bTotal + cTotal + pTotal,
      dsaCompletedCount: bSolved + cSolved + pSolved,
    };
  }, [dsaItems, allTasks]);

  // Real Category-wise Progress from live database subjects (Strictly 4 subjects)
  const categories: CategoryProgress[] = useMemo(() => {
    const subjects = subjectsData || [];

    // 1. DSA
    const dsaSub = subjects.filter((s) => {
      const slug = (s.slug || "").toLowerCase();
      const name = (s.name || "").toLowerCase();
      return slug === "dsa" || slug.includes("algorithm") || name.includes("data structures");
    });
    const dsaSolved = dsaSub.reduce((acc, s) => acc + (s.totalSolved || 0), 0);
    const dsaTotal = dsaSub.reduce((acc, s) => acc + (s.totalItems || 0), 0) || 1007;

    // 2. System Design
    const sysSub = subjects.filter((s) => {
      const slug = (s.slug || "").toLowerCase();
      const name = (s.name || "").toLowerCase();
      return (
        slug.includes("system") ||
        slug.includes("lld") ||
        slug.includes("hld") ||
        slug.includes("design") ||
        name.includes("system")
      );
    });
    const sysSolved = sysSub.reduce((acc, s) => acc + (s.totalSolved || 0), 0);
    const sysTotal = sysSub.reduce((acc, s) => acc + (s.totalItems || 0), 0) || 104;

    // 3. Core Subjects
    const coreSub = subjects.filter((s) => {
      const slug = (s.slug || "").toLowerCase();
      const name = (s.name || "").toLowerCase();
      return (
        slug.includes("core") ||
        slug.includes("os") ||
        slug.includes("operat") ||
        slug.includes("netw") ||
        slug.includes("oops") ||
        name.includes("operating") ||
        name.includes("network")
      );
    });
    const coreSolved = coreSub.reduce((acc, s) => acc + (s.totalSolved || 0), 0);
    const coreTotal = coreSub.reduce((acc, s) => acc + (s.totalItems || 0), 0) || 944;

    // 4. Data Engineering
    const dataSub = subjects.filter((s) => {
      const slug = (s.slug || "").toLowerCase();
      const name = (s.name || "").toLowerCase();
      return (
        slug.includes("data-eng") ||
        slug.includes("dbms") ||
        slug.includes("sql") ||
        slug.includes("database") ||
        name.includes("data") ||
        name.includes("database")
      );
    });
    const dataSolved = dataSub.reduce((acc, s) => acc + (s.totalSolved || 0), 0);
    const dataTotal = dataSub.reduce((acc, s) => acc + (s.totalItems || 0), 0) || 324;

    return [
      {
        name: "DSA",
        count: `${dsaSolved}/${dsaTotal}`,
        percent: dsaTotal > 0 ? Math.round((dsaSolved / dsaTotal) * 100) : 0,
        icon: Code2,
        color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20",
        barColor: "bg-cyan-400",
        strokeColor: "#22d3ee",
        slug: "dsa",
        solved: dsaSolved,
        total: dsaTotal,
      },
      {
        name: "System Design",
        count: `${sysSolved}/${sysTotal}`,
        percent: sysTotal > 0 ? Math.round((sysSolved / sysTotal) * 100) : 0,
        icon: Code2,
        color: "text-amber-400 bg-amber-950/40 border-amber-500/20",
        barColor: "bg-amber-400",
        strokeColor: "#fbbf24",
        slug: "system-design",
        solved: sysSolved,
        total: sysTotal,
      },
      {
        name: "Core Subjects",
        count: `${coreSolved}/${coreTotal}`,
        percent: coreTotal > 0 ? Math.round((coreSolved / coreTotal) * 100) : 0,
        icon: Code2,
        color: "text-purple-400 bg-purple-950/40 border-purple-500/20",
        barColor: "bg-purple-400",
        strokeColor: "#c084fc",
        slug: "core-subjects",
        solved: coreSolved,
        total: coreTotal,
      },
      {
        name: "Data Engineering",
        count: `${dataSolved}/${dataTotal}`,
        percent: dataTotal > 0 ? Math.round((dataSolved / dataTotal) * 100) : 0,
        icon: Code2,
        color: "text-blue-400 bg-blue-950/40 border-blue-500/20",
        barColor: "bg-blue-400",
        strokeColor: "#60a5fa",
        slug: "data-engineering",
        solved: dataSolved,
        total: dataTotal,
      },
    ];
  }, [subjectsData]);

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
        isLoading={isAuthLoading}
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
            hasActivePlan={Boolean(plan?.hasPlan)}
          />

          {/* "Your Progress" Section */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-[16px] sm:text-[17px] font-bold tracking-tight text-white">
              <h2>Your Progress</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
              <ProgressDonut
                title="DSA Progress"
                completedTasks={dsaCompletedCount}
                totalTasks={dsaTotalCount}
                basicCompleted={dsaBasicCompleted}
                basicTotal={dsaBasicTotal}
                coreCompleted={dsaCoreCompleted}
                coreTotal={dsaCoreTotal}
                proCompleted={dsaProCompleted}
                proTotal={dsaProTotal}
                isLoading={isProgressLoading}
              />
              <SubjectProgressBar
                title="Category-wise Progress"
                categories={categories}
                isLoading={isProgressLoading}
              />
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
