"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CORE_SUBJECTS } from "@/constants/onboarding-options";

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
    <div className="space-y-7 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-zinc-100">
          Choose your subjects
        </h1>

        <p className="max-w-xl text-[13px] leading-5 text-zinc-400">
          Select the subjects you want to focus on for your{" "}
          <span className="font-medium text-zinc-200">{targetRole}</span>{" "}
          preparation.
        </p>
      </div>

      {/* Subject Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-medium text-zinc-200">
              Core subjects
            </h2>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Recommended for your selected role
            </p>
          </div>

          <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-[10px] font-medium text-zinc-400">
            {selectedSubjects.length}/{CORE_SUBJECTS.length} selected
          </span>
        </div>

        {/* Subjects */}
        <div className="grid gap-2">
          {CORE_SUBJECTS.map((sub) => {
            const isChecked = selectedSubjects.includes(sub.slug);

            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => onToggleSubject(sub.slug)}
                aria-pressed={isChecked}
                className={cn(
                  "group flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left",
                  "transition-all duration-150 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-blue-500/40",
                  isChecked
                    ? [
                        "border-blue-500/40",
                        "bg-blue-500/[0.07]",
                        "shadow-[0_0_0_1px_rgba(59,130,246,0.08)]",
                      ]
                    : [
                        "border-zinc-800/80",
                        "bg-zinc-900/30",
                        "hover:border-zinc-700",
                        "hover:bg-zinc-900/60",
                      ],
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {/* Checkbox */}
                  <span
                    className={cn(
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border",
                      "transition-all duration-150",
                      isChecked
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-zinc-700 bg-zinc-950 text-transparent group-hover:border-zinc-600",
                    )}
                  >
                    <Check
                      className={cn(
                        "h-3 w-3 stroke-[3]",
                        isChecked ? "scale-100" : "scale-75",
                        "transition-transform duration-150",
                      )}
                    />
                  </span>

                  {/* Subject */}
                  <span
                    className={cn(
                      "truncate text-[13px] font-medium transition-colors",
                      isChecked
                        ? "text-zinc-100"
                        : "text-zinc-300 group-hover:text-zinc-100",
                    )}
                  >
                    {sub.name}
                  </span>
                </div>

                {/* Selected Indicator */}
                {isChecked && (
                  <span className="ml-3 shrink-0 text-[10px] font-medium text-blue-400">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
