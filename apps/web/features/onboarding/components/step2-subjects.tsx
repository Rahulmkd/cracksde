import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Code2, Monitor, Layers, Database, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step2SubjectsProps {
  selectedSubjects: string[];
  onToggleSubject: (subjectSlug: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2Subjects({
  selectedSubjects,
  onToggleSubject,
  onNext,
  onPrev,
}: Step2SubjectsProps) {
  const availableSubjects = [
    { slug: "dsa", name: "Data Structures & Algorithms", desc: "Arrays, Trees, Graphs, DP, System Patterns", icon: Code2 },
    { slug: "system-design", name: "High-Level System Design", desc: "Scalability, Caching, Sharding, Microservices", icon: Monitor },
    { slug: "lld", name: "Low-Level Design & Architecture", desc: "OOP, Design Patterns, SOLID, Concurrency", icon: BookOpen },
    { slug: "operating-systems", name: "Operating Systems & Linux", desc: "Processes, Threads, Virtual Memory, I/O", icon: Layers },
    { slug: "dbms", name: "Database Management Systems", desc: "Indexing, Transactions, ACID, Normalization", icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Select Preparation Tracks</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Pick the core domains you want to cover in your personalized study plan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {availableSubjects.map((sub) => {
          const isSelected = selectedSubjects.includes(sub.slug);
          const Icon = sub.icon;

          return (
            <button
              key={sub.slug}
              type="button"
              onClick={() => onToggleSubject(sub.slug)}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5",
                isSelected
                  ? "bg-primary/10 border-primary/50 shadow-sm ring-1 ring-primary/30"
                  : "bg-card/50 hover:bg-card border-border/60 hover:border-border/90"
              )}
            >
              <div
                className={cn(
                  "p-2.5 rounded-xl shrink-0 mt-0.5",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">{sub.name}</h4>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{sub.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onPrev} className="text-xs">
          ← Back
        </Button>
        <Button
          size="sm"
          disabled={selectedSubjects.length === 0}
          onClick={onNext}
          className="text-xs"
        >
          Configure Depth Levels →
        </Button>
      </div>
    </div>
  );
}
