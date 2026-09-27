import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Step3LevelsProps {
  selectedSubjects: string[];
  subjectLevels: Record<string, number>;
  onLevelChange: (subjectSlug: string, level: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Levels({
  selectedSubjects,
  subjectLevels,
  onLevelChange,
  onNext,
  onPrev,
}: Step3LevelsProps) {
  const levelLabels: Record<number, { label: string; desc: string; badge: string }> = {
    1: { label: "Basic Foundation", desc: "Core fundamental concepts and common standard problems", badge: "bg-emerald-500/10 text-emerald-400" },
    2: { label: "Core Interview Ready", desc: "In-depth problem patterns, optimizations, and deep dive design", badge: "bg-amber-500/10 text-amber-400" },
    3: { label: "Advanced Mastery", desc: "Hardest interview edge cases, distributed bottlenecks, concurrency", badge: "bg-purple-500/10 text-purple-400" },
  };

  const subjectNames: Record<string, string> = {
    dsa: "Data Structures & Algorithms",
    "system-design": "System Design",
    lld: "Low-Level Design",
    "operating-systems": "Operating Systems",
    dbms: "DBMS",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Set Track Depth Levels</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Tune how deep you want each track to go based on your target interview bar.
        </p>
      </div>

      <div className="space-y-4">
        {selectedSubjects.map((subSlug) => {
          const currentLvl = subjectLevels[subSlug] || 2;
          const info = levelLabels[currentLvl] || levelLabels[2];

          return (
            <div key={subSlug} className="p-4 rounded-2xl bg-card/50 border border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">{subjectNames[subSlug] || subSlug}</span>
                <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-md", info.badge)}>
                  Level {currentLvl}: {info.label}
                </span>
              </div>

              <Slider
                min={1}
                max={3}
                step={1}
                value={[currentLvl]}
                onValueChange={(val) => onLevelChange(subSlug, val[0])}
                className="py-1"
              />

              <p className="text-[11px] text-muted-foreground leading-relaxed">{info.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onPrev} className="text-xs">
          ← Back
        </Button>
        <Button size="sm" onClick={onNext} className="text-xs">
          Review Curriculum Breakdown →
        </Button>
      </div>
    </div>
  );
}
