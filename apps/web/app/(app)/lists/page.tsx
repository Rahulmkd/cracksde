"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ListTodo,
  BookmarkPlus,
  Bookmark,
  ArrowRight,
  Plus,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SaveResourceModal } from "@/features/saved-resources/components/save-resource-modal";
import { SavedResourcesList } from "@/features/saved-resources/components/saved-resources-list";
import { SavedResourceCard } from "@/features/saved-resources/components/saved-resource-card";
import {
  useSavedResources,
  useDeleteSavedResource,
  useToggleBookmarkResource,
} from "@/features/saved-resources/hooks/use-saved-resources";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ListSheet {
  id: string;
  title: string;
  author: string;
  totalProblems: number;
  completedProblems: number;
  description: string;
  category: string;
  badge: string;
  topics: number;
}

export default function ListsPage() {
  const [activeTab, setActiveTab] = useState<string>("sheets");
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [bookmarkedSheetIds, setBookmarkedSheetIds] = useState<string[]>([]);

  const { data: savedResources } = useSavedResources();
  const deleteSavedMutation = useDeleteSavedResource();
  const toggleBookmarkMutation = useToggleBookmarkResource();

  // Load bookmarked problem sheet IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cracksde_bookmarked_sheets");
      if (stored) {
        setBookmarkedSheetIds(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const toggleSheetBookmark = (sheetId: string) => {
    setBookmarkedSheetIds((prev) => {
      const isBookmarked = prev.includes(sheetId);
      const next = isBookmarked ? prev.filter((id) => id !== sheetId) : [...prev, sheetId];
      try {
        localStorage.setItem("cracksde_bookmarked_sheets", JSON.stringify(next));
      } catch {
        // Ignore localStorage write errors
      }
      toast.success(isBookmarked ? "Removed bookmark" : "Bookmarked sheet", {
        duration: 1800,
      });
      return next;
    });
  };

  const sheets: ListSheet[] = [
    {
      id: "crack-sde-core",
      title: "Crack SDE Master Sheet",
      author: "Crack SDE Team",
      totalProblems: 847,
      completedProblems: 0,
      description: "Complete 9-sprint curated curriculum across DSA, DBMS, OS, Computer Networks, OOPS, and LLD.",
      category: "Full Curriculum",
      badge: "Flagship",
      topics: 16,
    },
    {
      id: "blind-75",
      title: "Blind 75 Essential Questions",
      author: "Curated Classic",
      totalProblems: 75,
      completedProblems: 0,
      description: "The classic 75 interview questions covering essential algorithmic patterns for tech interviews.",
      category: "DSA",
      badge: "High Frequency",
      topics: 8,
    },
    {
      id: "striver-sde",
      title: "Top 190 SDE Sheet",
      author: "Striver Curated",
      totalProblems: 191,
      completedProblems: 0,
      description: "Handpicked coding problems structured by topic: Arrays, Linked List, Recursion, Trees, DP, Graphs.",
      category: "DSA",
      badge: "Essential",
      topics: 12,
    },
    {
      id: "system-design-primer",
      title: "System Design & LLD Primer",
      author: "Crack SDE Architects",
      totalProblems: 32,
      completedProblems: 0,
      description: "SOLID principles, Design Patterns, Rate Limiter, TinyURL, Notification System, and Caching designs.",
      category: "System Design",
      badge: "Architecture",
      topics: 6,
    },
    {
      id: "core-cs-top-100",
      title: "Core CS 100 Quick Revise",
      author: "Interview Prep",
      totalProblems: 100,
      completedProblems: 0,
      description: "100 high-frequency questions on SQL indexing, Virtual Memory, Process Synchronization, and TCP/IP.",
      category: "Core CS",
      badge: "Rapid Revision",
      topics: 4,
    },
  ];

  // Bookmarked curated sheets
  const bookmarkedCuratedSheets = sheets.filter((sheet) =>
    bookmarkedSheetIds.includes(sheet.id)
  );

  // Bookmarked saved resources
  const bookmarkedSavedResources =
    savedResources?.filter((resource) => resource.isBookmarked) || [];

  const totalBookmarkedCount =
    bookmarkedCuratedSheets.length + bookmarkedSavedResources.length;

  const renderCuratedSheetCard = (sheet: ListSheet, isBookmarked: boolean, keyPrefix = "") => {
    const progress =
      sheet.totalProblems > 0
        ? Math.round((sheet.completedProblems / sheet.totalProblems) * 100)
        : 0;

    return (
      <div
        key={`${keyPrefix}${sheet.id}`}
        className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3.5 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col justify-between shadow-subtle"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="blue" className="text-[11px] font-medium py-0.5 px-2">
              {sheet.category}
            </Badge>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-mono">
                {sheet.topics} Topics
              </span>

              {/* Bookmark button - compact, dark theme, smooth transitions */}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSheetBookmark(sheet.id);
                }}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark sheet"}
                title={isBookmarked ? "Remove bookmark" : "Bookmark sheet"}
                className={cn(
                  "h-6.5 w-6.5 p-0 flex items-center justify-center rounded-md border transition-all duration-150 touch-manipulation active:scale-95",
                  isBookmarked
                    ? "bg-blue-950/40 border-blue-500/30 text-blue-400 hover:bg-blue-900/40 hover:border-blue-500/40 shadow-xs"
                    : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 hover:border-zinc-700/60"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-3.5 w-3.5 transition-colors duration-150",
                    isBookmarked ? "fill-blue-400 text-blue-400" : "text-current"
                  )}
                />
              </Button>
            </div>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-[14px] font-semibold leading-snug text-zinc-100 group-hover:text-blue-400 transition-colors">
              {sheet.title}
            </h3>
            <div className="text-[11px] text-zinc-500 font-normal">By {sheet.author}</div>
          </div>

          <p className="text-[12px] font-normal text-zinc-400 leading-normal line-clamp-2">
            {sheet.description}
          </p>
        </div>

        <div className="space-y-2.5 pt-2.5 border-t border-zinc-800/60">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 font-normal">Progress</span>
              <span className="text-zinc-300 font-mono font-medium">
                {sheet.completedProblems} / {sheet.totalProblems}
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full h-7 text-[12px] font-medium border-zinc-800 bg-zinc-900/80 group-hover:border-blue-500/40 group-hover:text-blue-400 touch-manipulation"
          >
            <Link href="/practice">
              <span>Open Sheet</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <ListTodo className="h-3 w-3 text-blue-400" />
            <span>Curated Lists & Resources</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            All Problem Sheets
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Structured problem sheets and personal saved resources to accelerate your software engineering interview preparation.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            onClick={() => setSaveModalOpen(true)}
            size="sm"
            className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 text-[12px] shadow-sm transition-all touch-manipulation"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Save Link</span>
          </Button>
        </div>
      </div>

      {/* Tabs / Filter Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <TabsList className="bg-zinc-900/60 border border-zinc-800 p-0.5 h-8">
            <TabsTrigger
              value="sheets"
              className="text-[12px] px-3 py-1 gap-1.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
            >
              <ListTodo className="h-3.5 w-3.5" />
              <span>Problem Sheets</span>
              <span className="ml-1 rounded-full bg-zinc-800/80 px-1.5 py-0.2 text-[10px] text-zinc-400 font-mono">
                {sheets.length}
              </span>
              {totalBookmarkedCount > 0 && (
                <span className="ml-0.5 flex h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
            </TabsTrigger>

            <TabsTrigger
              value="saved"
              className="text-[12px] px-3 py-1 gap-1.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>Saved Resources</span>
              {savedResources && savedResources.length > 0 && (
                <span className="ml-1 rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[10px] text-blue-400 font-mono">
                  {savedResources.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Problem Sheets (Includes Bookmarked Sheets Section) */}
        <TabsContent value="sheets" className="mt-0 space-y-6">
          {/* Section: Bookmarked Sheets */}
          {totalBookmarkedCount > 0 && (
            <div className="space-y-3.5 pb-6 border-b border-zinc-800/80 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Bookmark className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
                  </div>
                  <h2 className="text-[15px] font-semibold tracking-tight text-zinc-100">
                    Bookmarked Sheets
                  </h2>
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono text-blue-400 font-medium">
                    {totalBookmarkedCount}
                  </span>
                </div>
              </div>

              {/* Grid of bookmarked sheets (both curated sheets & saved resources) */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Bookmarked Curated Sheets */}
                {bookmarkedCuratedSheets.map((sheet) =>
                  renderCuratedSheetCard(sheet, true, "bookmarked-")
                )}

                {/* Bookmarked Saved Resources */}
                {bookmarkedSavedResources.map((resource) => (
                  <SavedResourceCard
                    key={`bookmarked-resource-${resource.id}`}
                    resource={resource}
                    onDelete={(id) => deleteSavedMutation.mutate(id)}
                    onToggleBookmark={(id, isBookmarked) =>
                      toggleBookmarkMutation.mutate({ id, isBookmarked })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section: All Problem Sheets */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-zinc-400" />
                <h2 className="text-[15px] font-semibold tracking-tight text-zinc-100">
                  All Problem Sheets
                </h2>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                {sheets.length} Available
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sheets.map((sheet) =>
                renderCuratedSheetCard(
                  sheet,
                  bookmarkedSheetIds.includes(sheet.id),
                  "all-"
                )
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Saved Resources */}
        <TabsContent value="saved" className="mt-0 space-y-4">
          <SavedResourcesList
            onOpenSaveModal={() => setSaveModalOpen(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Save Resource Modal */}
      <SaveResourceModal
        open={saveModalOpen}
        onOpenChange={(isOpen) => {
          setSaveModalOpen(isOpen);
          // If modal was closed after saving, activate the saved tab so the user sees the new card
          if (!isOpen) {
            setActiveTab("saved");
          }
        }}
      />
    </div>
  );
}
