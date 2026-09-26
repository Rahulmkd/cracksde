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
  const roles = ["SDE Intern", "Software Engineer"];
  const experiences = ["0 - 2 years", "2 - 5 years", "5+ years"];
  const companies = ["Startups", "FAANG", "All Product Based Companies", "Open to all"];
  const regions = ["India", "US/Europe/Others"];

  // Step 2 subjects
  const availableSubjects = [
    { slug: "dsa", name: "DSA", recommended: true },
    { slug: "dbms", name: "DBMS", recommended: true },
    { slug: "operating-systems", name: "Operating Systems", recommended: true },
    { slug: "computer-networks", name: "Computer Networks", recommended: true },
  ];

  const additionalSubjects = [
    { slug: "oops", name: "OOPs", recommended: true },
    { slug: "lld", name: "LLD", recommended: false },
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
      <header className="flex h-14 items-center justify-between border-b border-zinc-800/80 px-4 sm:px-8 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-sm tracking-tight text-zinc-100">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white font-bold text-xs">⚡</span>
            <span>Planly <span className="text-zinc-500 font-normal text-xs">by</span> <span className="text-zinc-100 font-semibold">Crack SDE</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <button
            onClick={() => {
              store.resetOnboarding();
              toast.info("Plan draft reset");
            }}
            className="hover:text-zinc-200 transition-colors"
          >
            Discard my plan
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {/* ========================================================================= */}
        {/* STEP 1: ABOUT YOU */}
        {/* ========================================================================= */}
        {store.currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                About you
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                Let&apos;s personalize your preparation plan to match your target goals and schedule.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Question 1: Role */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
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
                          "rounded-lg px-4 py-2 text-xs font-medium border transition-all duration-150",
                          isSelected
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/50 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                        )}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Experience */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  2. How much experience do you have?<span className="text-red-400">*</span>
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
                          "rounded-lg px-4 py-2 text-xs font-medium border transition-all duration-150",
                          isSelected
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/50 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                        )}
                      >
                        {exp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Target Companies */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
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
                          "rounded-lg px-4 py-2 text-xs font-medium border transition-all duration-150",
                          isSelected
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/50 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                        )}
                      >
                        {comp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4: Target Region */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  4. Which region&apos;s companies are you preparing for?<span className="text-red-400">*</span>
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
                          "rounded-lg px-4 py-2 text-xs font-medium border transition-all duration-150",
                          isSelected
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/50 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
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
        {/* STEP 2: RECOMMENDED SUBJECTS (Clean SaaS design, no banners/TUFY) */}
        {/* ========================================================================= */}
        {store.currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Recommended subjects
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                We selected subjects that matter most for your target. You can customize them however you like.
              </p>
            </div>

            {/* Core Selected Subjects */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-zinc-300">
                We selected subjects that matter most for your target
              </div>
              <div className="space-y-2.5">
                {availableSubjects.map((sub) => {
                  const isChecked = store.selectedSubjects.includes(sub.slug);
                  return (
                    <div
                      key={sub.slug}
                      onClick={() => store.toggleSubject(sub.slug)}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-3.5 cursor-pointer transition-all",
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
                        <span className="text-xs font-semibold text-zinc-200">{sub.name}</span>
                      </div>
                      {sub.recommended && (
                        <Badge variant="blue" className="text-[10px] py-0 px-2">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-zinc-500 pt-1">
                Recommended — We&apos;ve handpicked these subjects to best match your preparation needs.
              </p>
            </div>

            {/* Other Additional Subjects */}
            <div className="space-y-3 pt-4 border-t border-zinc-800/80">
              <div className="text-xs font-semibold text-zinc-300">Other additional subjects</div>
              <div className="flex flex-wrap gap-3">
                {additionalSubjects.map((sub) => {
                  const isChecked = store.selectedSubjects.includes(sub.slug);
                  return (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => store.toggleSubject(sub.slug)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all",
                        isChecked
                          ? "border-blue-500 bg-blue-600/15 text-blue-400"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                      )}
                    >
                      <span>{sub.name}</span>
                      {sub.recommended && (
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.2 text-[10px] text-blue-300">
                          Recommended
                        </span>
                      )}
                      <Plus className={cn("h-3.5 w-3.5", isChecked && "rotate-45 text-blue-400")} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SELECT CURRENT LEVEL FOR EACH SUBJECT */}
        {/* ========================================================================= */}
        {store.currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Select your current level for each subject
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                Choose the depth of preparation required for each chosen subject.
              </p>
            </div>

            <div className="space-y-8">
              {/* DSA Levels */}
              {store.selectedSubjects.includes("dsa") && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">DSA</h3>
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
                        desc: "I've studied DSA before and want to master problem-solving over 1-2 months.",
                      },
                      {
                        level: "Quick Revision",
                        desc: "I have 15-20 days and want focused preparation for coding interviews.",
                      },
                    ].map((opt) => {
                      const isSelected = store.subjectLevels["dsa"] === opt.level;
                      return (
                        <div
                          key={opt.level}
                          onClick={() => store.setSubjectLevel("dsa", opt.level)}
                          className={cn(
                            "flex gap-3 rounded-lg border p-3.5 cursor-pointer transition-all",
                            isSelected
                              ? "border-blue-500 bg-blue-600/10 text-zinc-100 shadow-sm"
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
                            <div className="text-xs font-bold text-zinc-200">{opt.level}</div>
                            <div className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.desc}</div>
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">DBMS</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {
                        level: "Learn in Depth",
                        desc: "I want to understand every important concept thoroughly, including numericals and applications.",
                      },
                      {
                        level: "Interview Preparation",
                        desc: "I want to quickly cover the most frequently asked interview topics and questions.",
                      },
                    ].map((opt) => {
                      const isSelected = store.subjectLevels["dbms"] === opt.level;
                      return (
                        <div
                          key={opt.level}
                          onClick={() => store.setSubjectLevel("dbms", opt.level)}
                          className={cn(
                            "flex gap-3 rounded-lg border p-3.5 cursor-pointer transition-all",
                            isSelected
                              ? "border-blue-500 bg-blue-600/10 text-zinc-100 shadow-sm"
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
                            <div className="text-xs font-bold text-zinc-200">{opt.level}</div>
                            <div className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Operating Systems Levels */}
              {store.selectedSubjects.includes("operating-systems") && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Operating Systems</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {
                        level: "Learn in Depth",
                        desc: "I want to understand every important concept thoroughly, including numericals and applications.",
                      },
                      {
                        level: "Interview Preparation",
                        desc: "I want to quickly cover the most frequently asked interview topics and questions.",
                      },
                    ].map((opt) => {
                      const isSelected = store.subjectLevels["operating-systems"] === opt.level;
                      return (
                        <div
                          key={opt.level}
                          onClick={() => store.setSubjectLevel("operating-systems", opt.level)}
                          className={cn(
                            "flex gap-3 rounded-lg border p-3.5 cursor-pointer transition-all",
                            isSelected
                              ? "border-blue-500 bg-blue-600/10 text-zinc-100 shadow-sm"
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
                            <div className="text-xs font-bold text-zinc-200">{opt.level}</div>
                            <div className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Computer Networks Levels */}
              {store.selectedSubjects.includes("computer-networks") && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Computer Networks</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {
                        level: "Learn in Depth",
                        desc: "I want to understand every important concept thoroughly, including numericals and applications.",
                      },
                      {
                        level: "Interview Preparation",
                        desc: "I want to quickly cover the most frequently asked interview topics and questions.",
                      },
                    ].map((opt) => {
                      const isSelected = store.subjectLevels["computer-networks"] === opt.level;
                      return (
                        <div
                          key={opt.level}
                          onClick={() => store.setSubjectLevel("computer-networks", opt.level)}
                          className={cn(
                            "flex gap-3 rounded-lg border p-3.5 cursor-pointer transition-all",
                            isSelected
                              ? "border-blue-500 bg-blue-600/10 text-zinc-100 shadow-sm"
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
                            <div className="text-xs font-bold text-zinc-200">{opt.level}</div>
                            <div className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.desc}</div>
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
        {/* STEP 4: REVIEW PERSONALIZED ROADMAP (Full-width clean view) */}
        {/* ========================================================================= */}
        {store.currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                  Review your personalized roadmap
                </h1>
                <p className="mt-1 text-xs text-zinc-400">
                  Inspect the subjects, topics, and problem breakdown planned for you.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <button
                  onClick={() => toast.info("Removed all completed problems")}
                  className="hover:text-zinc-200"
                >
                  Remove solved
                </button>
                <span>•</span>
                <button
                  onClick={() => toast.info("Viewing version history")}
                  className="hover:text-zinc-200"
                >
                  Version history
                </button>
              </div>
            </div>

            {/* Top Planned Hours Callout */}
            <div className="flex items-center gap-2.5 rounded-lg border border-blue-900/40 bg-blue-950/20 px-4 py-3 text-xs text-blue-300">
              <Zap className="h-4 w-4 text-blue-400 shrink-0" />
              <span>
                We&apos;ve planned <strong className="text-blue-200 font-bold">220.1 hours</strong> of focused learning for you across your selected subjects.
              </span>
            </div>

            {/* Hierarchical Tree (Subjects -> Topics -> Subtopics -> Items) */}
            <div className="space-y-3">
              {/* DSA Subject */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <div
                  onClick={() =>
                    setExpandedReviewSubject((prev) => (prev === "dsa" ? "" : "dsa"))
                  }
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-3 font-semibold text-xs text-zinc-200">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-zinc-400 transition-transform",
                        expandedReviewSubject === "dsa" ? "" : "-rotate-90"
                      )}
                    />
                    <span>DSA</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>Est. 66h</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info("Removed subject from review");
                      }}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {expandedReviewSubject === "dsa" && (
                  <div className="border-t border-zinc-800/80 bg-zinc-950/70 p-3 space-y-2">
                    {/* Arrays Topic */}
                    <div className="rounded-md border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
                      <div
                        onClick={() =>
                          setExpandedReviewTopic((prev) => (prev === "Arrays" ? "" : "Arrays"))
                        }
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-900/80 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-300">
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-zinc-400 transition-transform",
                              expandedReviewTopic === "Arrays" ? "" : "-rotate-90"
                            )}
                          />
                          <span>Arrays</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                          <span>308 min</span>
                          <Trash2 className="h-3.5 w-3.5 text-zinc-500 hover:text-red-400 cursor-pointer" />
                        </div>
                      </div>

                      {expandedReviewTopic === "Arrays" && (
                        <div className="border-t border-zinc-800/60 bg-zinc-950/90 p-3 space-y-2 text-xs">
                          {/* Linear Scan Subtopic */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                              <span>Linear Scan</span>
                              <span>79 min</span>
                            </div>
                            <div className="pl-3 space-y-1.5 border-l border-zinc-800">
                              {[
                                "1. Majority Element-I",
                                "2. Kadane's Algorithm",
                                "3. Majority Element-II",
                                "4. Maximum Product Subarray in an Array",
                              ].map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-1 text-zinc-300 text-[11px] hover:text-zinc-100"
                                >
                                  <span>{item}</span>
                                  <Trash2 className="h-3 w-3 text-zinc-600 hover:text-red-400 cursor-pointer" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Other Topics */}
                    {[
                      { name: "Hashing", time: "124 min" },
                      { name: "Binary Search", time: "292 min" },
                      { name: "Sliding Window and Two Pointers", time: "177 min" },
                      { name: "Recursion and Backtracking", time: "198 min" },
                      { name: "Linked List", time: "347 min" },
                      { name: "Stack and Queues", time: "287 min" },
                      { name: "Greedy Algorithms", time: "133 min" },
                      { name: "Heaps", time: "139 min" },
                      { name: "Binary Trees", time: "216 min" },
                    ].map((topic) => (
                      <div
                        key={topic.name}
                        className="flex items-center justify-between rounded-md border border-zinc-800/80 bg-zinc-900/30 p-2.5 text-xs text-zinc-400 hover:bg-zinc-900/60 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                          <span>{topic.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span>{topic.time}</span>
                          <Trash2 className="h-3.5 w-3.5 text-zinc-600 hover:text-red-400 cursor-pointer" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DBMS Subject */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between text-xs text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 font-semibold">
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                  <span>DBMS</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <span>Est. 57h</span>
                  <Trash2 className="h-3.5 w-3.5 text-zinc-500 hover:text-red-400" />
                </div>
              </div>

              {/* Operating Systems Subject */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between text-xs text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 font-semibold">
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                  <span>Operating Systems</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <span>Est. 24h</span>
                  <Trash2 className="h-3.5 w-3.5 text-zinc-500 hover:text-red-400" />
                </div>
              </div>

              {/* Computer Networks Subject */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between text-xs text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 font-semibold">
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                  <span>Computer Networks</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <span>Est. 24h</span>
                  <Trash2 className="h-3.5 w-3.5 text-zinc-500 hover:text-red-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: SET WEEKLY STUDY AVAILABILITY */}
        {/* ========================================================================= */}
        {store.currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Set your weekly study availability.
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                Adjust how many hours you can dedicate on each day of the week.
              </p>
            </div>

            {/* Top Stat Banner */}
            <div className="flex items-center justify-between rounded-lg border border-blue-900/40 bg-blue-950/20 px-4 py-3 text-xs text-blue-300">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400 shrink-0" />
                <span>You can finish earlier by adding more hours on any day.</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-blue-200">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Est. days: <strong className="text-white text-sm">{estimatedDays}</strong></span>
              </div>
            </div>

            {/* Day Sliders */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 space-y-5">
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
                    <div className="flex items-center gap-2.5 w-32 text-xs font-semibold text-zinc-200">
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

                    <div className="w-16 text-right text-xs font-semibold text-zinc-300">
                      {hours} {hours === 1 ? "hour" : "hours"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-zinc-400">
              You have allocated a total of <strong className="text-zinc-200 font-bold">{totalWeeklyHours} hours</strong> for your weekly schedule.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: FINALISE YOUR PLAN (Preview, Details, Celebration) */}
        {/* ========================================================================= */}
        {store.currentStep === 6 && (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            {/* Phase 6A: Sprint Preview */}
            {step6Phase === "preview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                      Finalise your plan
                    </h1>
                    <p className="mt-1 text-xs text-zinc-400">
                      Your sprint preview
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">9 in total</span>
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
                          "rounded-lg border transition-all overflow-hidden",
                          isExpanded
                            ? "border-blue-500/40 bg-zinc-900/60"
                            : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                        )}
                      >
                        <div
                          onClick={() =>
                            setExpandedSprint((prev) => (prev === s.sprint ? "" : s.sprint))
                          }
                          className="flex items-center justify-between p-3.5 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Badge variant="blue" className="font-semibold text-xs">
                              {s.sprint}
                            </Badge>
                            <span className="text-xs text-zinc-300 font-medium">• {s.tags}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span>{s.time}</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                isExpanded ? "" : "-rotate-90"
                              )}
                            />
                          </div>
                        </div>

                        {/* Expanded Sprint 1 Drilldown */}
                        {isExpanded && s.sprint === "Sprint 1" && (
                          <div className="border-t border-zinc-800/80 bg-zinc-950/80 p-3 space-y-2">
                            {/* Day 1 */}
                            <div className="rounded border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                              <div
                                onClick={() =>
                                  setExpandedDay((prev) => (prev === "Day 1" ? "" : "Day 1"))
                                }
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-900/80"
                              >
                                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                                  <ChevronDown
                                    className={cn(
                                      "h-3.5 w-3.5 text-blue-400 transition-transform",
                                      expandedDay === "Day 1" ? "" : "-rotate-90"
                                    )}
                                  />
                                  <span>Day 1</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                  <span>Est. 3h 53m</span>
                                  <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
                                </div>
                              </div>

                              {expandedDay === "Day 1" && (
                                <div className="border-t border-zinc-800/60 bg-zinc-950 p-3 space-y-2 text-xs">
                                  {[
                                    { title: "Linear Search", time: "Est. 4 min" },
                                    { title: "Largest Element", time: "Est. 5 min" },
                                    { title: "Second Largest Element", time: "Est. 15 min" },
                                    { title: "Maximum Consecutive Ones", time: "Est. 3 min" },
                                    { title: "Left Rotate Array by One", time: "Est. 6 min" },
                                    { title: "Left Rotate Array by K Places", time: "Est. 17 min" },
                                    { title: "Move Zeros to End", time: "Est. 13 min" },
                                    { title: "Remove duplicates from sorted array", time: "Est. 11 min" },
                                    { title: "Find missing number", time: "Est. 18 min" },
                                    { title: "Union of two sorted arrays", time: "Est. 16 min" },
                                  ].map((task) => (
                                    <div
                                      key={task.title}
                                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-900/60 text-zinc-300"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                                        <span>{task.title}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                                        <span>{task.time}</span>
                                        <ChevronRight className="h-3 w-3" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Day 2 to Day 7 */}
                            {[
                              { day: "Day 2", time: "Est. 3h 42m" },
                              { day: "Day 3", time: "Est. 7h 57m" },
                              { day: "Day 4", time: "Est. 7h 55m" },
                              { day: "Day 5", time: "Est. 3h 49m" },
                              { day: "Day 6", time: "Est. 3h 53m" },
                              { day: "Day 7", time: "Est. 3h 38m" },
                            ].map((d) => (
                              <div
                                key={d.day}
                                className="flex items-center justify-between rounded border border-zinc-800/80 bg-zinc-900/30 p-2.5 text-xs text-zinc-400 hover:bg-zinc-900/60 cursor-pointer"
                              >
                                <div className="flex items-center gap-2 font-medium">
                                  <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                                  <span>{d.day}</span>
                                </div>
                                <span>{d.time}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Phase 6B: Plan Details */}
            {step6Phase === "details" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                    Plan details
                  </h1>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-xs">
                  <div>
                    <div className="text-zinc-500 flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" /> Total sprints
                    </div>
                    <div className="text-base font-bold text-zinc-100 mt-1">9</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Subjects
                    </div>
                    <div className="text-base font-bold text-zinc-100 mt-1">6</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Study hours
                    </div>
                    <div className="text-base font-bold text-zinc-100 mt-1">270h 53m</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 flex items-center gap-1">
                      <Target className="h-3.5 w-3.5" /> Est. duration
                    </div>
                    <div className="text-base font-bold text-zinc-100 mt-1">61 days</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-zinc-500 flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5" /> Est. completion
                    </div>
                    <div className="text-base font-bold text-zinc-100 mt-1">30 Nov 2026</div>
                  </div>
                </div>

                {/* Plan Name Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
                    <span>
                      Plan name<span className="text-red-400">*</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {store.planName.length}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={60}
                    value={store.planName}
                    onChange={(e) => store.setPlanName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3.5 py-2.5 text-xs text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* When do you want to start? */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    When do you want to start?<span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
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
                          "rounded-lg px-4 py-2 text-xs font-medium border transition-all",
                          store.startDateOption === opt.key
                            ? "border-blue-500 bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/50 shadow-sm"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    There isn&apos;t enough time left today for your allocated study hours. Choose tomorrow or a later date — we&apos;ll adjust your roadmap from there.
                  </p>

                  {/* Custom Date Input */}
                  {store.startDateOption === "custom" && (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 flex items-center gap-3 text-xs text-zinc-200">
                      <CalendarIcon className="h-4 w-4 text-blue-400" />
                      <span>Start date:</span>
                      <input
                        type="date"
                        value={store.customStartDate}
                        onChange={(e) => store.setCustomStartDate(e.target.value)}
                        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Phase 6C: Celebration Screen */}
            {step6Phase === "ready" && (
              <div className="py-8 text-center space-y-8 animate-in zoom-in-95 duration-300">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-3xl border border-blue-500/40 shadow-xl shadow-blue-500/10">
                  🎉
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
                    Your personalised roadmap is ready
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                    We&apos;ve created a personalised day-wise plan based on your goals and availability.
                  </p>
                </div>

                {/* Plan Card */}
                <div className="max-w-2xl mx-auto rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-left shadow-2xl space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl shadow-md">
                      🎯
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">{store.planName}</h3>
                      <p className="text-xs text-zinc-400">We&apos;ve got a great plan. Let&apos;s get to work!</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800/80 text-xs">
                    <div>
                      <div className="text-zinc-500 flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" /> Start date
                      </div>
                      <div className="text-sm font-bold text-zinc-200 mt-1">1 Oct 2026</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" /> End date
                      </div>
                      <div className="text-sm font-bold text-zinc-200 mt-1">30 Nov 2026</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" /> Total sprints
                      </div>
                      <div className="text-sm font-bold text-zinc-200 mt-1">9</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Duration
                      </div>
                      <div className="text-sm font-bold text-zinc-200 mt-1">271h</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-lg shadow-blue-600/20"
                  >
                    Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" />
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
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            {/* Progress Bar & Status */}
            <div className="flex items-center gap-4">
              <div className="w-24 sm:w-32">
                <Progress value={(store.currentStep / 6) * 100} className="h-1.5" />
              </div>
              <span className="text-[11px] text-zinc-500 font-medium">
                Step {store.currentStep} of 6 &middot; Draft saved
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              {store.currentStep > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="h-8 px-3 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleNext}
                className="h-8 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
              >
                {store.currentStep === 1 && (
                  <>
                    Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
                {store.currentStep === 2 && (
                  <>
                    Continue with selected subjects <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
                {store.currentStep === 3 && (
                  <>
                    Confirm levels <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
                {store.currentStep === 4 && (
                  <>
                    Confirm content <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
                {store.currentStep === 5 && (
                  <>
                    Confirm availability <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
                {store.currentStep === 6 && step6Phase === "preview" && (
                  <>
                    Name my plan <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
                {store.currentStep === 6 && step6Phase === "details" && (
                  <>
                    Generate plan <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
