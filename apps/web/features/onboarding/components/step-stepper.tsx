import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepStepperProps {
  currentStep: number;
  totalSteps: number;
  steps: { num: number; title: string }[];
  onSelectStep: (step: number) => void;
}

export function StepStepper({
  currentStep,
  steps,
  onSelectStep,
}: StepStepperProps) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-8 px-2 overflow-x-auto">
      {steps.map((s, idx) => {
        const isCompleted = currentStep > s.num;
        const isCurrent = currentStep === s.num;

        return (
          <React.Fragment key={s.num}>
            <button
              type="button"
              onClick={() => {
                if (s.num < currentStep) onSelectStep(s.num);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 shrink-0 transition-all cursor-pointer",
                s.num < currentStep ? "hover:opacity-80" : "cursor-default"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isCompleted
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : isCurrent
                    ? "bg-primary/20 border-2 border-primary text-primary shadow-xs ring-2 ring-primary/20"
                    : "bg-muted/50 border border-border/60 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium hidden sm:block",
                  isCurrent ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
            </button>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 min-w-[20px] transition-all",
                  isCompleted ? "bg-primary" : "bg-border/60"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
