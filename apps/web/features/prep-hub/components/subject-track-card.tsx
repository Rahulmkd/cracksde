"use client";

import React from "react";
import { ChevronRight, AlertTriangle, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getSubjectTheme } from "@/constants/subject-theme-map";
import type { RoadmapSubjectSummaryDto } from "../types";

interface SubjectTrackCardProps {
  subject: RoadmapSubjectSummaryDto;
  onSelect: (slug: string) => void;
}

export function SubjectTrackCard({ subject, onSelect }: SubjectTrackCardProps) {
  const theme = getSubjectTheme(subject.slug);
  const Icon = theme.icon || Code2;

  return (
    <div
      onClick={() => onSelect(subject.slug)}
      className="group block rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 sm:p-4 hover:border-zinc-700/80 hover:bg-zinc-900/70 transition-all duration-200 shadow-subtle cursor-pointer select-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        {/* Left: Colored Icon + Subject Info */}
        <div className="flex items-start sm:items-center gap-3.5 overflow-hidden">
          <div
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border ${theme.iconBg} ${theme.iconBorder} ${theme.iconColor} shrink-0 transition-transform group-hover:scale-105 duration-200`}
          >
            <Icon className="h-5 w-5" />
          </div>

          {/* Subject Text Details */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                {subject.name}
              </h3>
              <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                &middot; {subject.estimatedHours}h
              </span>
              {subject.hasRevisionDue && (
                <Badge
                  variant="destructive"
                  className="text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1 font-mono rounded-md"
                >
                  <AlertTriangle className="h-2.5 w-2.5" />
                  <span>{subject.totalDue} Revision Due</span>
                </Badge>
              )}
            </div>
            <p className="text-[12px] font-normal leading-normal text-zinc-400 line-clamp-1 sm:line-clamp-2">
              {subject.description ||
                `Comprehensive track covering ${subject.totalTopics} modules and ${subject.totalItems} questions.`}
            </p>
          </div>
        </div>

        {/* Right: Stats Count + Chevron */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60 pl-2">
          <div className="flex items-center gap-3 text-[12px] text-zinc-400 font-mono">
            <div>
              <span className="font-semibold text-zinc-200">
                {subject.totalTopics}
              </span>{" "}
              <span className="text-zinc-500 text-[11px] font-sans">Topics</span>
            </div>
            <span className="text-zinc-700">&middot;</span>
            <div>
              <span className="font-semibold text-zinc-200">
                {subject.totalItems}
              </span>{" "}
              <span className="text-zinc-500 text-[11px] font-sans">Qs</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </div>
  );
}
