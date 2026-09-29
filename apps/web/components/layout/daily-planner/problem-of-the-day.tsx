"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

export function ProblemOfTheDay() {
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 25, seconds: 4 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-[#0c1017] p-4 space-y-3 shadow-sm hover:border-zinc-700/80 transition-all duration-200 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-zinc-100">
          <span className="text-blue-400 text-sm">✦</span>
          <span>Problem Of The Day</span>
        </div>
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 font-mono">
          +20 pts
        </span>
      </div>

      <div className="space-y-1">
        <div className="text-[13px] font-bold text-zinc-100 truncate">
          Trapping Rain Water (Two Pointers)
        </div>
        <div className="text-[11px] text-zinc-400 font-normal">
          DSA &middot; Hard / Pro &middot; 35m est.
        </div>
      </div>

      {/* Countdown Display */}
      <div className="flex items-center justify-center gap-2 py-1">
        <div className="flex flex-col items-center">
          <span className="rounded-md border border-zinc-800/90 bg-[#080c14] px-2.5 py-1 font-mono text-[13px] font-semibold text-zinc-100 shadow-inner">
            {formatDigits(timeLeft.hours)}
          </span>
        </div>
        <span className="text-zinc-500 font-bold text-[12px]">:</span>
        <div className="flex flex-col items-center">
          <span className="rounded-md border border-zinc-800/90 bg-[#080c14] px-2.5 py-1 font-mono text-[13px] font-semibold text-zinc-100 shadow-inner">
            {formatDigits(timeLeft.minutes)}
          </span>
        </div>
        <span className="text-zinc-500 font-bold text-[12px]">:</span>
        <div className="flex flex-col items-center">
          <span className="rounded-md border border-zinc-800/90 bg-[#080c14] px-2.5 py-1 font-mono text-[13px] font-semibold text-zinc-100 shadow-inner">
            {formatDigits(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        asChild
        size="sm"
        className="w-full h-8 text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg transition-colors"
      >
        <Link href={`${ROUTES.PRACTICE}?subject=dsa&search=Trapping+Rain+Water`} className="flex items-center justify-center gap-1.5">
          <span>Solve problem</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}

