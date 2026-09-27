"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Clock,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { TopicAccordion } from "./topic-accordion";
import { getSubjectTheme } from "./subject-themes";
import { cn } from "@/lib/utils";
import type { RoadmapSubjectDetailDto, RoadmapItemDto } from "@cracksde/shared";

interface SubjectDetailViewProps {
  subject: RoadmapSubjectDetailDto;
  onBack: () => void;
  onOpenSolveDialog: (item: RoadmapItemDto) => void;
}

export function SubjectDetailView({
  subject,
  onBack,
  onOpenSolveDialog,
}: SubjectDetailViewProps) {
  const [search, setSearch] = useState("");
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(
    subject.topics?.[0]?.id || null
  );

  const theme = getSubjectTheme(subject.slug);
  const Icon = theme.icon;

  const totalQuestions = subject.topics.reduce((acc, t) => acc + (t.totalQuestions || 0), 0);
  const totalSolved = subject.totalSolved || 0;
  const totalDue = subject.totalDue || 0;
  const progressPercent = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  // Filter topics and their items by search
  const filteredTopics = useMemo(() => {
    if (!search.trim()) return subject.topics;
    const q = search.toLowerCase();

    return subject.topics
      .map((topic) => {
        const matchingItems = topic.items.filter(
          (it) =>
            it.title.toLowerCase().includes(q) ||
            (it.subtopicName && it.subtopicName.toLowerCase().includes(q))
        );
        const matchingSubtopics = topic.subtopics.map((s) => ({
          ...s,
          items: s.items.filter(
            (it) =>
              it.title.toLowerCase().includes(q) ||
              s.name.toLowerCase().includes(q)
          ),
        }));
        const topicNameMatch = topic.name.toLowerCase().includes(q);

        if (
          topicNameMatch ||
          matchingItems.length > 0 ||
          matchingSubtopics.some((s) => s.items.length > 0)
        ) {
          return {
            ...topic,
            items: topicNameMatch ? topic.items : matchingItems,
            subtopics: topicNameMatch ? topic.subtopics : matchingSubtopics,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof subject.topics;
  }, [subject.topics, search]);

  return (
    <div>
      {/* Back button & Subject Title Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 text-xs gap-1.5 text-muted-foreground hover:text-foreground pl-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Tracks
        </Button>

        <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={cn("p-3 rounded-2xl border", theme.iconBg, theme.iconBorder, theme.iconColor)}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{subject.name}</h1>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {subject.estimatedHours} Hours Curriculum
                  </span>
                  <span>•</span>
                  <span>{subject.topics.length} Topics</span>
                  <span>•</span>
                  <span>{totalQuestions} Total Problems</span>
                </p>
              </div>
            </div>

            {/* Stats Pill */}
            <div className="flex items-center gap-3">
              {totalDue > 0 && (
                <Badge variant="destructive" className="text-xs bg-rose-500/15 text-rose-400 border-rose-500/30 gap-1 py-1 px-3">
                  <AlertTriangle className="w-3 h-3" />
                  {totalDue} Due for Review
                </Badge>
              )}
              <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10 py-1 px-3">
                {totalSolved}/{totalQuestions} Solved ({progressPercent}%)
              </Badge>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Overall Track Progress</span>
              <span className="font-semibold text-foreground">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-muted/60" />
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="mb-6 relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
        <Input
          placeholder={`Search problems or patterns in ${subject.name}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card/40 border-border/60 text-xs h-10 rounded-xl"
        />
      </div>

      {/* Topic Accordions */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs">
            No topics or problems match "{search}".
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <TopicAccordion
              key={topic.id}
              topic={topic}
              isExpanded={expandedTopicId === topic.id}
              onToggleExpand={() =>
                setExpandedTopicId((prev) => (prev === topic.id ? null : topic.id))
              }
              onOpenSolveDialog={onOpenSolveDialog}
            />
          ))
        )}
      </div>
    </div>
  );
}
