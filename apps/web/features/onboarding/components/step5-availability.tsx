import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Clock, Calendar } from "lucide-react";

interface Step5AvailabilityProps {
  dailyHours: number;
  onDailyHoursChange: (hours: number) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step5Availability({
  dailyHours,
  onDailyHoursChange,
  startDate,
  onStartDateChange,
  onNext,
  onPrev,
}: Step5AvailabilityProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Study Availability & Schedule</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Define your daily time investment and start date to generate sprint schedules.
        </p>
      </div>

      {/* Daily Hours Slider */}
      <div className="p-5 rounded-2xl bg-card/50 border border-border/60 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Daily Study Time
          </span>
          <span className="text-sm font-bold text-primary">{dailyHours} Hours / Day</span>
        </div>

        <Slider
          min={1}
          max={10}
          step={1}
          value={[dailyHours]}
          onValueChange={(val) => onDailyHoursChange(val[0])}
          className="py-1"
        />

        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>1 hour</span>
          <span>4 hours (Recommended)</span>
          <span>10 hours</span>
        </div>
      </div>

      {/* Start Date Picker */}
      <div className="p-5 rounded-2xl bg-card/50 border border-border/60 space-y-3">
        <label htmlFor="start-date" className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Kick-off Start Date
        </label>

        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full bg-background/50 border-border/70 text-xs"
        />

        <p className="text-[11px] text-muted-foreground">
          Your sprint calendar and daily catch-up milestones will anchor to this date.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onPrev} className="text-xs">
          ← Back
        </Button>
        <Button size="sm" onClick={onNext} className="text-xs">
          Finalize Roadmap →
        </Button>
      </div>
    </div>
  );
}
