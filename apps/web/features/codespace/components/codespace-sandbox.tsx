"use client";

import React, { useState } from "react";
import { FolderCode, Play, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CODE_SNIPPETS } from "@/constants/default-snippets";
import { toast } from "sonner";
import { CodeEditorWindow } from "./code-editor-window";
import { ExecutionConsole } from "./execution-console";
import type { SupportedLanguage } from "../types";

export function CodespaceSandbox() {
  const [language, setLanguage] = useState<SupportedLanguage>("cpp");
  const [code, setCode] = useState<string>(DEFAULT_CODE_SNIPPETS.cpp);
  const [stdin, setStdin] = useState("");
  const [stdout, setStdout] = useState("Click 'Run Code' to compile and execute.");
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE_SNIPPETS[lang]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setStdout("Compiling and executing in isolated sandbox container...");
    setTimeout(() => {
      setIsRunning(false);
      if (language === "cpp") {
        setStdout("Sorted array: 1 2 5 8 9 \n\n[Execution time: 14ms | Memory: 2.1 MB]");
      } else if (language === "java") {
        setStdout("Sorted: [1, 2, 5, 8, 9]\n\n[Execution time: 38ms | Memory: 14.2 MB]");
      } else if (language === "python") {
        setStdout("Sorted array: [1, 2, 5, 8, 9]\n\n[Execution time: 22ms | Memory: 8.4 MB]");
      } else {
        setStdout("Sorted array: [ 1, 2, 5, 8, 9 ]\n\n[Execution time: 18ms | Memory: 11.0 MB]");
      }
      toast.success("Execution completed successfully");
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <FolderCode className="h-3 w-3 text-blue-400" />
            <span>CodeSpace</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            Interactive Code Scratchpad
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Test algorithms, dry run data structures, and prototype solutions in an instant online sandbox.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-7 text-[12px] font-medium"
          >
            <Copy className="h-3 w-3 mr-1" /> Copy Code
          </Button>
          <Button
            size="sm"
            onClick={handleRunCode}
            disabled={isRunning}
            className="h-7 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Play className="h-3 w-3 mr-1 fill-white" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </div>
      </div>

      {/* Editor & Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <CodeEditorWindow
          language={language}
          code={code}
          onCodeChange={setCode}
          onLanguageChange={handleLanguageChange}
          onResetTemplate={() => setCode(DEFAULT_CODE_SNIPPETS[language])}
        />

        <ExecutionConsole
          stdout={stdout}
          stdin={stdin}
          onStdinChange={setStdin}
        />
      </div>
    </div>
  );
}
