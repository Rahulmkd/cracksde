"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, BookOpen } from "lucide-react";
import { useRoadmapSubjectDetail } from "@/hooks/use-roadmap";
import type { RoadmapSubjectSummaryDto, CreateRoadmapItemRequest } from "@cracksde/shared";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: RoadmapSubjectSummaryDto[];
  onCreate: (payload: CreateRoadmapItemRequest) => void;
  isCreating?: boolean;
}

export function AddQuestionModal({
  isOpen,
  onClose,
  subjects,
  onCreate,
  isCreating = false,
}: AddQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>("");
  const [topicId, setTopicId] = useState<number | "">("");
  const [subtopicId, setSubtopicId] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [type, setType] = useState<string>("Problem");

  const { data: subjectDetail } = useRoadmapSubjectDetail(selectedSubjectSlug);

  const topics = subjectDetail?.topics || [];
  const selectedTopic = topics.find((t) => t.id === Number(topicId));
  const subtopics = selectedTopic?.subtopics || [];

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = Number(e.target.value);
    setSubjectId(sId || "");
    const sub = subjects.find((s) => s.id === sId);
    setSelectedSubjectSlug(sub?.slug || "");
    setTopicId("");
    setSubtopicId("");
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tId = Number(e.target.value);
    setTopicId(tId || "");
    setSubtopicId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId || !topicId) return;

    onCreate({
      title: title.trim(),
      subjectId: Number(subjectId),
      topicId: Number(topicId),
      subtopicId: subtopicId ? Number(subtopicId) : null,
      difficulty,
      estimatedMinutes,
      type,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Add New Curriculum Question
          </DialogTitle>
          <DialogDescription>
            Inject a custom question or problem into the knowledge tree.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
          <div>
            <label className="font-medium text-foreground block mb-1">Question Title *</label>
            <Input
              placeholder="e.g., Maximum Subarray Sum (Kadane's Algorithm)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-medium text-foreground block mb-1">Track / Subject *</label>
              <select
                value={subjectId}
                onChange={handleSubjectChange}
                required
                className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground"
              >
                <option value="">Select Track</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Topic / Pattern *</label>
              <select
                value={topicId}
                onChange={handleTopicChange}
                disabled={!subjectId}
                required
                className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground disabled:opacity-50"
              >
                <option value="">Select Topic</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {subtopics.length > 0 && (
            <div>
              <label className="font-medium text-foreground block mb-1">Subtopic (Optional)</label>
              <select
                value={subtopicId}
                onChange={(e) => setSubtopicId(Number(e.target.value) || "")}
                className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground"
              >
                <option value="">None / Direct Topic</option>
                {subtopics.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="font-medium text-foreground block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-background/50 border border-border/70 text-xs text-foreground"
              >
                <option value="Problem">Problem</option>
                <option value="Quiz">Quiz</option>
                <option value="Concept">Concept</option>
                <option value="Code">Code</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Est. Mins</label>
              <Input
                type="number"
                min={1}
                max={300}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!title.trim() || !subjectId || !topicId || isCreating}
            >
              {isCreating ? "Adding..." : "Add to Curriculum"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
