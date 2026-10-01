"use client";

import React, { useState, useMemo } from "react";
import { FolderPlus, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRoadmapSubjectDetail, useCreateRoadmapItem } from "@/hooks/use-roadmap";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { RoadmapSubjectSummaryDto } from "@starter/shared";

interface CreateQuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: RoadmapSubjectSummaryDto[] | undefined;
  isSubjectsLoading: boolean;
}

export function CreateQuestionDialog({
  isOpen,
  onOpenChange,
  subjects,
  isSubjectsLoading,
}: CreateQuestionDialogProps) {
  const [formTitle, setFormTitle] = useState("");
  const [formSubjectId, setFormSubjectId] = useState<number | "">("");
  const [formSubjectSlug, setFormSubjectSlug] = useState<string>("");
  const [formTopicId, setFormTopicId] = useState<number | "">("");
  const [formSubtopicId, setFormSubtopicId] = useState<number | "">("");
  const [formDifficulty, setFormDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [formEstimatedMinutes, setFormEstimatedMinutes] = useState<number>(15);
  const [formType, setFormType] = useState<string>("Problem");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: subjectDetail, isLoading: isTopicsLoading } = useRoadmapSubjectDetail(formSubjectSlug);
  const createQuestionMutation = useCreateRoadmapItem();

  const availableTopics = useMemo(() => {
    if (!subjectDetail?.topics) return [];
    return subjectDetail.topics;
  }, [subjectDetail]);

  const availableSubtopics = useMemo(() => {
    if (!formTopicId || !availableTopics.length) return [];
    const matchedTopic = availableTopics.find((t) => t.id === Number(formTopicId));
    return matchedTopic?.subtopics || [];
  }, [formTopicId, availableTopics]);

  const handleSubjectChange = (newSubjectIdStr: string) => {
    const sId = Number(newSubjectIdStr);
    setFormSubjectId(sId);
    const foundSubject = subjects?.find((s) => s.id === sId);
    setFormSubjectSlug(foundSubject?.slug || "");
    setFormTopicId("");
    setFormSubtopicId("");
    setFormErrors((prev) => ({ ...prev, subjectId: "", topicId: "" }));
  };

  const handleTopicChange = (newTopicIdStr: string) => {
    const tId = Number(newTopicIdStr);
    setFormTopicId(tId);
    setFormSubtopicId("");
    setFormErrors((prev) => ({ ...prev, topicId: "" }));
  };

  const handleResetForm = () => {
    setFormTitle("");
    setFormSubjectId("");
    setFormSubjectSlug("");
    setFormTopicId("");
    setFormSubtopicId("");
    setFormDifficulty("Medium");
    setFormEstimatedMinutes(15);
    setFormType("Problem");
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formTitle.trim()) {
      errors.title = "Question title is required";
    } else if (formTitle.trim().length < 3) {
      errors.title = "Question title must be at least 3 characters";
    }

    if (!formSubjectId) {
      errors.subjectId = "Please select a Track / Subject";
    }

    if (!formTopicId) {
      errors.topicId = "Please select a Topic / Pattern";
    }

    if (!formEstimatedMinutes || formEstimatedMinutes <= 0) {
      errors.estimatedMinutes = "Estimated time must be greater than 0 minutes";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      const response = await createQuestionMutation.mutateAsync({
        title: formTitle.trim(),
        subjectId: Number(formSubjectId),
        topicId: Number(formTopicId),
        subtopicId: formSubtopicId ? Number(formSubtopicId) : null,
        difficulty: formDifficulty,
        estimatedMinutes: Number(formEstimatedMinutes),
        type: formType,
      });

      toast.success(response.message || "🎉 Question created successfully!");
      handleResetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create question. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col p-0 bg-zinc-950 border border-zinc-800 shadow-2xl rounded-xl overflow-hidden text-zinc-100">
        <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-zinc-800/80 mb-0 shrink-0 text-left">
          <div className="inline-flex items-center gap-1.5 text-blue-400 text-[11px] font-medium mb-1">
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Curriculum Database</span>
          </div>
          <DialogTitle className="text-[16px] font-semibold leading-snug text-zinc-100">
            Add New Question
          </DialogTitle>
          <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
            Persist a new problem or quiz question to the database. It will immediately appear in Practice Problems.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateQuestion} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Field 1: Question Title */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-zinc-200 flex items-center justify-between">
                <span>Question Title *</span>
                <span className="text-[10px] text-zinc-500 font-mono">e.g. Invert Binary Tree</span>
              </label>
              <input
                type="text"
                placeholder="Enter problem title..."
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: "" }));
                }}
                className={cn(
                  "w-full rounded-lg border bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-normal transition-colors",
                  formErrors.title
                    ? "border-red-500/80 focus:border-red-500"
                    : "border-zinc-800 focus:border-blue-500"
                )}
              />
              {formErrors.title && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {formErrors.title}
                </p>
              )}
            </div>

            {/* Field 2 & 3: Track / Subject & Topic / Pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-zinc-200">
                  Track / Subject *
                </label>
                <select
                  value={formSubjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none font-normal transition-colors",
                    formErrors.subjectId
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-zinc-800 focus:border-blue-500"
                  )}
                >
                  <option value="" disabled>
                    {isSubjectsLoading ? "Loading tracks..." : "Select Subject"}
                  </option>
                  {subjects?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {formErrors.subjectId && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.subjectId}
                  </p>
                )}
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-zinc-200">
                  Topic / Pattern *
                </label>
                <select
                  value={formTopicId}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  disabled={!formSubjectId || isTopicsLoading}
                  className={cn(
                    "w-full rounded-lg border bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    formErrors.topicId
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-zinc-800 focus:border-blue-500"
                  )}
                >
                  <option value="" disabled>
                    {!formSubjectId
                      ? "Select track first"
                      : isTopicsLoading
                      ? "Loading topics..."
                      : "Select Topic / Pattern"}
                  </option>
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {formErrors.topicId && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.topicId}
                  </p>
                )}
              </div>
            </div>

            {/* Field 4: Optional Subtopic (if available) */}
            {availableSubtopics.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-zinc-200 flex items-center justify-between">
                  <span>Subtopic / Category (Optional)</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Found {availableSubtopics.length} subtopics</span>
                </label>
                <select
                  value={formSubtopicId}
                  onChange={(e) => setFormSubtopicId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
                >
                  <option value="">None / Default</option>
                  {availableSubtopics.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Field 5 & 6: Difficulty & Estimated Minutes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-zinc-200">
                  Difficulty Level *
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setFormDifficulty(diff)}
                      className={cn(
                        "rounded-lg py-1 px-2 text-[11px] font-medium border text-center transition-all",
                        formDifficulty === diff
                          ? diff === "Easy"
                            ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-sm"
                            : diff === "Medium"
                            ? "bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-sm"
                            : "bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-sm"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Time */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-zinc-200 flex items-center justify-between">
                  <span>Estimated Time *</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{formEstimatedMinutes} mins</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={formEstimatedMinutes}
                    onChange={(e) => setFormEstimatedMinutes(Number(e.target.value))}
                    className="w-20 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-mono text-center"
                  />
                  <div className="flex items-center gap-1 flex-1">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setFormEstimatedMinutes(mins)}
                        className={cn(
                          "flex-1 rounded py-1 text-[10px] font-mono transition-colors",
                          formEstimatedMinutes === mins
                            ? "bg-blue-600/30 border border-blue-500/40 text-blue-300"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        )}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Field 7: Item Type */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-zinc-200">
                Item Classification
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: "Problem", label: "Practice Problem" },
                  { value: "Quiz", label: "Quiz Question" },
                  { value: "Concept", label: "Core Concept" },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFormType(t.value)}
                    className={cn(
                      "rounded-lg py-1 px-2 text-[11px] font-medium border text-center transition-all",
                      formType === t.value
                        ? "bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-sm"
                        : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 sm:px-6 border-t border-zinc-800/80 bg-zinc-950/80 mt-0 gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleResetForm();
                onOpenChange(false);
              }}
              className="h-8 px-3 text-[12px] font-medium border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createQuestionMutation.isPending}
              className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium shadow-sm"
            >
              {createQuestionMutation.isPending ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Question</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
