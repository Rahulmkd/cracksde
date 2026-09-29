"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

export function ProblemOfTheDay() {
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 25, seconds: 9 });

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
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-3 shadow-subtle hover:border-zinc-700/80 transition-all duration-200 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-200">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>Problem Of The Day</span>
        </div>
        <Badge variant="blue" className="text-[10px] font-medium py-0.5 px-1.5 leading-none">
          +20 pts
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="text-[12px] font-medium text-zinc-100 truncate">
          Trapping Rain Water (Two Pointers)
        </div>
        <div className="text-[11px] text-zinc-400 font-normal">
          DSA &middot; Hard / Pro &middot; 35m est.
        </div>
      </div>

      {/* Countdown Display */}
      <div className="flex items-center justify-center gap-1.5 py-1">
        <div className="flex flex-col items-center">
          <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[12px] font-semibold text-zinc-100 shadow-inner">
            {formatDigits(timeLeft.hours)}
          </span>
        </div>
        <span className="text-zinc-600 font-semibold text-[11px]">:</span>
        <div className="flex flex-col items-center">
          <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[12px] font-semibold text-zinc-100 shadow-inner">
            {formatDigits(timeLeft.minutes)}
          </span>
        </div>
        <span className="text-zinc-600 font-semibold text-[11px]">:</span>
        <div className="flex flex-col items-center">
          <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[12px] font-semibold text-zinc-100 shadow-inner">
            {formatDigits(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        asChild
        size="sm"
        className="w-full h-7 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
      >
        <Link href={ROUTES.PRACTICE}>
          Solve problem <ArrowRight className="h-3 w-3 ml-1.5" />
        </Link>
      </Button>
    </div>
  );
}
