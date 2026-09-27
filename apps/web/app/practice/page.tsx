import React, { Suspense } from "react";
import { PracticeView } from "@/features/practice";

export const metadata = {
  title: "Practice Problems — Problem Bank | Crack SDE",
  description: "Curated library of software engineering problems, algorithm patterns, and system design challenges.",
};

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Practice Problems...</div>}>
      <PracticeView />
    </Suspense>
  );
}
