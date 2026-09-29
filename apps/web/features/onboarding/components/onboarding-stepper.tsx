"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/constants/onboarding-options";

interface OnboardingStepperProps {
  currentStep: number;
  onStepClick: (stepNum: number) => void;
}

export function OnboardingStepper({ currentStep, onStepClick }: OnboardingStepperProps) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 sm:p-4 shadow-subtle">
      <div className="flex items-center justify-between">
        {ONBOARDING_STEPS.map((s, idx) => {
          const isCurrent = currentStep === s.num;
          const isCompleted = currentStep > s.num;

          return (
            <div
              key={s.num}
              className="flex items-center gap-2 flex-1 last:flex-none cursor-pointer"
              onClick={() => {
                if (s.num <= currentStep) {
                  onStepClick(s.num);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-semibold transition-colors",
                    isCurrent
                      ? "bg-blue-600 text-white ring-2 ring-blue-500/40"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-500"
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : s.num}
                </div>

                <span
                  className={cn(
                    "text-[12px] font-medium hidden md:inline transition-colors",
                    isCurrent
                      ? "text-blue-400 font-semibold"
                      : isCompleted
                      ? "text-zinc-200"
                      : "text-zinc-500"
                  )}
                >
                  {s.title}
                </span>
              </div>

              {idx < ONBOARDING_STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors hidden sm:block",
                    isCompleted ? "bg-emerald-500/40" : "bg-zinc-800"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
