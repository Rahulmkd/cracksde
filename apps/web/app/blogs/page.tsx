"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ArticleItem {
  id: string;
  title: string;
  author: string;
  readTime: string;
  date: string;
  category: string;
  summary: string;
}

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const articles: ArticleItem[] = [
    {
      id: "art-1",
      title: "Mastering Monotonic Stack & Queue Patterns in Coding Interviews",
      author: "Crack SDE Editorial",
      readTime: "8 min read",
      date: "Sep 2026",
      category: "DSA Patterns",
      summary: "A definitive guide to solving Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram, and Sliding Window Maximum in linear time.",
    },
    {
      id: "art-2",
      title: "Deep Dive into PostgreSQL Indexes: B-Trees, GiST, GIN, and BRIN",
      author: "Database Team",
      readTime: "12 min read",
      date: "Sep 2026",
      category: "DBMS Internals",
      summary: "Understand how storage engines manage memory pages, write-ahead logs, and index scan strategies during high-concurrency read/write operations.",
    },
    {
      id: "art-3",
      title: "Designing Distributed Caching: Cache-Aside, Write-Through, and Cache Invalidation",
      author: "System Architecture Group",
      readTime: "15 min read",
      date: "Aug 2026",
      category: "System Design",
      summary: "Learn how Redis and Memcached cluster architectures handle cache stampedes, hotkeys, thundering herd problems, and strict consistency.",
    },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[12px] font-medium text-zinc-300 uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
            <span>Tech Blogs &amp; Articles</span>
          </div>
          <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
            Engineering Insights &amp; Guides
          </h1>
          <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
            Deep technical guides, system design breakdowns, and algorithmic masterclasses written by industry software engineers.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search articles by topic, keywords, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3.5 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col justify-between shadow-subtle"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="blue" className="text-[12px] font-medium">
                  {article.category}
                </Badge>
                <span className="text-[12px] text-zinc-500 flex items-center gap-1 font-normal">
                  <Clock className="h-3 w-3" /> {article.readTime}
                </span>
              </div>

              <h3 className="text-[16px] font-semibold leading-[1.35] text-zinc-100 group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>

              <p className="text-[13px] font-normal text-zinc-400 leading-[1.45] line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[12px]">
              <span className="text-[12px] text-zinc-500 font-normal">{article.date}</span>
              <span className="text-blue-400 group-hover:text-blue-300 font-medium flex items-center gap-1 text-[13px]">
                Read Article <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
