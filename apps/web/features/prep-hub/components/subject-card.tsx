import React from "react";
import { ChevronRight, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getSubjectTheme } from "./subject-themes";
import { cn } from "@/lib/utils";
import type { RoadmapSubjectSummaryDto } from "@cracksde/shared";

interface SubjectCardProps {
  subject: RoadmapSubjectSummaryDto;
  onSelectSubject: (slug: string) => void;
}

export function SubjectCard({ subject, onSelectSubject }: SubjectCardProps) {
  const theme = getSubjectTheme(subject.slug);
  const Icon = theme.icon;

  const totalItems = subject.totalItems || 0;
  const totalSolved = subject.totalSolved || 0;
  const totalDue = subject.totalDue || 0;
  const progressPercent = totalItems > 0 ? Math.round((totalSolved / totalItems) * 100) : 0;

  return (
    <div
      onClick={() => onSelectSubject(subject.slug)}
      className="group relative bg-card/60 hover:bg-card/95 border border-border/60 hover:border-primary/40 rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Icon & Due Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2.5 rounded-xl border", theme.iconBg, theme.iconBorder, theme.iconColor)}>
            <Icon className="w-5 h-5" />
          </div>

          {subject.hasRevisionDue && (
            <Badge variant="destructive" className="text-[10px] gap-1 bg-rose-500/15 text-rose-400 border-rose-500/30">
              <AlertTriangle className="w-2.5 h-2.5" />
              {totalDue} Due for Review
            </Badge>
          )}
        </div>

        {/* Subject Title & Description */}
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
          <span>{subject.name}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </h3>

        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {subject.description || "Master core interview concepts, curated problems, and system architectures."}
        </p>
      </div>

      {/* Stats and Progress */}
      <div className="mt-5 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {subject.estimatedHours}h • {subject.totalTopics} Topics
          </span>
          <span className="font-semibold text-foreground">
            {totalSolved}/{totalItems} ({progressPercent}%)
          </span>
        </div>

        <Progress value={progressPercent} className="h-1.5 bg-muted/60" />
      </div>
    </div>
  );
}
