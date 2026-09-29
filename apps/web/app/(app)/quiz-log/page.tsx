"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Code2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Layers,
  Check,
  AlertCircle,
  FolderPlus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useRoadmapSubjects,
  useRoadmapSubjectDetail,
  usePracticeProblems,
  useCreateRoadmapItem,
} from "@/hooks/use-roadmap";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function QuizLogPage() {
  // Filters & Pagination state for the questions list
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Modal State for "Add New Question"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSubjectId, setFormSubjectId] = useState<number | "">("");
  const [formSubjectSlug, setFormSubjectSlug] = useState<string>("");
  const [formTopicId, setFormTopicId] = useState<number | "">("");
  const [formSubtopicId, setFormSubtopicId] = useState<number | "">("");
  const [formDifficulty, setFormDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [formEstimatedMinutes, setFormEstimatedMinutes] = useState<number>(15);
  const [formType, setFormType] = useState<string>("Problem");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch subjects from database
  const { data: subjects, isLoading: isSubjectsLoading } = useRoadmapSubjects();

  // Fetch selected subject detail for dynamic topic dropdown in form
  const { data: subjectDetail, isLoading: isTopicsLoading } = useRoadmapSubjectDetail(formSubjectSlug);

  // Fetch paginated practice/curriculum questions from database
  const {
    data: practiceData,
    isLoading: isProblemsLoading,
    isError: isProblemsError,
  } = usePracticeProblems({
    page,
    limit: pageSize,
    search: searchQuery,
    subject: selectedSubject,
    difficulty: selectedDifficulty,
  });

  const createQuestionMutation = useCreateRoadmapItem();

  const problems = practiceData?.problems || [];
  const pagination = practiceData?.pagination || {
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
    hasMore: false,
  };
  const stats = practiceData?.stats || {
    totalProblems: 0,
    totalSolved: 0,
    totalDue: 0,
  };

  // Topics available for the selected form subject
  const availableTopics = useMemo(() => {
    if (!subjectDetail?.topics) return [];
    return subjectDetail.topics;
  }, [subjectDetail]);

  // Subtopics available for the selected topic
  const availableSubtopics = useMemo(() => {
    if (!formTopicId || !availableTopics.length) return [];
    const matchedTopic = availableTopics.find((t) => t.id === Number(formTopicId));
    return matchedTopic?.subtopics || [];
  }, [formTopicId, availableTopics]);

  // Handle subject change in form
  const handleSubjectChange = (newSubjectIdStr: string) => {
    const sId = Number(newSubjectIdStr);
    setFormSubjectId(sId);
    const foundSubject = subjects?.find((s) => s.id === sId);
    setFormSubjectSlug(foundSubject?.slug || "");
    setFormTopicId("");
    setFormSubtopicId("");
    setFormErrors((prev) => ({ ...prev, subjectId: "", topicId: "" }));
  };

  // Handle topic change in form
  const handleTopicChange = (newTopicIdStr: string) => {
    const tId = Number(newTopicIdStr);
    setFormTopicId(tId);
    setFormSubtopicId("");
    setFormErrors((prev) => ({ ...prev, topicId: "" }));
  };

  // Reset form
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

  // Validate form fields
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

  // Handle create question submit
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
      setIsAddModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create question. Please try again.");
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <HelpCircle className="h-3 w-3 text-blue-400" />
            <span>Curriculum Management</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            Quiz Log &amp; Question Bank
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Create, log, and organize interview problems and quiz challenges across all engineering tracks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="h-8 px-3 text-[12px] font-medium">
            <Link href="/practice">
              <Code2 className="h-3.5 w-3.5 mr-1.5 text-blue-400" /> Practice View
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add New Question
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-blue-400" /> Total Questions
          </span>
          <div className="text-[20px] font-bold text-zinc-100 font-mono">
            {stats.totalProblems}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Solved Questions
          </span>
          <div className="text-[20px] font-bold text-emerald-400 font-mono">
            {stats.totalSolved}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" /> Due for Revision
          </span>
          <div className="text-[20px] font-bold text-amber-400 font-mono">
            {stats.totalDue}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-1">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-purple-400" /> Active Tracks
          </span>
          <div className="text-[20px] font-bold text-purple-400 font-mono">
            {subjects?.length || 5}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search questions by title or topic..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5 text-[12px]">
          {/* Track Filters */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-zinc-500 text-[11px] font-medium mr-1">Track:</span>
            <button
              onClick={() => {
                setSelectedSubject("all");
                setPage(1);
              }}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                selectedSubject === "all"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200"
              )}
            >
              All
            </button>
            {subjects?.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSubject(s.slug);
                  setPage(1);
                }}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
                  selectedSubject === s.slug
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200"
                )}
              >
                {s.slug === "dsa"
                  ? "DSA"
                  : s.slug === "dbms"
                  ? "DBMS"
                  : s.slug === "operating-systems"
                  ? "OS"
                  : s.slug === "computer-networks"
                  ? "CN"
                  : s.name}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[11px]">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle">
        {isProblemsLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-[12px] text-zinc-400">Loading questions from database...</p>
          </div>
        ) : problems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HelpCircle className="h-8 w-8 text-zinc-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-[14px] font-semibold text-zinc-200">No questions found</h3>
              <p className="text-[12px] text-zinc-500 max-w-sm mx-auto">
                No questions match your filter criteria. Try changing your search or add a new question.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="h-7 px-3 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <Plus className="h-3 w-3 mr-1" /> Add New Question
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {problems.map((problem) => {
              const isSolved = problem.solved;
              const diffColor =
                problem.difficulty === "Easy"
                  ? "success"
                  : problem.difficulty === "Medium"
                  ? "warning"
                  : "destructive";

              return (
                <div
                  key={problem.id}
                  className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/70 transition-colors group"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono text-zinc-500 font-medium">
                        #{problem.itemNo}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 border-zinc-800 text-zinc-400">
                        {problem.subject}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] font-medium py-0 px-1.5 bg-zinc-800/60 text-zinc-300">
                        {problem.topic}
                      </Badge>
                      {problem.subtopic && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          • {problem.subtopic}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[13px] font-medium text-zinc-100 group-hover:text-blue-400 transition-colors leading-snug">
                      {problem.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      <span>{problem.estimatedMinutes}m</span>
                    </div>

                    <Badge variant={diffColor} className="text-[10px] font-medium py-0 px-1.5">
                      {problem.difficulty}
                    </Badge>

                    {isSolved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        <Check className="h-3 w-3" /> Solved
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-md">
                        Unsolved
                      </span>
                    )}

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      <Link href="/practice" title="View in Practice Mode">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-[12px] text-zinc-400">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-7 px-2 text-[11px]"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="h-7 px-2 text-[11px]"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* ADD NEW QUESTION MODAL / DIALOG */}
      {/* ======================================================================= */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-zinc-950 border-zinc-800">
          <DialogHeader className="pb-2 border-b border-zinc-800/80">
            <div className="inline-flex items-center gap-1.5 text-blue-400 text-[11px] font-medium mb-1">
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Curriculum Database</span>
            </div>
            <DialogTitle className="text-[16px] font-semibold leading-snug text-zinc-100">
              Add New Question
            </DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Persist a new problem or quiz question to the Prisma database. It will immediately appear in Practice Problems.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateQuestion} className="space-y-4 py-2">
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

            <DialogFooter className="pt-3 border-t border-zinc-800/80 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  handleResetForm();
                  setIsAddModalOpen(false);
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
    </div>
  );
}
