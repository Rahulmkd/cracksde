"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import {
  TOTAL_ROADMAP_HOURS,
  getSelectedSubjectsHours,
  getSelectedSubjectsSprints,
} from "@/constants/onboarding-options";
import { studyPlanService } from "@/services/study-plan-service";
import { profileService } from "@/services/profile-service";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { OnboardingStepper } from "./onboarding-stepper";
import { StepSubjects } from "./step-subjects";
import { StepAvailability } from "./step-availability";
import { StepFinalize } from "./step-finalize";
import { PlanlySkeleton } from "@/features/planly/components/planly-skeleton";

export function OnboardingWizard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const store = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepopulate role & experience from user profile if available
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (profileData?.profile) {
      if (profileData.profile.targetRole && store.targetRole === "Software Engineer") {
        store.setTargetRole(profileData.profile.targetRole);
      }
      if (profileData.profile.experience && store.experience === "0 - 2 years") {
        store.setExperience(profileData.profile.experience);
      }
      if (profileData.profile.selectedSubjects && profileData.profile.selectedSubjects.length > 0) {
        store.setSelectedSubjects(profileData.profile.selectedSubjects);
      }
    }
  }, [profileData]);

  const totalWeeklyHours = store.getTotalWeeklyHours();
  const selectedCurriculumHours = getSelectedSubjectsHours(store.selectedSubjects) || TOTAL_ROADMAP_HOURS;
  const selectedSprintsCount = getSelectedSubjectsSprints(store.selectedSubjects) || 9;
  const estimatedDays = Math.max(1, Math.round((selectedCurriculumHours / Math.max(1, totalWeeklyHours)) * 7));

  const handleNext = async () => {
    if (store.currentStep === 1) {
      if (store.selectedSubjects.length === 0) {
        toast.error("Please select at least one subject to continue.");
        return;
      }
      store.nextStep();
      return;
    }

    if (store.currentStep === 2) {
      if (totalWeeklyHours <= 0) {
        toast.error("Please allocate at least 1 study hour per week.");
        return;
      }
      store.nextStep();
      return;
    }

    if (store.currentStep === 3) {
      if (!store.planName.trim()) {
        toast.error("Please provide a name for your study plan.");
        return;
      }

      setIsSubmitting(true);
      try {
        const dailyHours = Math.max(1, Math.round(totalWeeklyHours / 7));
        const dailyGoalMinutes = Math.max(15, Math.round((totalWeeklyHours * 60) / 7));

        let startDateStr = store.customStartDate;
        if (store.startDateOption === "today") {
          startDateStr = new Date().toISOString().split("T")[0];
        } else if (store.startDateOption === "tomorrow") {
          startDateStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
        }

        // Update authenticated user's profile if signed in
        if (user) {
          try {
            await profileService.updateProfile({
              targetRole: store.targetRole,
              experience: store.experience,
              dailyGoalMinutes,
              hasActivePlan: true,
              planName: store.planName.trim(),
              planStartDate: startDateStr,
              selectedSubjects: store.selectedSubjects,
            });
          } catch (profileErr) {
            console.warn("Could not save profile during onboarding:", profileErr);
          }
        }

        // Update Study Plan schedule & selected subjects
        await studyPlanService.updatePlan("crack-sde", {
          name: store.planName.trim(),
          startDate: startDateStr,
          dailyHours,
          selectedSubjects: store.selectedSubjects,
        });

        // Invalidate caches across the app
        queryClient.invalidateQueries({ queryKey: ["study-plan"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["user-profile-stats"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        queryClient.invalidateQueries({ queryKey: ["revision-list"] });
        queryClient.invalidateQueries({ queryKey: ["user-revisions"] });

        toast.success("🚀 Study Plan created and activated!");
        router.push("/planly");
      } catch (err: any) {
        toast.error(err.message || "Failed to finalize study plan");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    store.nextStep();
  };

  const handlePrev = () => {
    store.prevStep();
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white select-none">
        <header className="flex h-14 items-center justify-between border-b border-zinc-800/80 px-4 sm:px-8 bg-zinc-950/85 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-zinc-100"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-[12px] shadow-sm shadow-blue-600/20">
                ⚡
              </span>
              <span>
                Planly <span className="text-zinc-500 font-normal text-[12px]">by</span>{" "}
                <span className="text-zinc-100 font-semibold">Crack SDE</span>
              </span>
            </Link>
          </div>
          <div className="text-[12px] text-blue-400 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Activating study plan...</span>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
          <PlanlySkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white select-none">
      {/* Top Header */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-800/80 px-4 sm:px-8 bg-zinc-950/85 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-zinc-100"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-[12px] shadow-sm shadow-blue-600/20">
              ⚡
            </span>
            <span>
              Planly <span className="text-zinc-500 font-normal text-[12px]">by</span>{" "}
              <span className="text-zinc-100 font-semibold">Crack SDE</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-zinc-400">
          <button
            onClick={() => {
              store.resetOnboarding({
                targetRole: profileData?.profile?.targetRole || "Software Engineer",
                experience: profileData?.profile?.experience || "0 - 2 years",
                selectedSubjects: profileData?.profile?.selectedSubjects?.length
                  ? profileData.profile.selectedSubjects
                  : undefined,
              });
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
        <OnboardingStepper
          currentStep={store.currentStep}
          onStepClick={(step) => store.setStep(step)}
        />

        {/* Step Views */}
        {store.currentStep === 1 && (
          <StepSubjects
            targetRole={store.targetRole}
            selectedSubjects={store.selectedSubjects}
            onToggleSubject={store.toggleSubject}
            onSelectAll={store.selectAllSubjects}
            onClearAll={store.clearAllSubjects}
          />
        )}

        {store.currentStep === 2 && (
          <StepAvailability
            availability={store.availability}
            onSetDayAvailability={store.setDayAvailability}
            totalWeeklyHours={totalWeeklyHours}
            estimatedDays={estimatedDays}
          />
        )}

        {store.currentStep === 3 && (
          <StepFinalize
            planName={store.planName}
            setPlanName={store.setPlanName}
            targetRole={store.targetRole}
            experience={store.experience}
            selectedSubjectsCount={store.selectedSubjects.length}
            totalWeeklyHours={totalWeeklyHours}
            estimatedDays={estimatedDays}
            totalCurriculumHours={Math.round(selectedCurriculumHours)}
            totalSprints={selectedSprintsCount}
          />
        )}

        {/* Bottom Navigation Buttons */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={store.currentStep === 1 || isSubmitting}
            className="h-8 px-3 text-[12px] font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <Button
            size="sm"
            onClick={handleNext}
            disabled={isSubmitting}
            className="h-8 px-4 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {store.currentStep === 3 ? (
              <>
                <Zap className="h-3.5 w-3.5 mr-1" />
                {isSubmitting ? "Activating..." : "Launch My Roadmap"}
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
