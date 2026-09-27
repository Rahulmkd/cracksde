import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, Calendar, Target, Layers } from "lucide-react";

interface Step6FinalizeProps {
  role: string;
  experience: string;
  selectedSubjects: string[];
  dailyHours: number;
  startDate: string;
  onConfirm: () => void;
  onPrev: () => void;
  isGenerating?: boolean;
}

export function Step6Finalize({
  role,
  experience,
  selectedSubjects,
  dailyHours,
  startDate,
  onConfirm,
  onPrev,
  isGenerating = false,
}: Step6FinalizeProps) {
  const formattedStart = startDate
    ? new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Immediate";

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your Plan is Ready!</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          We have generated an optimized sprint timeline calibrated to your target role and study availability.
        </p>
      </div>

      {/* Summary Recap Card */}
      <div className="p-5 rounded-2xl bg-card/60 border border-border/60 divide-y divide-border/40 text-xs">
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Target Role
          </span>
          <span className="font-semibold text-foreground">{role} ({experience})</span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" /> Tracks Included
          </span>
          <span className="font-semibold text-foreground">{selectedSubjects.length} Selected Tracks</span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Kick-off Date & Pace
          </span>
          <span className="font-semibold text-foreground">{formattedStart} • {dailyHours}h / day</span>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onPrev} className="text-xs">
          ← Back
        </Button>
        <Button
          size="sm"
          disabled={isGenerating}
          onClick={onConfirm}
          className="gap-2 text-xs font-semibold px-6 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isGenerating ? "Building Workspace..." : "Launch Crack SDE Workspace 🚀"}
        </Button>
      </div>
    </div>
  );
}
