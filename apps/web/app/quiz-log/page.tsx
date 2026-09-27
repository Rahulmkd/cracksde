import React, { Suspense } from "react";
import { QuizLogView } from "@/features/quiz-log";

export const metadata = {
  title: "Quiz Log & Curriculum Directory | Crack SDE",
  description: "Curriculum question repository, problem ingestion, and topic management.",
};

export default function QuizLogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Quiz Directory...</div>}>
      <QuizLogView />
    </Suspense>
  );
}
