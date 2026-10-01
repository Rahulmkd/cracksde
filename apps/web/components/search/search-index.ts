import React from "react";
import {
  Code2,
  Database,
  Cpu,
  Network,
  Layers,
  BookOpen,
  FileText,
  ListTodo,
  FolderCode,
  HelpCircle,
  Wrench,
  GitBranch,
  Play,
  Sparkles,
  Compass,
  User,
  CheckCircle2,
  Bookmark,
  FileCode,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type SearchTab =
  | "All"
  | "Problems"
  | "Editorials"
  | "Notes"
  | "Lists"
  | "Blogs"
  | "Pages";

export type SearchCategory =
  | "Problems"
  | "Editorials"
  | "Notes"
  | "Lists"
  | "Blogs"
  | "Pages"
  | "Subjects"
  | "Topics"
  | "Spaces"
  | "Actions"
  | "Tools & Guides";

export interface SearchEntry {
  title: string;
  category: SearchCategory;
  tab: SearchTab | SearchTab[];
  href: string;
  description?: string;
  icon: React.ElementType;
  badge?: string;
  keywords?: string[];
}

export const allSearchEntries: SearchEntry[] = [
  // 1. Problems
  {
    title: "Two Sum — Optimal Hash Map Approach",
    category: "Problems",
    tab: "Problems",
    href: `${ROUTES.PRACTICE}?problem=two-sum`,
    description: "Array index pairing using one-pass hash map lookup",
    icon: Code2,
    badge: "Easy",
    keywords: [
      "two sum",
      "arrays",
      "hashmap",
      "two pointers",
      "problems",
      "practice",
    ],
  },
  {
    title: "Trapping Rain Water — Two Pointer & Monotonic Stack",
    category: "Problems",
    tab: "Problems",
    href: `${ROUTES.PRACTICE}?problem=trapping-rain-water`,
    description: "Calculate trapped elevation units in O(N) time O(1) space",
    icon: Code2,
    badge: "Hard",
    keywords: [
      "trapping rain water",
      "two pointer",
      "stack",
      "arrays",
      "problems",
    ],
  },
  {
    title: "LRU Cache — Double Linked List + Hash Map",
    category: "Problems",
    tab: "Problems",
    href: `${ROUTES.PRACTICE}?problem=lru-cache`,
    description: "Design constant time O(1) get and put cache eviction policy",
    icon: Code2,
    badge: "Medium",
    keywords: [
      "lru cache",
      "linked list",
      "hash map",
      "system design",
      "problems",
    ],
  },
  {
    title: "Median of Two Sorted Arrays — Binary Search Partition",
    category: "Problems",
    tab: "Problems",
    href: `${ROUTES.PRACTICE}?problem=median-sorted-arrays`,
    description: "Find median in O(log(min(N,M))) logarithmic time",
    icon: Code2,
    badge: "Hard",
    keywords: [
      "median",
      "binary search",
      "sorted arrays",
      "divide and conquer",
      "problems",
    ],
  },
  {
    title: "Course Schedule II — Kahn's Topological Sort",
    category: "Problems",
    tab: "Problems",
    href: `${ROUTES.PRACTICE}?problem=course-schedule`,
    description: "Detect cycles and order DAG prerequisite courses",
    icon: Code2,
    badge: "Medium",
    keywords: [
      "course schedule",
      "graph",
      "topological sort",
      "bfs",
      "dfs",
      "cycle detection",
    ],
  },
  {
    title: "Data Structures & Algorithms (DSA Practice Track)",
    category: "Problems",
    tab: "Problems",
    href: `${ROUTES.PRACTICE}?subject=dsa`,
    description: "Arrays, Trees, Graphs, DP, and pattern problem solving",
    icon: Code2,
    badge: "116h",
    keywords: [
      "dsa",
      "algorithms",
      "data structures",
      "leetcode",
      "trees",
      "graphs",
      "dp",
    ],
  },

  // 2. Editorials
  {
    title: "DP on Trees & Subtree Aggregations (Editorial)",
    category: "Editorials",
    tab: "Editorials",
    href: `${ROUTES.PRACTICE}?subject=dsa&topic=Dynamic-Programming`,
    description:
      "Detailed step-by-step state transitions for tree diameter and max path sum",
    icon: BookOpen,
    badge: "Editorial",
    keywords: [
      "dp on trees",
      "tree dp",
      "editorial",
      "solution",
      "explanation",
      "analysis",
    ],
  },
  {
    title: "Monotonic Stack Pattern & Range Queries (Editorial)",
    category: "Editorials",
    tab: "Editorials",
    href: `${ROUTES.PRACTICE}?subject=dsa&topic=Stacks`,
    description:
      "Next Greater Element, Largest Rectangle in Histogram, and sliding windows",
    icon: BookOpen,
    badge: "Editorial",
    keywords: [
      "monotonic stack",
      "editorial",
      "histogram",
      "stack",
      "solution",
    ],
  },
  {
    title: "B+ Tree Indexing & Transaction Isolation (Editorial)",
    category: "Editorials",
    tab: "Editorials",
    href: `${ROUTES.PRACTICE}?subject=dbms`,
    description:
      "Clustered index scans, 2PL, MVCC, and deadlocks in relational databases",
    icon: Database,
    badge: "Editorial",
    keywords: [
      "dbms",
      "b+ tree",
      "editorial",
      "indexing",
      "isolation",
      "acid",
      "mvcc",
    ],
  },
  {
    title: "TCP 3-Way Handshake & Congestion Control (Editorial)",
    category: "Editorials",
    tab: "Editorials",
    href: `${ROUTES.PRACTICE}?subject=computer-networks`,
    description: "SYN/ACK mechanics, TCP Reno, AIMD, and slow start phases",
    icon: Network,
    badge: "Editorial",
    keywords: [
      "tcp",
      "handshake",
      "networking",
      "editorial",
      "congestion control",
      "osi",
    ],
  },
  {
    title: "Virtual Memory Paging & TLB Misses (Editorial)",
    category: "Editorials",
    tab: "Editorials",
    href: `${ROUTES.PRACTICE}?subject=operating-systems`,
    description:
      "Page replacement algorithms, segmentation, page faults, and multi-level tables",
    icon: Cpu,
    badge: "Editorial",
    keywords: [
      "paging",
      "tlb",
      "virtual memory",
      "editorial",
      "os",
      "page faults",
    ],
  },

  // 3. Notes
  {
    title: "NoteSpace — Tech Cheatsheets & Personal Notes",
    category: "Notes",
    tab: "Notes",
    href: ROUTES.NOTES,
    description:
      "Rich text summaries, interview notes, formulas, and code snippets",
    icon: FileText,
    badge: "Cheatsheet",
    keywords: [
      "notes",
      "cheatsheets",
      "notespace",
      "editor",
      "summary",
      "quick revision",
    ],
  },
  {
    title: "Big-O Time & Space Complexity Cheatsheet",
    category: "Notes",
    tab: "Notes",
    href: ROUTES.TOOLS,
    description:
      "Quick complexity references for data structures, sorts, and graph traversals",
    icon: Wrench,
    badge: "Reference",
    keywords: [
      "big-o",
      "complexity",
      "time complexity",
      "space complexity",
      "notes",
    ],
  },
  {
    title: "OS Concurrency, Deadlocks & Semaphores Notes",
    category: "Notes",
    tab: "Notes",
    href: `${ROUTES.PRACTICE}?subject=operating-systems`,
    description:
      "Mutex, condition variables, Peterson's algorithm, Banker's safety check",
    icon: Cpu,
    badge: "Core CS",
    keywords: ["concurrency", "mutex", "deadlock", "semaphores", "notes", "os"],
  },
  {
    title: "SQL Query Optimization & Indexing Guide",
    category: "Notes",
    tab: "Notes",
    href: `${ROUTES.PRACTICE}?subject=dbms`,
    description:
      "EXPLAIN ANALYZE, composite indices, query planning, and sharding",
    icon: Database,
    badge: "Database",
    keywords: ["sql", "indexing", "query optimization", "dbms", "notes"],
  },

  {
    title: "Blind 75 Must-Do LeetCode Problems",
    category: "Lists",
    tab: "Lists",
    href: ROUTES.LISTS,
    description:
      "Essential 75 questions covering recurring coding interview patterns",
    icon: ListTodo,
    badge: "Curated",
    keywords: [
      "blind 75",
      "leetcode 75",
      "lists",
      "essential",
      "interview sheet",
    ],
  },
  {
    title: "Core CS 100 Engineering Interview Sheet",
    category: "Lists",
    tab: "Lists",
    href: ROUTES.LISTS,
    description:
      "High-frequency OS, DBMS, Networks, and LLD interview questions",
    icon: ListTodo,
    badge: "Core 100",
    keywords: [
      "core cs",
      "cs 100",
      "os",
      "dbms",
      "cn",
      "lists",
      "interview questions",
    ],
  },
  {
    title: "Top 100 Liked SDE Interview Questions",
    category: "Lists",
    tab: "Lists",
    href: ROUTES.LISTS,
    description:
      "Most requested problem sets across FAANG and top product firms",
    icon: ListTodo,
    badge: "Top 100",
    keywords: ["top 100", "faang", "google", "amazon", "meta", "lists"],
  },

  // 4. Blogs
  {
    title: "Engineering Masterclasses & Tech Blogs",
    category: "Blogs",
    tab: "Blogs",
    href: ROUTES.BLOGS,
    description:
      "Deep architecture guides, distributed systems, and algorithmic breakdowns",
    icon: BookOpen,
    badge: "Articles",
    keywords: [
      "blogs",
      "articles",
      "masterclasses",
      "system design blogs",
      "read",
    ],
  },
  {
    title: "Designing High-Throughput Distributed Rate Limiters",
    category: "Blogs",
    tab: "Blogs",
    href: ROUTES.BLOGS,
    description: "Token Bucket vs Leaky Bucket vs Sliding Window Logs in Redis",
    icon: Layers,
    badge: "System Design",
    keywords: [
      "rate limiter",
      "redis",
      "token bucket",
      "blogs",
      "system design",
      "articles",
    ],
  },
  {
    title: "How PostgreSQL Handles Multi-Version Concurrency (MVCC)",
    category: "Blogs",
    tab: "Blogs",
    href: ROUTES.BLOGS,
    description:
      "Tuple visibility, VACUUM daemon, WAL logs, and transaction snapshots",
    icon: Database,
    badge: "Deep Dive",
    keywords: ["postgres", "mvcc", "database", "vacuum", "wal", "blogs"],
  },

  // 5. Pages
  {
    title: "Planly — Sprint Planner & Roadmap",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.PLANLY,
    description:
      "Review your study sprint schedule, milestones, and daily problem goals",
    icon: GitBranch,
    badge: "Planner",
    keywords: [
      "planly",
      "sprints",
      "roadmap",
      "schedule",
      "planner",
      "tasks",
      "pages",
    ],
  },
  {
    title: "Prep Hub — Subject Mastery & Tracks",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.PREP_HUB,
    description:
      "Structured curriculum for DSA, DBMS, OS, CN, and System Design",
    icon: Compass,
    badge: "Curriculum",
    keywords: ["prep hub", "curriculum", "tracks", "subjects", "pages"],
  },
  {
    title: "Practice Arena — Coding Environment",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.PRACTICE,
    description:
      "Live interactive coding sandbox and problem test case evaluation",
    icon: Code2,
    badge: "Arena",
    keywords: ["practice", "coding", "sandbox", "arena", "problems", "pages"],
  },
  {
    title: "CodeSpace — Multi-Language Scratchpad",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.CODESPACE,
    description:
      "Instant sandbox execution for C++, Java, Python, and JavaScript",
    icon: FolderCode,
    badge: "Editor",
    keywords: [
      "codespace",
      "sandbox",
      "compiler",
      "scratchpad",
      "runner",
      "code",
      "pages",
    ],
  },
  {
    title: "Quiz Log — Curriculum & Question Manager",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.QUIZ_LOG,
    description: "Log quiz challenges and manage custom practice questions",
    icon: HelpCircle,
    badge: "Manager",
    keywords: [
      "quiz log",
      "questions",
      "custom question",
      "inventory",
      "pages",
    ],
  },
  {
    title: "Developer Tools — Bitwise & Cheatsheets",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.TOOLS,
    description: "Bitwise visualizers, Big-O tables, and developer utilities",
    icon: Wrench,
    badge: "Tools",
    keywords: ["tools", "developer tools", "bitwise", "utilities", "pages"],
  },
  {
    title: "Candidate Community & Discussions",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.COMMUNITY,
    description:
      "Recent company interview loops and candidate peer discussions",
    icon: Users,
    badge: "Community",
    keywords: ["community", "discussions", "interview experiences", "pages"],
  },
  {
    title: "My Profile & Career Settings",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.PROFILE,
    description:
      "Manage your developer profile, target role, bio, and study stats",
    icon: User,
    badge: "Profile",
    keywords: [
      "profile",
      "account",
      "settings",
      "bio",
      "headline",
      "stats",
      "pages",
    ],
  },
  {
    title: "Account & Preference Settings",
    category: "Pages",
    tab: "Pages",
    href: ROUTES.ACCOUNT,
    description: "Manage security, active sessions, and workspace preferences",
    icon: User,
    badge: "Settings",
    keywords: ["account", "security", "preferences", "settings", "pages"],
  },
];

export function searchCatalog(
  query: string,
  tab: SearchTab = "All",
  entries: SearchEntry[] = allSearchEntries,
): SearchEntry[] {
  let filtered = entries;

  // Filter by Tab
  if (tab !== "All") {
    filtered = filtered.filter((item) => {
      if (Array.isArray(item.tab)) {
        return item.tab.includes(tab);
      }
      return item.tab === tab;
    });
  }

  // Filter by Query
  if (!query || !query.trim()) {
    return filtered;
  }

  const q = query.trim().toLowerCase();
  return filtered.filter((item) => {
    if (item.title.toLowerCase().includes(q)) return true;
    if (item.category.toLowerCase().includes(q)) return true;
    if (item.description && item.description.toLowerCase().includes(q))
      return true;
    if (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q)))
      return true;
    return false;
  });
}
