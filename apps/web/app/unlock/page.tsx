"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UnlockPage() {
  const features = [
    "Unlimited personalized study plans & sprint customizers",
    "Detailed video explanations & multi-language code templates",
    "Mock technical interview loops with real-time feedback",
    "Dedicated revision list sync across all devices",
    "Company-specific interview sheets (Google, Amazon, Meta, Uber)",
    "Priority community mentorship & code review discussions",
  ];

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[12px] font-medium text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Crack SDE Pro Workspace</span>
        </div>
        <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
          Unlock Full Interview Preparation Suite
        </h1>
        <p className="text-[13px] font-normal leading-[1.45] text-zinc-400 max-w-lg mx-auto">
          Accelerate your software engineering interview prep with comprehensive tools, curated problem tracks, and real-time sprint management.
        </p>
      </div>

      {/* Feature Card */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 space-y-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <span className="text-[12px] uppercase tracking-wider text-blue-400 font-medium">Pro Plan</span>
            <div className="text-[18px] font-semibold leading-[1.3] text-zinc-100 mt-1">Full SDE Access</div>
            <p className="text-[13px] font-normal text-zinc-400 mt-0.5 leading-[1.45]">Everything you need to crack SDE 1, SDE 2 &amp; Senior engineering rounds.</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[18px] font-semibold text-zinc-100">Free Tier Active</span>
            <div className="text-[12px] text-zinc-500 font-normal">Includes core 847 problems</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3.5 text-[13px] text-zinc-300 font-normal leading-[1.45]">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto h-10 px-6 text-[14px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Link href="/onboarding">
              Build Your Personalized Roadmap <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-10 px-6 text-[14px] font-medium"
          >
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
