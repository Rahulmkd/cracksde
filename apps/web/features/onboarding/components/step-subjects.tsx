"use client";

import React from "react";
import { Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CORE_SUBJECTS, ADDITIONAL_SUBJECTS } from "@/constants/onboarding-options";

interface StepSubjectsProps {
  targetRole: string;
  selectedSubjects: string[];
  onToggleSubject: (slug: string) => void;
}

export function StepSubjects({
  targetRole,
  selectedSubjects,
  onToggleSubject,
}: StepSubjectsProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-1">
        <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
          Recommended Subjects
        </h1>
        <p className="text-[12px] font-normal leading-normal text-zinc-400">
          We selected key subjects based on your target role ({targetRole}). You can customize them freely.
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="text-[12px] font-medium text-zinc-300">
          Core Recommended Track:
        </div>
        <div className="space-y-2">
          {CORE_SUBJECTS.map((sub) => {
            const isChecked = selectedSubjects.includes(sub.slug);
            return (
              <div
                key={sub.slug}
                onClick={() => onToggleSubject(sub.slug)}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all duration-150 shadow-subtle",
                  isChecked
                    ? "border-blue-500/40 bg-zinc-900/80 text-zinc-100 ring-1 ring-blue-500/20"
                    : "border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                      isChecked
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-zinc-700 bg-zinc-900"
                    )}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className="text-[13px] font-medium text-zinc-200">{sub.name}</span>
                </div>
                {sub.recommended && (
                  <Badge variant="blue" className="text-[10px] py-0 px-2 font-medium">
                    Recommended
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Subjects */}
      <div className="space-y-2.5 pt-3.5 border-t border-zinc-800/80">
        <div className="text-[12px] font-medium text-zinc-300">Optional Electives:</div>
        <div className="flex flex-wrap gap-2">
          {ADDITIONAL_SUBJECTS.map((sub) => {
            const isChecked = selectedSubjects.includes(sub.slug);
            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => onToggleSubject(sub.slug)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all select-none",
                  isChecked
                    ? "border-blue-500 bg-blue-600/15 text-blue-400"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                )}
              >
                <span>{sub.name}</span>
                <Plus className={cn("h-3.5 w-3.5 transition-transform", isChecked && "rotate-45 text-blue-400")} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
