"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface StepFinalizeProps {
  planName: string;
  setPlanName: (name: string) => void;
  targetRole: string;
  experience: string;
  selectedSubjectsCount: number;
  totalWeeklyHours: number;
  estimatedDays: number;
}

export function StepFinalize({
  planName,
  setPlanName,
  targetRole,
  experience,
  selectedSubjectsCount,
  totalWeeklyHours,
  estimatedDays,
}: StepFinalizeProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-1">
        <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
          Finalize &amp; Launch Study Plan
        </h1>
        <p className="text-[12px] font-normal leading-normal text-zinc-400">
          Your customized 9-sprint roadmap is ready to activate.
        </p>
      </div>

      {/* Launch Summary Card */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
          <div>
            <span className="text-[11px] font-mono text-blue-400 font-medium">CUSTOM ROADMAP</span>
            <h3 className="text-[16px] font-semibold text-zinc-100 mt-0.5">
              {planName || "Crack SDE Master Sprint"}
            </h3>
            <p className="text-[12px] text-zinc-400 font-normal">
              Target: {targetRole} &middot; {experience}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <Badge variant="blue" className="text-[11px] font-medium py-0.5 px-2">
              Ready to Start
            </Badge>
          </div>
        </div>

        {/* 5 KPI Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-lg bg-zinc-950/60 p-3 border border-zinc-800/80 font-mono text-[11px]">
          <div>
            <div className="text-zinc-500 font-sans">Sprints</div>
            <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">9</div>
          </div>
          <div>
            <div className="text-zinc-500 font-sans">Subjects</div>
            <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">
              {selectedSubjectsCount}
            </div>
          </div>
          <div>
            <div className="text-zinc-500 font-sans">Curriculum</div>
            <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">270h</div>
          </div>
          <div>
            <div className="text-zinc-500 font-sans">Est. Days</div>
            <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">{estimatedDays}d</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-zinc-500 font-sans">Weekly Goal</div>
            <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">{totalWeeklyHours}h</div>
          </div>
        </div>

        {/* Plan Name Input */}
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-zinc-200">Plan Name</label>
          <input
            type="text"
            maxLength={60}
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:border-blue-500 focus:outline-none font-normal"
          />
        </div>
      </div>
    </div>
  );
}
