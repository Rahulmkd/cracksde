import React, { Suspense } from "react";
import { PrepHubView } from "@/features/prep-hub";

export const metadata = {
  title: "Prep Hub — Curriculum Tracks & Knowledge Tree | Crack SDE",
  description: "Comprehensive single source of truth curriculum across DSA, System Design, LLD, OS, and DBMS.",
};

export default function PrepHubPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Prep Hub...</div>}>
      <PrepHubView />
    </Suspense>
  );
}
