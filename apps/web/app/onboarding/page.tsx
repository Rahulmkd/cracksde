"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  Calendar as CalendarIcon,
  Sparkles,
  Zap,
  Check,
  Plus,
  Clock,
  BookOpen,
  Layers,
  ArrowRight,
  Target,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useRoadmapSubjects } from "@/hooks/use-roadmap";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const store = useOnboardingStore();
  const { data: subjectsData } = useRoadmapSubjects();
  const { plan: studyPlan } = useStudyPlan("crack-sde");

  const [expandedReviewSubject, setExpandedReviewSubject] = useState<string>("dsa");
  const [expandedReviewTopic, setExpandedReviewTopic] = useState<string>("Arrays");

  // Step names for Stepper
  const stepNames = [
    { num: 1, title: "About You" },
    { num: 2, title: "Subjects" },
    { num: 3, title: "Levels" },
    { num: 4, title: "Review" },
    { num: 5, title: "Availability" },
    { num: 6, title: "Finalize" },
  ];

  // Step 1 options
  const roles = ["SDE Intern", "Software Engineer", "Senior SDE", "Engineering Lead"];
  const experiences = ["0 - 2 years", "2 - 5 years", "5+ years"];
  const companies = ["Startups", "FAANG / Big Tech", "Product Based Companies", "Open to all"];
  const regions = ["India", "US / Europe / Remote"];

  // Step 2 subjects
  const availableSubjects = [
    { slug: "dsa", name: "Data Structures & Algorithms", recommended: true },
    { slug: "dbms", name: "Database Management Systems", recommended: true },
    { slug: "operating-systems", name: "Operating Systems", recommended: true },
    { slug: "computer-networks", name: "Computer Networks", recommended: true },
  ];

  const additionalSubjects = [
    { slug: "oops", name: "Object Oriented Programming (OOPs)", recommended: true },
    { slug: "lld", name: "Low-Level Design (LLD)", recommended: false },
  ];

  // Dynamic hours & days calculations
  const totalWeeklyHours = store.getTotalWeeklyHours();
  const totalRoadmapHours = 270.8;
  const estimatedDays = Math.round((totalRoadmapHours / Math.max(1, totalWeeklyHours)) * 7);

  const handleNext = () => {
    if (store.currentStep === 6) {
      toast.success("🚀 Study Plan created and activated!");
      router.push("/planly");
    } else {
      store.nextStep();
    }
  };

  const handlePrev = () => {
    store.prevStep();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white select-none">
      {/* Top Header */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-800/80 px-4 sm:px-8 bg-zinc-950/85 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-zinc-100">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-[12px] shadow-sm shadow-blue-600/20">
              ⚡
            </span>
            <span>
              Planly <span className="text-zinc-500 font-normal text-[12px]">by</span> <span className="text-zinc-100 font-semibold">Crack SDE</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-zinc-400">
          <button
            onClick={() => {
              store.resetOnboarding();
              toast.info("Plan draft reset");
            }}
            className="hover:text-zinc-200 transition-colors"
          >
            Reset draft
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-[11px] font-medium"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Horizontal Interactive Stepper Bar */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 sm:p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            {stepNames.map((s, idx) => {
              const isCurrent = store.currentStep === s.num;
              const isCompleted = store.currentStep > s.num;

              return (
                <div
                  key={s.num}
                  className="flex items-center gap-2 flex-1 last:flex-none cursor-pointer"
                  onClick={() => {
                    if (s.num <= store.currentStep) {
                      store.setStep(s.num);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-semibold transition-colors",
                        isCurrent
                          ? "bg-blue-600 text-white ring-2 ring-blue-500/40"
                          : isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-500"
                      )}
                    >
                      {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : s.num}
                    </div>

                    <span
                      className={cn(
                        "text-[12px] font-medium hidden md:inline transition-colors",
                        isCurrent
                          ? "text-blue-400 font-semibold"
                          : isCompleted
                          ? "text-zinc-200"
                          : "text-zinc-500"
                      )}
                    >
                      {s.title}
                    </span>
                  </div>

                  {idx < stepNames.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 transition-colors hidden sm:block",
                        isCompleted ? "bg-emerald-500/40" : "bg-zinc-800"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: ABOUT YOU */}
        {/* ========================================================================= */}
        {store.currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
                About Your Goals &amp; Background
              </h1>
              <p className="text-[12px] font-normal leading-normal text-zinc-400">
                Let&apos;s personalize your preparation roadmap to match your target role and timeline.
              </p>
            </div>

            <div className="grid gap-5">
              {/* Question 1: Role */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-200 flex items-center gap-1.5">
                  1. Which role are you preparing for?<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((r) => {
                    const isSelected = store.targetRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => store.setTargetRole(r)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-all duration-150 select-none",
                          isSelected
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                        )}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Experience */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-200 flex items-center gap-1.5">
                  2. How much engineering experience do you have?<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {experiences.map((exp) => {
                    const isSelected = store.experience === exp;
                    return (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => store.setExperience(exp)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-all duration-150 select-none",
                          isSelected
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                        )}
                      >
                        {exp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Target Companies */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-200 flex items-center gap-1.5">
                  3. What kind of companies are you mainly targeting?<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {companies.map((comp) => {
                    const isSelected = store.targetCompany === comp;
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => store.setTargetCompany(comp)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-all duration-150 select-none",
                          isSelected
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                        )}
                      >
                        {comp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4: Target Region */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-200 flex items-center gap-1.5">
                  4. Which region are you preparing for?<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {regions.map((reg) => {
                    const isSelected = store.targetRegion === reg;
                    return (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => store.setTargetRegion(reg)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-all duration-150 select-none",
                          isSelected
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                        )}
                      >
                        {reg}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: RECOMMENDED SUBJECTS */}
        {/* ========================================================================= */}
        {store.currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
                Recommended Subjects
              </h1>
              <p className="text-[12px] font-normal leading-normal text-zinc-400">
                We selected key subjects based on your target role ({store.targetRole}). You can customize them freely.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="text-[12px] font-medium text-zinc-300">
                Core Recommended Track:
              </div>
              <div className="space-y-2">
                {availableSubjects.map((sub) => {
                  const isChecked = store.selectedSubjects.includes(sub.slug);
                  return (
                    <div
                      key={sub.slug}
                      onClick={() => store.toggleSubject(sub.slug)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all duration-150 shadow-subtle",
                        isChecked
                          ? "border-blue-500/40 bg-zinc-900/80 text-zinc-100 ring-1 ring-blue-500/20"
                          : "border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                            isChecked
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-zinc-700 bg-zinc-900"
                          )}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="text-[13px] font-medium text-zinc-200">{sub.name}</span>
                      </div>
                      {sub.recommended && (
                        <Badge variant="blue" className="text-[10px] py-0 px-2 font-medium">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Subjects */}
            <div className="space-y-2.5 pt-3.5 border-t border-zinc-800/80">
              <div className="text-[12px] font-medium text-zinc-300">Optional Electives:</div>
              <div className="flex flex-wrap gap-2">
                {additionalSubjects.map((sub) => {
                  const isChecked = store.selectedSubjects.includes(sub.slug);
                  return (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => store.toggleSubject(sub.slug)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all select-none",
                        isChecked
                          ? "border-blue-500 bg-blue-600/15 text-blue-400"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                      )}
                    >
                      <span>{sub.name}</span>
                      <Plus className={cn("h-3.5 w-3.5 transition-transform", isChecked && "rotate-45 text-blue-400")} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: STARTING LEVELS */}
        {/* ========================================================================= */}
        {store.currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
                Select Your Starting Level
              </h1>
              <p className="text-[12px] font-normal leading-normal text-zinc-400">
                Choose the preparation depth and baseline for each selected subject.
              </p>
            </div>

            <div className="space-y-6">
              {/* DSA Levels */}
              {store.selectedSubjects.includes("dsa") && (
                <div className="space-y-2.5">
                  <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Data Structures &amp; Algorithms</h3>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        level: "Start from zero",
                        desc: "I'm completely new to DSA and want to learn everything from the ground up.",
                      },
                      {
                        level: "DSA Foundations",
                        desc: "I know basic programming and want to build a strong foundation in DSA.",
                      },
                      {
                        level: "Pattern Mastery",
                        desc: "I've studied DSA before and want to master problem-solving patterns over 1-2 months.",
                      },
                      {
                        level: "Quick Revision",
                        desc: "I have 15-20 days and want focused high-frequency preparation for coding interviews.",
                      },
                    ].map((opt) => {
                      const isSelected = store.subjectLevels["dsa"] === opt.level;
                      return (
                        <div
                          key={opt.level}
                          onClick={() => store.setSubjectLevel("dsa", opt.level)}
                          className={cn(
                            "flex gap-2.5 rounded-xl border p-3.5 cursor-pointer transition-all shadow-subtle select-none",
                            isSelected
                              ? "border-blue-500 bg-blue-600/10 text-zinc-100 ring-1 ring-blue-500/20"
                              : "border-zinc-800/90 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/80"
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                              isSelected ? "border-blue-500 bg-blue-600" : "border-zinc-700 bg-zinc-900"
                            )}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-zinc-200">{opt.level}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 leading-normal">{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DBMS Levels */}
              {store.selectedSubjects.includes("dbms") && (
                <div className="space-y-2.5">
                  <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Database Management Systems</h3>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        level: "Learn in Depth",
                        desc: "Understand every core concept thoroughly, including indexing, B+ trees, and transactions.",
                      },
                      {
                        level: "Interview Preparation",
                        desc: "Quickly cover the most frequently asked interview topics, queries, and ACID properties.",
                      },
                    ].map((opt) => {
                      const isSelected = store.subjectLevels["dbms"] === opt.level;
                      return (
                        <div
                          key={opt.level}
                          onClick={() => store.setSubjectLevel("dbms", opt.level)}
                          className={cn(
                            "flex gap-2.5 rounded-xl border p-3.5 cursor-pointer transition-all shadow-subtle select-none",
                            isSelected
                              ? "border-blue-500 bg-blue-600/10 text-zinc-100 ring-1 ring-blue-500/20"
                              : "border-zinc-800/90 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/80"
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                              isSelected ? "border-blue-500 bg-blue-600" : "border-zinc-700 bg-zinc-900"
                            )}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-zinc-200">{opt.level}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 leading-normal">{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: REVIEW ROADMAP */}
        {/* ========================================================================= */}
        {store.currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
                Review Your Personalized Roadmap
              </h1>
              <p className="text-[12px] font-normal leading-normal text-zinc-400">
                Inspect the curriculum structure and estimated topic hours tailored for your sprint.
              </p>
            </div>

            {/* Planned Hours Banner */}
            <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-950/20 px-3.5 py-2.5 text-[12px] text-blue-300 shadow-subtle">
              <Zap className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span>
                We&apos;ve organized <strong className="text-blue-200 font-semibold font-mono">220.1 hours</strong> of structured learning across your selected tracks.
              </span>
            </div>

            {/* Tree Accordion */}
            <div className="space-y-2.5">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-subtle">
                <div
                  onClick={() =>
                    setExpandedReviewSubject((prev) => (prev === "dsa" ? "" : "dsa"))
                  }
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-zinc-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-2.5 text-[13px] font-medium text-zinc-200">
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
                        expandedReviewSubject === "dsa" ? "rotate-0" : "-rotate-90"
                      )}
                    />
                    <span>Data Structures &amp; Algorithms</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">Est. 66h</span>
                </div>

                {expandedReviewSubject === "dsa" && (
                  <div className="border-t border-zinc-800/80 bg-zinc-950/70 p-2.5 space-y-2">
                    <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
                      <div
                        onClick={() =>
                          setExpandedReviewTopic((prev) => (prev === "Arrays" ? "" : "Arrays"))
                        }
                        className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-zinc-900/80 transition-colors select-none"
                      >
                        <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-300">
                          <ChevronDown
                            className={cn(
                              "h-3 w-3 text-zinc-400 transition-transform duration-200",
                              expandedReviewTopic === "Arrays" ? "rotate-0" : "-rotate-90"
                            )}
                          />
                          <span>Arrays &amp; Strings Patterns</span>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-mono">308 min</span>
                      </div>

                      {expandedReviewTopic === "Arrays" && (
                        <div className="border-t border-zinc-800/60 bg-zinc-950 p-2.5 space-y-1.5 text-[11px]">
                          <div className="pl-2.5 space-y-1 border-l border-zinc-800">
                            {[
                              "Majority Element (Boyer-Moore)",
                              "Kadane's Algorithm (Max Subarray)",
                              "Two Pointers & Trapping Rain Water",
                              "Sliding Window (Max Consecutive Ones)",
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-0.5 text-zinc-300 text-[11px]"
                              >
                                <span>{item}</span>
                                <Badge variant="blue" className="text-[10px] py-0 px-1 font-medium">Core</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: WEEKLY AVAILABILITY */}
        {/* ========================================================================= */}
        {store.currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
                Weekly Study Availability
              </h1>
              <p className="text-[12px] font-normal leading-normal text-zinc-400">
                Set how many hours you can comfortably commit on each day of the week.
              </p>
            </div>

            {/* Availability Banner */}
            <div className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-950/20 px-3.5 py-2.5 text-[12px] text-blue-300 shadow-subtle">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>Adjust hours freely — sprint deadlines will calculate automatically.</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-blue-200">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Est. timeline: <strong className="text-white text-[13px] font-semibold font-mono">{estimatedDays} Days</strong></span>
              </div>
            </div>

            {/* Day Sliders */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3.5 shadow-subtle">
              {(
                [
                  { key: "monday", label: "Monday" },
                  { key: "tuesday", label: "Tuesday" },
                  { key: "wednesday", label: "Wednesday" },
                  { key: "thursday", label: "Thursday" },
                  { key: "friday", label: "Friday" },
                  { key: "saturday", label: "Saturday" },
                  { key: "sunday", label: "Sunday" },
                ] as const
              ).map((d) => {
                const hours = store.availability[d.key];
                return (
                  <div key={d.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 w-28 text-[12px] font-medium text-zinc-200">
                      <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{d.label}</span>
                    </div>

                    <div className="flex-1 max-w-lg">
                      <Slider
                        min={0}
                        max={12}
                        value={hours}
                        onChange={(val) => store.setDayAvailability(d.key, val)}
                      />
                    </div>

                    <div className="w-16 text-right text-[12px] font-semibold text-zinc-300 font-mono">
                      {hours} {hours === 1 ? "hr" : "hrs"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[12px] font-normal text-zinc-400">
              Allocated weekly commitment: <strong className="text-zinc-200 font-semibold font-mono">{totalWeeklyHours} hours/week</strong>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: FINALIZE PLAN */}
        {/* ========================================================================= */}
        {store.currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
                Finalize &amp; Launch Study Plan
              </h1>
              <p className="text-[12px] font-normal leading-normal text-zinc-400">
                Your customized 9-sprint roadmap is ready to activate.
              </p>
            </div>

            {/* Launch Summary Card */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-4 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
                <div>
                  <span className="text-[11px] font-mono text-blue-400 font-medium">CUSTOM ROADMAP</span>
                  <h3 className="text-[16px] font-semibold text-zinc-100 mt-0.5">{store.planName || "Crack SDE Master Sprint"}</h3>
                  <p className="text-[12px] text-zinc-400 font-normal">Target: {store.targetRole} &middot; {store.experience}</p>
                </div>
                <div className="text-left sm:text-right">
                  <Badge variant="blue" className="text-[11px] font-medium py-0.5 px-2">
                    Ready to Start
                  </Badge>
                </div>
              </div>

              {/* 5 KPI Metric Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-lg bg-zinc-950/60 p-3 border border-zinc-800/80 font-mono text-[11px]">
                <div>
                  <div className="text-zinc-500 font-sans">Sprints</div>
                  <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">9</div>
                </div>
                <div>
                  <div className="text-zinc-500 font-sans">Subjects</div>
                  <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">{store.selectedSubjects.length}</div>
                </div>
                <div>
                  <div className="text-zinc-500 font-sans">Curriculum</div>
                  <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">270h</div>
                </div>
                <div>
                  <div className="text-zinc-500 font-sans">Est. Days</div>
                  <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">{estimatedDays}d</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-zinc-500 font-sans">Weekly Goal</div>
                  <div className="text-[15px] font-semibold text-zinc-200 mt-0.5">{totalWeeklyHours}h</div>
                </div>
              </div>

              {/* Plan Name Input */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-zinc-200">Plan Name</label>
                <input
                  type="text"
                  maxLength={60}
                  value={store.planName}
                  onChange={(e) => store.setPlanName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:border-blue-500 focus:outline-none font-normal"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={store.currentStep === 1}
            className="h-8 px-3 text-[12px] font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <Button
            size="sm"
            onClick={handleNext}
            className="h-8 px-4 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {store.currentStep === 6 ? (
              <>
                <Zap className="h-3.5 w-3.5 mr-1" />
                Launch My Roadmap
              </>
            ) : (
              <>
                Next Step <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
