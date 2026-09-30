"use client";

import React, { useState } from "react";
import { useProfile } from "../hooks/use-profile";
import type { ProfileTab } from "../types";
import { ProfileHeader } from "./profile-header";
import { ProfileStatsCard } from "./profile-stats-card";
import { ProfileSubjectProgress } from "./profile-subject-progress";
import { ProfileActivityList } from "./profile-activity-list";
import { ProfileEditForm } from "./profile-edit-form";
import { ProfileSkeleton } from "./profile-skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  History,
  Edit3,
  LogIn,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileOverview() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !data) {
    const isAuthError =
      error?.message?.toLowerCase().includes("auth") ||
      error?.message?.toLowerCase().includes("unauthorized") ||
      error?.message?.toLowerCase().includes("401");

    if (isAuthError) {
      return (
        <div className="max-w-2xl mx-auto my-12">
          <EmptyState
            icon={LogIn}
            title="Sign In to View Your Profile"
            description="You need to be logged into your CrackSDE account to view and customize your profile, learning stats, and study goals."
            actionLabel="Sign In Now"
            onAction={() => router.push("/login")}
          />
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto my-12">
        <ErrorState
          title="Could not load profile"
          message={error?.message || "An unexpected error occurred while loading your profile."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { profile, stats } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Profile Header Banner */}
      <ProfileHeader
        profile={profile}
        onEditClick={() => setActiveTab("edit")}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "curriculum"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Curriculum Breakdown
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "activity"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Solve History
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "edit"
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-amber-400 hover:bg-amber-500/10 gap-1.5"
          >
            <a href="/unlock">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Pro Plan Features
            </a>
          </Button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Study Metrics */}
          <ProfileStatsCard
            stats={stats}
            dailyGoalMinutes={profile.dailyGoalMinutes}
          />

          {/* 2-Column Layout for Subject Progress & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <ProfileSubjectProgress subjects={stats.subjectBreakdown} />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <ProfileActivityList activity={stats.recentActivity} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRICULUM PROGRESS */}
      {activeTab === "curriculum" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <ProfileSubjectProgress subjects={stats.subjectBreakdown} />
        </div>
      )}

      {/* TAB 3: SOLVE HISTORY */}
      {activeTab === "activity" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <ProfileActivityList activity={stats.recentActivity} />
        </div>
      )}

      {/* TAB 4: EDIT PROFILE */}
      {activeTab === "edit" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <ProfileEditForm
            profile={profile}
            onSuccess={() => {
              setActiveTab("overview");
            }}
            onCancel={() => setActiveTab("overview")}
          />
        </div>
      )}
    </div>
  );
}
