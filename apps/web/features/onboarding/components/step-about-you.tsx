"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ONBOARDING_ROLES,
  ONBOARDING_EXPERIENCES,
  ONBOARDING_COMPANIES,
  ONBOARDING_REGIONS,
} from "@/constants/onboarding-options";

interface StepAboutYouProps {
  targetRole: string;
  setTargetRole: (role: string) => void;
  experience: string;
  setExperience: (exp: string) => void;
  targetCompany: string;
  setTargetCompany: (comp: string) => void;
  targetRegion: string;
  setTargetRegion: (reg: string) => void;
}

export function StepAboutYou({
  targetRole,
  setTargetRole,
  experience,
  setExperience,
  targetCompany,
  setTargetCompany,
  targetRegion,
  setTargetRegion,
}: StepAboutYouProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-1">
        <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
          About Your Goals &amp; Background
        </h1>
        <p className="text-[12px] font-normal leading-normal text-zinc-400">
          Let&apos;s personalize your preparation roadmap to match your target role and timeline.
        </p>
      </div>

      <div className="grid gap-5">
        {/* Question 1: Role */}
        <div className="space-y-2">
          <label className="text-[12px] font-medium text-zinc-200 flex items-center gap-1.5">
            1. Which role are you preparing for?<span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ONBOARDING_ROLES.map((r) => {
              const isSelected = targetRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTargetRole(r)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-all duration-150 select-none",
                    isSelected
                      ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2: Experience */}
        <div className="space-y-2">
          <label className="text-[12px] font-medium text-zinc-200 flex items-center gap-1.5">
            2. How much engineering experience do you have?<span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ONBOARDING_EXPERIENCES.map((exp) => {
              const isSelected = experience === exp;
              return (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-all duration-150 select-none",
                    isSelected
                      ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                  )}
                >
                  {exp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 3: Target Companies */}
        <div className="space-y-2">
          <label className="text-[12px] font-medium text-zinc-200 flex items-center gap-1.5">
            3. What kind of companies are you mainly targeting?<span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ONBOARDING_COMPANIES.map((comp) => {
              const isSelected = targetCompany === comp;
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setTargetCompany(comp)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-all duration-150 select-none",
                    isSelected
                      ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                  )}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 4: Target Region */}
        <div className="space-y-2">
          <label className="text-[12px] font-medium text-zinc-200 flex items-center gap-1.5">
            4. Which region are you preparing for?<span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ONBOARDING_REGIONS.map((reg) => {
              const isSelected = targetRegion === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setTargetRegion(reg)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-all duration-150 select-none",
                    isSelected
                      ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                  )}
                >
                  {reg}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
