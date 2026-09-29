"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-zinc-950 text-zinc-100">
      <div className="space-y-4 max-w-md mx-auto rounded-xl border border-red-500/20 bg-red-500/5 p-6 shadow-subtle">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-100">
          Something went wrong
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {error?.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="pt-2 flex items-center justify-center gap-2.5">
          <Button
            onClick={() => reset()}
            size="sm"
            variant="outline"
            className="border-zinc-800 bg-zinc-900/80 text-zinc-200"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Try Again
          </Button>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/dashboard">
              <Home className="h-3.5 w-3.5 mr-1.5" /> Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
