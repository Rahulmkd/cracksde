import React, { Suspense } from "react";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

export default function CreatePlanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="h-48 w-full max-w-xl rounded-xl border border-zinc-800/80 bg-zinc-900/20 animate-pulse" />
        </div>
      }
    >
      <OnboardingWizard />
    </Suspense>
  );
}
