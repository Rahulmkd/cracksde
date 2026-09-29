"use client";

import React from "react";
import { Zap, Calendar as CalendarIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface StepAvailabilityProps {
  availability: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  onSetDayAvailability: (
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
    hours: number
  ) => void;
  totalWeeklyHours: number;
  estimatedDays: number;
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

export function StepAvailability({
  availability,
  onSetDayAvailability,
  totalWeeklyHours,
  estimatedDays,
}: StepAvailabilityProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div className="space-y-1">
        <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
          Weekly Study Availability
        </h1>
        <p className="text-[12px] font-normal leading-normal text-zinc-400">
          Set how many hours you can comfortably commit on each day of the week.
        </p>
      </div>

      {/* Availability Banner */}
      <div className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-950/20 px-3.5 py-2.5 text-[12px] text-blue-300 shadow-subtle">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          <span>Adjust hours freely — sprint deadlines will calculate automatically.</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-blue-200">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>
            Est. timeline:{" "}
            <strong className="text-white text-[13px] font-semibold font-mono">
              {estimatedDays} Days
            </strong>
          </span>
        </div>
      </div>

      {/* Day Sliders */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3.5 shadow-subtle">
        {DAYS_OF_WEEK.map((d) => {
          const hours = availability[d.key];
          return (
            <div key={d.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 w-28 text-[12px] font-medium text-zinc-200">
                <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
                <span>{d.label}</span>
              </div>

              <div className="flex-1 max-w-lg">
                <Slider
                  min={0}
                  max={12}
                  value={hours}
                  onChange={(val) => onSetDayAvailability(d.key, val)}
                />
              </div>

              <div className="w-16 text-right text-[12px] font-semibold text-zinc-300 font-mono">
                {hours} {hours === 1 ? "hr" : "hrs"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[12px] font-normal text-zinc-400">
        Allocated weekly commitment:{" "}
        <strong className="text-zinc-200 font-semibold font-mono">
          {totalWeeklyHours} hours/week
        </strong>
      </div>
    </div>
  );
}
