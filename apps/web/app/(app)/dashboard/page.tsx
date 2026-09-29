import React, { Suspense } from "react";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 pb-12">
          <div className="h-28 rounded-xl border border-zinc-800/80 bg-zinc-900/20 animate-pulse" />
        </div>
      }
    >
      <DashboardOverview />
    </Suspense>
  );
}
