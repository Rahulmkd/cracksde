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
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type SearchCategory = "Subjects" | "Topics" | "Spaces" | "Actions" | "Tools & Guides";

export interface SearchEntry {
  title: string;
  category: SearchCategory;
  href: string;
  description?: string;
  icon: React.ElementType;
  badge?: string;
  keywords?: string[];
}

export const allSearchEntries: SearchEntry[] = [
  // Core Subjects
  {
    title: "Data Structures & Algorithms (DSA)",
    category: "Subjects",
    href: `${ROUTES.PRACTICE}?subject=dsa`,
    description: "Arrays, Trees, Graphs, DP, and pattern problem solving",
    icon: Code2,
    badge: "116h",
    keywords: ["dsa", "algorithms", "data structures", "leetcode", "trees", "graphs", "dp"],
  },
  {
    title: "Database Management Systems (DBMS)",
    category: "Subjects",
    href: `${ROUTES.PRACTICE}?subject=dbms`,
    description: "SQL query optimization, ACID, B+ Trees, indexing",
    icon: Database,
    badge: "57h",
    keywords: ["dbms", "sql", "database", "acid", "indexing", "transactions", "b+ trees"],
  },
  {
    title: "Operating Systems (OS)",
    category: "Subjects",
    href: `${ROUTES.PRACTICE}?subject=operating-systems`,
    description: "Processes, Threads, Virtual Memory, Deadlocks, Mutex",
    icon: Cpu,
    badge: "24h",
    keywords: ["os", "operating systems", "threads", "processes", "deadlocks", "virtual memory", "paging"],
  },
  {
    title: "Computer Networks (CN)",
    category: "Subjects",
    href: `${ROUTES.PRACTICE}?subject=computer-networks`,
    description: "TCP/IP handshake, OSI Model, Sockets, HTTP/HTTPS",
    icon: Network,
    badge: "24h",
    keywords: ["cn", "networking", "tcp", "ip", "osi", "http", "https", "dns", "sockets"],
  },
  {
    title: "Low Level Design (LLD)",
    category: "Subjects",
    href: `${ROUTES.PRACTICE}?subject=system-design`,
    description: "SOLID principles, Design patterns, UML diagrams",
    icon: Layers,
    badge: "31h",
    keywords: ["lld", "system design", "solid", "design patterns", "uml", "rate limiter", "lru cache"],
  },
  {
    title: "Object-Oriented Programming (OOPS)",
    category: "Subjects",
    href: ROUTES.PREP_HUB,
    description: "Encapsulation, Polymorphism, Inheritance, C++/Java",
    icon: BookOpen,
    badge: "18h",
    keywords: ["oops", "oop", "polymorphism", "inheritance", "encapsulation", "classes", "abstraction"],
  },

  // Popular Topics
  {
    title: "Dynamic Programming Patterns",
    category: "Topics",
    href: `${ROUTES.PRACTICE}?subject=dsa&topic=Dynamic-Programming`,
    description: "0/1 Knapsack, Subsequences, Grid DP, Interval transitions",
    icon: Code2,
    keywords: ["dp", "knapsack", "subsequence", "grid dp", "memoization"],
  },
  {
    title: "Binary Trees & Graph BFS/DFS",
    category: "Topics",
    href: `${ROUTES.PRACTICE}?subject=dsa&topic=Trees-Graphs`,
    description: "Traversals, Dijkstra, Topological Sort, Disjoint Sets",
    icon: Code2,
    keywords: ["trees", "graphs", "bfs", "dfs", "dijkstra", "bst", "traversal"],
  },
  {
    title: "B+ Tree Indexing & Transaction Isolation",
    category: "Topics",
    href: `${ROUTES.PRACTICE}?subject=dbms`,
    description: "Clustered index scans, 2PL, MVCC, and deadlocks",
    icon: Database,
    keywords: ["indexing", "isolation", "acid", "mvcc", "2pl", "locking"],
  },
  {
    title: "Virtual Memory Paging & TLB Misses",
    category: "Topics",
    href: `${ROUTES.PRACTICE}?subject=operating-systems`,
    description: "Page replacement algorithms, segmentation, page faults",
    icon: Cpu,
    keywords: ["paging", "tlb", "virtual memory", "page faults", "segmentation"],
  },

  // My Spaces
  {
    title: "NoteSpace — Tech Cheatsheets & Notes",
    category: "Spaces",
    href: ROUTES.NOTES,
    description: "Rich text summaries, interview notes, and code snippets",
    icon: FileText,
    keywords: ["notes", "cheatsheets", "notespace", "editor", "summary"],
  },
  {
    title: "CodeSpace — Multi-Language Scratchpad",
    category: "Spaces",
    href: ROUTES.CODESPACE,
    description: "Instant sandbox execution for C++, Java, Python, JS",
    icon: FolderCode,
    keywords: ["codespace", "sandbox", "compiler", "scratchpad", "runner", "code"],
  },
  {
    title: "Quiz Log — Curriculum & Question Manager",
    category: "Spaces",
    href: ROUTES.QUIZ_LOG,
    description: "Add new coding problems and log quiz challenges",
    icon: HelpCircle,
    keywords: ["quiz log", "questions", "custom question", "inventory"],
  },
  {
    title: "All Problem Sheets & Curated Lists",
    category: "Spaces",
    href: ROUTES.LISTS,
    description: "Blind 75, Striver 190, Core CS 100 sheets",
    icon: ListTodo,
    keywords: ["lists", "blind 75", "striver", "sheets", "problem sets"],
  },

  // Actions
  {
    title: "Solve Problem of the Day (+20 pts)",
    category: "Actions",
    href: ROUTES.PRACTICE,
    description: "Daily challenge for algorithmic consistency",
    icon: Play,
    badge: "+20 pts",
    keywords: ["potd", "problem of the day", "daily challenge", "points"],
  },
  {
    title: "Planly — View Study Sprint Schedule",
    category: "Actions",
    href: ROUTES.PLANLY,
    description: "Review your 9-sprint roadmap and daily tasks",
    icon: GitBranch,
    keywords: ["planly", "sprints", "roadmap", "schedule", "planner", "tasks"],
  },
  {
    title: "Build / Personalize My Study Plan",
    category: "Actions",
    href: ROUTES.ONBOARDING,
    description: "Configure target role, pacing, and starting levels",
    icon: Sparkles,
    keywords: ["onboarding", "study plan", "create plan", "wizard", "personalize"],
  },

  // Tools & Guides
  {
    title: "Bitwise Operations Visualizer",
    category: "Tools & Guides",
    href: ROUTES.TOOLS,
    description: "Interactive bit arithmetic and binary converter",
    icon: Wrench,
    keywords: ["bitwise", "binary", "bits", "xor", "and", "or", "shift"],
  },
  {
    title: "Big-O Time & Space Complexity Cheatsheet",
    category: "Tools & Guides",
    href: ROUTES.TOOLS,
    description: "Quick complexity references for data structures",
    icon: Wrench,
    keywords: ["big-o", "complexity", "time complexity", "space complexity"],
  },
  {
    title: "Engineering Masterclasses & Tech Blogs",
    category: "Tools & Guides",
    href: ROUTES.BLOGS,
    description: "Deep architecture guides and algorithmic breakdowns",
    icon: BookOpen,
    keywords: ["blogs", "articles", "masterclasses", "system design blogs"],
  },
  {
    title: "Candidate Discussions & Network",
    category: "Tools & Guides",
    href: ROUTES.COMMUNITY,
    description: "Recent company interview experiences and loops",
    icon: Compass,
    keywords: ["community", "discussions", "interview experiences", "google", "amazon", "meta"],
  },
];

export function searchCatalog(query: string, entries: SearchEntry[] = allSearchEntries): SearchEntry[] {
  if (!query || !query.trim()) {
    return entries;
  }
  const q = query.trim().toLowerCase();
  return entries.filter((item) => {
    if (item.title.toLowerCase().includes(q)) return true;
    if (item.category.toLowerCase().includes(q)) return true;
    if (item.description && item.description.toLowerCase().includes(q)) return true;
    if (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q))) return true;
    return false;
  });
}
