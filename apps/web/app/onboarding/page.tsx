import React from "react";
import { OnboardingView } from "@/features/onboarding";

export const metadata = {
  title: "Onboarding Wizard — Build Your Custom Plan | Crack SDE",
  description: "Personalized tech interview curriculum generator calibrated to your target role and pace.",
};

export default function OnboardingPage() {
  return <OnboardingView />;
}
