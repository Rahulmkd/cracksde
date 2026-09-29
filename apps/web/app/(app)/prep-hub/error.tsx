"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function PrepHubError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PrepHub error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-md space-y-4 rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
        <h2 className="text-base font-semibold text-zinc-100">Unable to load Prep Hub</h2>
        <p className="text-xs text-zinc-400">
          {error?.message || "There was a problem loading the curriculum tracks and topic modules."}
        </p>
        <Button onClick={() => reset()} size="sm" variant="outline" className="text-xs">
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry Prep Hub
        </Button>
      </div>
    </div>
  );
}
