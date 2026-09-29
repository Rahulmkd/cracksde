"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SupportedLanguage } from "../types";

interface LanguageSelectorProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onResetTemplate: () => void;
}

export function LanguageSelector({
  language,
  onLanguageChange,
  onResetTemplate,
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2">
      <div className="flex items-center gap-2.5">
        <span className="text-[12px] text-zinc-400 font-normal">Language:</span>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
        >
          <option value="cpp">C++ 20 (GCC 13)</option>
          <option value="java">Java 21 (OpenJDK)</option>
          <option value="python">Python 3.12</option>
          <option value="javascript">JavaScript (Node 20)</option>
        </select>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={onResetTemplate}
        className="h-6 text-[11px] text-zinc-400 hover:text-zinc-200 font-normal"
      >
        <RotateCcw className="h-3 w-3 mr-1" /> Reset Template
      </Button>
    </div>
  );
}
