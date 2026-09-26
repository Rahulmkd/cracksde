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

  const [step6Phase, setStep6Phase] = useState<"preview" | "details" | "ready">("preview");
  const [expandedSprint, setExpandedSprint] = useState<string>("Sprint 1");
  const [expandedDay, setExpandedDay] = useState<string>("Day 1");
  const [expandedReviewSubject, setExpandedReviewSubject] = useState<string>("dsa");
  const [expandedReviewTopic, setExpandedReviewTopic] = useState<string>("Arrays");

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
  const estimatedDays = Math.round((totalRoadmapHours / totalWeeklyHours) * 7);

  const handleNext = () => {
    if (store.currentStep === 6) {
      if (step6Phase === "preview") {
        setStep6Phase("details");
      } else if (step6Phase === "details") {
        setStep6Phase("ready");
      } else {
        router.push("/dashboard");
      }
    } else {
      store.nextStep();
    }
  };

  const handlePrev = () => {
    if (store.currentStep === 6 && step6Phase === "details") {
      setStep6Phase("preview");
    } else if (store.currentStep === 6 && step6Phase === "ready") {
      setStep6Phase("details");
    } else {
      store.prevStep();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
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

        <div className="flex items-center gap-4 text-[13px] text-zinc-400">
          <button
            onClick={() => {
              store.resetOnboarding();
              toast.info("Plan draft reset");
            }}
            className="hover:text-zinc-200 transition-colors"
          >
            Discard plan
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-[12px] font-medium"
          >
            Close
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* ========================================================================= */}
        {/* STEP 1: ABOUT YOU */}
        {/* ========================================================================= */}
        {store.currentStep === 1 && (
          <div className="space-y-7 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 uppercase tracking-wider">
                <span>Step 1 of 6</span>
              </div>
              <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
                About You
              </h1>
              <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
                Let&apos;s personalize your preparation roadmap to match your target role and timeline.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Question 1: Role */}
              <div className="space-y-2.5">
                <label className="text-[13px] font-medium text-zinc-200 flex items-center gap-1.5">
                  1. Which role are you preparing for?<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {roles.map((r) => {
                    const isSelected = store.targetRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => store.setTargetRole(r)}
                        className={cn(
                          "rounded-lg px-3.5 py-2 text-[13px] font-medium border transition-all duration-150 select-none",
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
              <div className="space-y-2.5">
                <label className="text-[13px] font-medium text-zinc-200 flex items-center gap-1.5">
                  2. How much engineering experience do you have?<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {experiences.map((exp) => {
                    const isSelected = store.experience === exp;
                    return (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => store.setExperience(exp)}
                        className={cn(
                          "rounded-lg px-3.5 py-2 text-[13px] font-medium border transition-all duration-150 select-none",
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
              <div className="space-y-2.5">
                <label className="text-[13px] font-medium text-zinc-200 flex items-center gap-1.5">
                  3. What kind of companies are you mainly targeting?<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {companies.map((comp) => {
                    const isSelected = store.targetCompany === comp;
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => store.setTargetCompany(comp)}
                        className={cn(
                          "rounded-lg px-3.5 py-2 text-[13px] font-medium border transition-all duration-150 select-none",
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
              <div className="space-y-2.5">
                <label className="text-[13px] font-medium text-zinc-200 flex items-center gap-1.5">
                  4. Which region are you preparing for?<span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {regions.map((reg) => {
                    const isSelected = store.targetRegion === reg;
                    return (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => store.setTargetRegion(reg)}
                        className={cn(
                          "rounded-lg px-3.5 py-2 text-[13px] font-medium border transition-all duration-150 select-none",
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
          <div className="space-y-7 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 uppercase tracking-wider">
                <span>Step 2 of 6</span>
              </div>
              <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
                Recommended Subjects
              </h1>
              <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
                We selected the key subjects that matter most for your target. You can customize them however you like.
              </p>
            </div>

            {/* Core Selected Subjects */}
            <div className="space-y-3">
              <div className="text-[13px] font-medium text-zinc-300">
                Core Recommended Track:
              </div>
              <div className="space-y-2.5">
                {availableSubjects.map((sub) => {
                  const isChecked = store.selectedSubjects.includes(sub.slug);
                  return (
                    <div
                      key={sub.slug}
                      onClick={() => store.toggleSubject(sub.slug)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all duration-150 shadow-subtle",
                        isChecked
                          ? "border-zinc-700 bg-zinc-900/80 text-zinc-100"
                          : "border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
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
                        <span className="text-[14px] font-medium text-zinc-200">{sub.name}</span>
                      </div>
                      {sub.recommended && (
                        <Badge variant="blue" className="text-[11px] py-0 px-2 font-medium">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Additional Subjects */}
            <div className="space-y-3 pt-4 border-t border-zinc-800/80">
              <div className="text-[13px] font-medium text-zinc-300">Additional Optional Tracks:</div>
              <div className="flex flex-wrap gap-2.5">
                {additionalSubjects.map((sub) => {
                  const isChecked = store.selectedSubjects.includes(sub.slug);
                  return (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => store.toggleSubject(sub.slug)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-medium transition-all select-none",
                        isChecked
                          ? "border-blue-500 bg-blue-600/15 text-blue-400"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                      )}
                    >
                      <span>{sub.name}</span>
                      {sub.recommended && (
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[11px] font-medium text-blue-300">
                          Recommended
                        </span>
                      )}
                      <Plus className={cn("h-3.5 w-3.5 transition-transform", isChecked && "rotate-45 text-blue-400")} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: CURRENT LEVEL FOR EACH SUBJECT */}
        {/* ========================================================================= */}
        {store.currentStep === 3 && (
          <div className="space-y-7 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 uppercase tracking-wider">
                <span>Step 3 of 6</span>
              </div>
              <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
                Select Your Starting Level
              </h1>
              <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
                Choose the preparation depth and baseline for each selected subject.
              </p>
            </div>

            <div className="space-y-7">
              {/* DSA Levels */}
              {store.selectedSubjects.includes("dsa") && (
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400">Data Structures &amp; Algorithms</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
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
                            "flex gap-3 rounded-xl border p-4 cursor-pointer transition-all shadow-subtle select-none",
                            isSelected
                              ? "border-blue-500 bg-blue-600/10 text-zinc-100"
                              : "border-zinc-800/90 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/80"
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                              isSelected ? "border-blue-500 bg-blue-600" : "border-zinc-700 bg-zinc-900"
                            )}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-zinc-200">{opt.level}</div>
                            <div className="text-[12px] text-zinc-400 mt-1 leading-[1.4]">{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DBMS Levels */}
              {store.selectedSubjects.includes("dbms") && (
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400">Database Management Systems</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
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
                            "flex gap-3 rounded-xl border p-4 cursor-pointer transition-all shadow-subtle select-none",
                            isSelected
                              ? "border-blue-500 bg-blue-600/10 text-zinc-100"
                              : "border-zinc-800/90 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/80"
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                              isSelected ? "border-blue-500 bg-blue-600" : "border-zinc-700 bg-zinc-900"
                            )}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-zinc-200">{opt.level}</div>
                            <div className="text-[12px] text-zinc-400 mt-1 leading-[1.4]">{opt.desc}</div>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 uppercase tracking-wider">
                  <span>Step 4 of 6</span>
                </div>
                <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
                  Review Your Personalized Roadmap
                </h1>
                <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
                  Inspect the curriculum structure and estimated topic hours tailored for your sprint.
                </p>
              </div>
            </div>

            {/* Planned Hours Banner */}
            <div className="flex items-center gap-2.5 rounded-xl border border-blue-500/20 bg-blue-950/20 px-4 py-3 text-[13px] text-blue-300 shadow-subtle">
              <Zap className="h-4 w-4 text-blue-400 shrink-0" />
              <span>
                We&apos;ve organized <strong className="text-blue-200 font-semibold">220.1 hours</strong> of structured learning across your selected tracks.
              </span>
            </div>

            {/* Tree Accordion */}
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-subtle">
                <div
                  onClick={() =>
                    setExpandedReviewSubject((prev) => (prev === "dsa" ? "" : "dsa"))
                  }
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-3 text-[14px] font-medium text-zinc-200">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-zinc-400 transition-transform duration-200",
                        expandedReviewSubject === "dsa" ? "rotate-0" : "-rotate-90"
                      )}
                    />
                    <span>Data Structures &amp; Algorithms</span>
                  </div>
                  <span className="text-[12px] text-zinc-400 font-mono">Est. 66h</span>
                </div>

                {expandedReviewSubject === "dsa" && (
                  <div className="border-t border-zinc-800/80 bg-zinc-950/70 p-3 space-y-2">
                    <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
                      <div
                        onClick={() =>
                          setExpandedReviewTopic((prev) => (prev === "Arrays" ? "" : "Arrays"))
                        }
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-900/80 transition-colors select-none"
                      >
                        <div className="flex items-center gap-2.5 text-[13px] font-medium text-zinc-300">
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
                              expandedReviewTopic === "Arrays" ? "rotate-0" : "-rotate-90"
                            )}
                          />
                          <span>Arrays &amp; Strings Patterns</span>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-mono">308 min</span>
                      </div>

                      {expandedReviewTopic === "Arrays" && (
                        <div className="border-t border-zinc-800/60 bg-zinc-950 p-3 space-y-2 text-[12px]">
                          <div className="pl-3 space-y-1.5 border-l border-zinc-800">
                            {[
                              "Majority Element (Boyer-Moore)",
                              "Kadane's Algorithm (Max Subarray)",
                              "Two Pointers & Trapping Rain Water",
                              "Sliding Window (Max Consecutive Ones)",
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-1 text-zinc-300 text-[12px]"
                              >
                                <span>{item}</span>
                                <Badge variant="blue" className="text-[10px] py-0 px-1.5 font-medium">Core</Badge>
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
          <div className="space-y-7 animate-in fade-in-50 duration-200">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 uppercase tracking-wider">
                <span>Step 5 of 6</span>
              </div>
              <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
                Weekly Study Availability
              </h1>
              <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
                Set how many hours you can comfortably commit on each day of the week.
              </p>
            </div>

            {/* Availability Banner */}
            <div className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-950/20 px-4 py-3 text-[13px] text-blue-300 shadow-subtle">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Adjust hours freely — sprint deadlines will calculate automatically.</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-blue-200">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Est. days: <strong className="text-white text-[14px] font-semibold">{estimatedDays}</strong></span>
              </div>
            </div>

            {/* Day Sliders */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 shadow-subtle">
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
                  <div key={d.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 w-28 text-[13px] font-medium text-zinc-200">
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

                    <div className="w-16 text-right text-[13px] font-semibold text-zinc-300 font-mono">
                      {hours} {hours === 1 ? "hr" : "hrs"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[13px] font-normal text-zinc-400">
              Allocated weekly total: <strong className="text-zinc-200 font-semibold">{totalWeeklyHours} hours</strong>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: FINALISE PLAN */}
        {/* ========================================================================= */}
        {store.currentStep === 6 && (
          <div className="space-y-7 animate-in fade-in-50 duration-200">
            {/* Phase 6A: Sprint Preview */}
            {step6Phase === "preview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 uppercase tracking-wider">
                      <span>Step 6 of 6 &middot; Preview</span>
                    </div>
                    <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
                      Finalise Your Plan
                    </h1>
                    <p className="text-[13px] font-normal text-zinc-400">
                      Here is your 9-sprint roadmap preview.
                    </p>
                  </div>
                  <span className="text-[12px] font-mono text-zinc-500">9 Sprints Total</span>
                </div>

                <div className="space-y-3">
                  {[
                    { sprint: "Sprint 1", tags: "DSA + OOPS", time: "Est. 34h 47m" },
                    { sprint: "Sprint 2", tags: "DSA + OOPS", time: "Est. 32h 48m" },
                    { sprint: "Sprint 3", tags: "DSA + OOPS", time: "Est. 34h 46m" },
                    { sprint: "Sprint 4", tags: "DSA + Operating System", time: "Est. 35h 3m" },
                    { sprint: "Sprint 5", tags: "DSA + Operating System", time: "Est. 20h 53m" },
                    { sprint: "Sprint 6", tags: "Computer Networks + LLD", time: "Est. 34h 14m" },
                    { sprint: "Sprint 7", tags: "Computer Networks + LLD", time: "Est. 21h 2m" },
                    { sprint: "Sprint 8", tags: "DBMS", time: "Est. 34h 2m" },
                    { sprint: "Sprint 9", tags: "DBMS", time: "Est. 23h 18m" },
                  ].map((s) => {
                    const isExpanded = expandedSprint === s.sprint;
                    return (
                      <div
                        key={s.sprint}
                        className={cn(
                          "rounded-xl border transition-all duration-150 overflow-hidden shadow-subtle",
                          isExpanded
                            ? "border-blue-500/40 bg-zinc-900/60"
                            : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                        )}
                      >
                        <div
                          onClick={() =>
                            setExpandedSprint((prev) => (prev === s.sprint ? "" : s.sprint))
                          }
                          className="flex items-center justify-between p-3.5 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <Badge variant="blue" className="font-medium text-[12px]">
                              {s.sprint}
                            </Badge>
                            <span className="text-[13px] text-zinc-300 font-normal">• {s.tags}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-zinc-400">
                            <span className="font-mono text-[11px]">{s.time}</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isExpanded ? "rotate-0" : "-rotate-90"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Phase 6B: Plan Details */}
            {step6Phase === "details" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 uppercase tracking-wider">
                    <span>Step 6 of 6 &middot; Details</span>
                  </div>
                  <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
                    Plan Details &amp; Target Start Date
                  </h1>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-[12px] shadow-subtle">
                  <div>
                    <div className="text-zinc-500 flex items-center gap-1 text-[12px] font-medium">
                      <Layers className="h-3.5 w-3.5" /> Sprints
                    </div>
                    <div className="text-[18px] font-semibold text-zinc-100 mt-1 font-mono">9</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 flex items-center gap-1 text-[12px] font-medium">
                      <BookOpen className="h-3.5 w-3.5" /> Subjects
                    </div>
                    <div className="text-[18px] font-semibold text-zinc-100 mt-1 font-mono">6</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 flex items-center gap-1 text-[12px] font-medium">
                      <Clock className="h-3.5 w-3.5" /> Study hours
                    </div>
                    <div className="text-[18px] font-semibold text-zinc-100 mt-1 font-mono">270h 53m</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 flex items-center gap-1 text-[12px] font-medium">
                      <Target className="h-3.5 w-3.5" /> Duration
                    </div>
                    <div className="text-[18px] font-semibold text-zinc-100 mt-1 font-mono">61 days</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-zinc-500 flex items-center gap-1 text-[12px] font-medium">
                      <CalendarIcon className="h-3.5 w-3.5" /> Completion
                    </div>
                    <div className="text-[18px] font-semibold text-zinc-100 mt-1 font-mono">30 Nov 2026</div>
                  </div>
                </div>

                {/* Plan Name Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px] font-medium text-zinc-200">
                    <span>Plan Name<span className="text-red-400">*</span></span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {store.planName.length}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={60}
                    value={store.planName}
                    onChange={(e) => store.setPlanName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3.5 py-2 text-[14px] leading-[1.5] text-zinc-100 focus:border-blue-500 focus:outline-none font-normal"
                  />
                </div>

                {/* When do you want to start? */}
                <div className="space-y-2.5">
                  <label className="text-[13px] font-medium text-zinc-200 flex items-center gap-1.5">
                    When do you want to start?<span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2.5">
                    {[
                      { key: "today", label: "Today" },
                      { key: "tomorrow", label: "Tomorrow" },
                      { key: "custom", label: "Custom date" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => store.setStartDateOption(opt.key as "today" | "tomorrow" | "custom")}
                        className={cn(
                          "rounded-lg px-3.5 py-2 text-[13px] font-medium border transition-all select-none",
                          store.startDateOption === opt.key
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/40 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Phase 6C: Celebration Screen */}
            {step6Phase === "ready" && (
              <div className="py-8 text-center space-y-7 animate-in zoom-in-95 duration-200">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-3xl border border-blue-500/30 shadow-card">
                  🎉
                </div>

                <div className="space-y-1.5">
                  <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
                    Your Personal Roadmap Is Ready
                  </h1>
                  <p className="text-[13px] font-normal leading-[1.45] text-zinc-400 max-w-md mx-auto">
                    We&apos;ve structured a day-wise sprint plan matching your target role and weekly commitments.
                  </p>
                </div>

                {/* Plan Card */}
                <div className="max-w-xl mx-auto rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-left shadow-card space-y-5">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-semibold text-[16px] shadow-sm">
                      🎯
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold leading-[1.35] text-zinc-100">{store.planName}</h3>
                      <p className="text-[13px] font-normal text-zinc-400">Target: Software Engineer &middot; 61 Days</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800/80 text-[12px]">
                    <div>
                      <div className="text-zinc-500 flex items-center gap-1 font-medium text-[12px]">
                        <CalendarIcon className="h-3.5 w-3.5" /> Start date
                      </div>
                      <div className="text-[13px] font-semibold text-zinc-200 mt-1 font-mono">1 Oct 2026</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center gap-1 font-medium text-[12px]">
                        <CalendarIcon className="h-3.5 w-3.5" /> End date
                      </div>
                      <div className="text-[13px] font-semibold text-zinc-200 mt-1 font-mono">30 Nov 2026</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center gap-1 font-medium text-[12px]">
                        <Layers className="h-3.5 w-3.5" /> Sprints
                      </div>
                      <div className="text-[13px] font-semibold text-zinc-200 mt-1 font-mono">9 Sprints</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center gap-1 font-medium text-[12px]">
                        <Clock className="h-3.5 w-3.5" /> Duration
                      </div>
                      <div className="text-[13px] font-semibold text-zinc-200 mt-1 font-mono">271h</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium text-[14px] shadow-sm"
                  >
                    Go to Study Dashboard <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Wizard Action Bar */}
      {!(store.currentStep === 6 && step6Phase === "ready") && (
        <footer className="sticky bottom-0 z-40 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Progress Bar & Status */}
            <div className="flex items-center gap-3.5">
              <div className="w-24 sm:w-32">
                <Progress value={(store.currentStep / 6) * 100} className="h-1.5" />
              </div>
              <span className="text-[12px] text-zinc-400 font-normal">
                Step {store.currentStep} of 6 &middot; Draft saved
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5">
              {store.currentStep > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="h-8 px-3 text-[13px] font-medium"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleNext}
                className="h-8 px-4 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                {store.currentStep === 1 && (
                  <>Next <ChevronRight className="h-3.5 w-3.5 ml-1" /></>
                )}
                {store.currentStep === 2 && (
                  <>Continue with subjects <ChevronRight className="h-3.5 w-3.5 ml-1" /></>
                )}
                {store.currentStep === 3 && (
                  <>Confirm levels <ChevronRight className="h-3.5 w-3.5 ml-1" /></>
                )}
                {store.currentStep === 4 && (
                  <>Confirm content <ChevronRight className="h-3.5 w-3.5 ml-1" /></>
                )}
                {store.currentStep === 5 && (
                  <>Confirm availability <ChevronRight className="h-3.5 w-3.5 ml-1" /></>
                )}
                {store.currentStep === 6 && step6Phase === "preview" && (
                  <>Name my plan <ChevronRight className="h-3.5 w-3.5 ml-1" /></>
                )}
                {store.currentStep === 6 && step6Phase === "details" && (
                  <>Generate roadmap <ChevronRight className="h-3.5 w-3.5 ml-1" /></>
                )}
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
