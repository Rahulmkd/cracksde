"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useStudyPlan } from "@/hooks/use-study-plan";
import { toast } from "sonner";

import { StepStepper } from "./components/step-stepper";
import { Step1About } from "./components/step1-about";
import { Step2Subjects } from "./components/step2-subjects";
import { Step3Levels } from "./components/step3-levels";
import { Step4Review } from "./components/step4-review";
import { Step5Availability } from "./components/step5-availability";
import { Step6Finalize } from "./components/step6-finalize";

export function OnboardingView() {
  const router = useRouter();
  const store = useOnboardingStore();
  const { updatePlan, isUpdatingPlan } = useStudyPlan("crack-sde");

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(store.targetRole || "Software Engineer");
  const [experience, setExperience] = useState(store.experience || "0 - 2 years");
  const [targetCompany, setTargetCompany] = useState(store.targetCompany || "FAANG / Big Tech");
  const [region, setRegion] = useState(store.targetRegion || "India");

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    store.selectedSubjects?.length
      ? store.selectedSubjects
      : ["dsa", "system-design", "lld", "operating-systems", "dbms"]
  );

  const [subjectLevels, setSubjectLevels] = useState<Record<string, number>>({
    dsa: 2,
    "system-design": 2,
    lld: 2,
    "operating-systems": 1,
    dbms: 1,
  });

  const [dailyHours, setDailyHours] = useState(4);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const steps = [
    { num: 1, title: "About You" },
    { num: 2, title: "Subjects" },
    { num: 3, title: "Levels" },
    { num: 4, title: "Review" },
    { num: 5, title: "Availability" },
    { num: 6, title: "Finalize" },
  ];

  const handleToggleSubject = (subSlug: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subSlug) ? prev.filter((s) => s !== subSlug) : [...prev, subSlug]
    );
  };

  const handleLevelChange = (subSlug: string, level: number) => {
    setSubjectLevels((prev) => ({ ...prev, [subSlug]: level }));
  };

  const handleConfirmAndLaunch = () => {
    store.setTargetRole(role);
    store.setExperience(experience);
    store.setTargetCompany(targetCompany);
    store.setTargetRegion(region);

    updatePlan(
      { startDate, dailyHours },
      {
        onSuccess: () => {
          toast.success("Workspace configured successfully! Welcome to Crack SDE 🚀");
          router.push("/planly");
        },
        onError: () => {
          router.push("/planly");
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Stepper Header */}
      <StepStepper
        currentStep={step}
        totalSteps={6}
        steps={steps}
        onSelectStep={setStep}
      />

      {/* Active Step Content Container */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-3xl p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <Step1About
            role={role}
            onSelectRole={setRole}
            experience={experience}
            onSelectExperience={setExperience}
            targetCompany={targetCompany}
            onSelectCompany={setTargetCompany}
            region={region}
            onSelectRegion={setRegion}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2Subjects
            selectedSubjects={selectedSubjects}
            onToggleSubject={handleToggleSubject}
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3Levels
            selectedSubjects={selectedSubjects}
            subjectLevels={subjectLevels}
            onLevelChange={handleLevelChange}
            onNext={() => setStep(4)}
            onPrev={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Step4Review
            selectedSubjects={selectedSubjects}
            onNext={() => setStep(5)}
            onPrev={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <Step5Availability
            dailyHours={dailyHours}
            onDailyHoursChange={setDailyHours}
            startDate={startDate}
            onStartDateChange={setStartDate}
            onNext={() => setStep(6)}
            onPrev={() => setStep(4)}
          />
        )}

        {step === 6 && (
          <Step6Finalize
            role={role}
            experience={experience}
            selectedSubjects={selectedSubjects}
            dailyHours={dailyHours}
            startDate={startDate}
            onConfirm={handleConfirmAndLaunch}
            onPrev={() => setStep(5)}
            isGenerating={isUpdatingPlan}
          />
        )}
      </div>
    </div>
  );
}
