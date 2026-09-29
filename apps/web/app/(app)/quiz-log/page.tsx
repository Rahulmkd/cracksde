import React, { Suspense } from "react";
import { QuizLogManager } from "@/features/quiz-log/components/quiz-log-manager";

export default function QuizLogPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 pb-12">
          <div className="h-28 rounded-xl border border-zinc-800/80 bg-zinc-900/20 animate-pulse" />
        </div>
      }
    >
      <QuizLogManager />
    </Suspense>
  );
}
