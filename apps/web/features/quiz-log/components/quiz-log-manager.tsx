"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, Code2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoadmapSubjects, usePracticeProblems } from "@/hooks/use-roadmap";
import { CreateQuestionDialog } from "./create-question-dialog";
import { QuizInventoryTable } from "./quiz-inventory-table";

export function QuizLogManager() {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: subjects, isLoading: isSubjectsLoading } = useRoadmapSubjects();

  const {
    data: practiceData,
    isLoading: isProblemsLoading,
  } = usePracticeProblems({
    page,
    limit: pageSize,
    search: searchQuery,
    subject: selectedSubject,
    difficulty: selectedDifficulty,
  });

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

      {/* Inventory Table and Stats */}
      <QuizInventoryTable
        stats={stats}
        subjects={subjects}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        selectedSubject={selectedSubject}
        setSelectedSubject={(s) => {
          setSelectedSubject(s);
          setPage(1);
        }}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={(d) => {
          setSelectedDifficulty(d);
          setPage(1);
        }}
        problems={problems}
        isLoading={isProblemsLoading}
        pagination={pagination}
        onPageChange={setPage}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Add New Question Modal */}
      <CreateQuestionDialog
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        subjects={subjects}
        isSubjectsLoading={isSubjectsLoading}
      />
    </div>
  );
}
