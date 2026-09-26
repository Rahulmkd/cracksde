"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ListTodo,
  CheckCircle2,
  ChevronRight,
  Flame,
  Star,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ListSheet {
  id: string;
  title: string;
  author: string;
  totalProblems: number;
  completedProblems: number;
  description: string;
  category: string;
  badge: string;
  topics: number;
}

export default function ListsPage() {
  const sheets: ListSheet[] = [
    {
      id: "crack-sde-core",
      title: "Crack SDE Master Sheet",
      author: "Crack SDE Team",
      totalProblems: 847,
      completedProblems: 0,
      description: "Complete 9-sprint curated curriculum across DSA, DBMS, OS, Computer Networks, OOPS, and LLD.",
      category: "Full Curriculum",
      badge: "Flagship",
      topics: 16,
    },
    {
      id: "blind-75",
      title: "Blind 75 Essential Questions",
      author: "Curated Classic",
      totalProblems: 75,
      completedProblems: 0,
      description: "The classic 75 interview questions covering essential algorithmic patterns for tech interviews.",
      category: "DSA",
      badge: "High Frequency",
      topics: 8,
    },
    {
      id: "striver-sde",
      title: "Top 190 SDE Sheet",
      author: "Striver Curated",
      totalProblems: 191,
      completedProblems: 0,
      description: "Handpicked coding problems structured by topic: Arrays, Linked List, Recursion, Trees, DP, Graphs.",
      category: "DSA",
      badge: "Essential",
      topics: 12,
    },
    {
      id: "system-design-primer",
      title: "System Design & LLD Primer",
      author: "Crack SDE Architects",
      totalProblems: 32,
      completedProblems: 0,
      description: "SOLID principles, Design Patterns, Rate Limiter, TinyURL, Notification System, and Caching designs.",
      category: "System Design",
      badge: "Architecture",
      topics: 6,
    },
    {
      id: "core-cs-top-100",
      title: "Core CS 100 Quick Revise",
      author: "Interview Prep",
      totalProblems: 100,
      completedProblems: 0,
      description: "100 high-frequency questions on SQL indexing, Virtual Memory, Process Synchronization, and TCP/IP.",
      category: "Core CS",
      badge: "Rapid Revision",
      topics: 4,
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[12px] font-medium text-zinc-300 uppercase tracking-wider">
            <ListTodo className="h-3.5 w-3.5 text-blue-400" />
            <span>Curated Lists</span>
          </div>
          <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
            All Problem Sheets
          </h1>
          <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
            Structured problem sheets and checklists designed by top engineers to help you crack technical rounds.
          </p>
        </div>
      </div>

      {/* Sheets Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sheets.map((sheet) => {
          const progress =
            sheet.totalProblems > 0
              ? Math.round((sheet.completedProblems / sheet.totalProblems) * 100)
              : 0;

          return (
            <div
              key={sheet.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col justify-between shadow-subtle"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" className="text-[12px] font-medium">
                    {sheet.category}
                  </Badge>
                  <span className="text-[12px] text-zinc-500">
                    {sheet.topics} Topics
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[16px] font-semibold leading-[1.35] text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {sheet.title}
                  </h3>
                  <div className="text-[12px] text-zinc-500 font-normal">By {sheet.author}</div>
                </div>

                <p className="text-[13px] font-normal text-zinc-400 leading-[1.45] line-clamp-2">
                  {sheet.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-800/60">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-zinc-400 font-normal">Progress:</span>
                    <span className="text-zinc-300 font-medium">
                      {sheet.completedProblems} / {sheet.totalProblems}
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full h-8 text-[13px] font-medium border-zinc-800 bg-zinc-900 group-hover:border-blue-500/40 group-hover:text-blue-400"
                >
                  <Link href="/practice">
                    <span>Open Sheet</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
