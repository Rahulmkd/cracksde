"use client";

import React from "react";
import { LanguageSelector } from "./language-selector";
import type { SupportedLanguage } from "../types";

interface CodeEditorWindowProps {
  language: SupportedLanguage;
  code: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onResetTemplate: () => void;
}

export function CodeEditorWindow({
  language,
  code,
  onCodeChange,
  onLanguageChange,
  onResetTemplate,
}: CodeEditorWindowProps) {
  return (
    <div className="lg:col-span-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle flex flex-col">
      <LanguageSelector
        language={language}
        onLanguageChange={onLanguageChange}
        onResetTemplate={onResetTemplate}
      />

      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        rows={18}
        spellCheck={false}
        className="w-full bg-zinc-950 p-3.5 font-mono text-[12px] text-zinc-100 leading-relaxed focus:outline-none resize-none selection:bg-blue-600/30"
      />
    </div>
  );
}
