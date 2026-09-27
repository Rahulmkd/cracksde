"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ChevronDown, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step4ReviewProps {
  selectedSubjects: string[];
  onNext: () => void;
  onPrev: () => void;
}

export function Step4Review({
  selectedSubjects,
  onNext,
  onPrev,
}: Step4ReviewProps) {
  const [expandedSub, setExpandedSub] = useState<string>(selectedSubjects[0] || "dsa");

  const subjectBreakdowns: Record<string, { title: string; hours: number; topics: string[] }> = {
    dsa: {
      title: "Data Structures & Algorithms",
      hours: 45,
      topics: ["Arrays & Dynamic Arrays", "Two Pointers & Sliding Window", "Hash Maps & Sets", "Linked Lists & Fast/Slow", "Binary Trees & BSTs", "Graphs, BFS/DFS, Dijkstra", "Dynamic Programming & Memoization"],
    },
    "system-design": {
      title: "High-Level System Design",
      hours: 30,
      topics: ["Scalability Fundamentals", "Load Balancing & Reverse Proxies", "Caching Strategies (Redis/Memcached)", "Database Sharding & Replication", "Message Queues & Async Processing", "Distributed Rate Limiter Design", "URL Shortener & Feed Architecture"],
    },
    lld: {
      title: "Low-Level Design & OOP",
      hours: 25,
      topics: ["SOLID Principles in Practice", "Creational Patterns (Factory, Builder)", "Structural Patterns (Adapter, Decorator)", "Behavioral Patterns (Strategy, Observer)", "Parking Lot System Design", "Elevator System OOP Model"],
    },
    "operating-systems": {
      title: "Operating Systems",
      hours: 20,
      topics: ["Processes vs. Threads", "CPU Scheduling Algorithms", "Deadlock Prevention & Recovery", "Virtual Memory & Paging", "File Systems & Page Cache"],
    },
    dbms: {
      title: "Database Management Systems",
      hours: 20,
      topics: ["B+ Tree Indexing & Hash Indexes", "ACID Transactions & Isolation Levels", "SQL Query Optimization & EXPLAIN", "Write-Ahead Logging (WAL)", "NoSQL Trade-offs (CAP Theorem)"],
    },
  };

  const totalEstimatedHours = selectedSubjects.reduce(
    (acc, sub) => acc + (subjectBreakdowns[sub]?.hours || 20),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Curriculum Review</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Review your tailored syllabus before configuring your calendar schedule.
          </p>
        </div>
        <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10 px-3 py-1">
          ~{totalEstimatedHours} Total Hours
        </Badge>
      </div>

      <div className="space-y-3">
        {selectedSubjects.map((subSlug) => {
          const info = subjectBreakdowns[subSlug] || { title: subSlug, hours: 20, topics: ["Core Concepts"] };
          const isExpanded = expandedSub === subSlug;

          return (
            <div
              key={subSlug}
              className={cn(
                "rounded-2xl border transition-all overflow-hidden",
                isExpanded ? "bg-card/90 border-primary/40" : "bg-card/40 border-border/50"
              )}
            >
              <button
                type="button"
                onClick={() => setExpandedSub((prev) => (prev === subSlug ? "" : subSlug))}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/15 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-foreground">{info.title}</span>
                  <span className="text-xs text-muted-foreground">({info.hours}h)</span>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-border/30 bg-background/20 space-y-1.5">
                  {info.topics.map((t, idx) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                      <span className="w-4 text-[10px] text-muted-foreground/60 font-mono">{idx + 1}.</span>
                      <span className="text-foreground">{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onPrev} className="text-xs">
          ← Back
        </Button>
        <Button size="sm" onClick={onNext} className="text-xs">
          Set Availability & Dates →
        </Button>
      </div>
    </div>
  );
}
