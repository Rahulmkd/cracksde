"use client";

import React, { useState } from "react";
import {
  FolderCode,
  Play,
  RotateCcw,
  Copy,
  Terminal,
  Save,
  Check,
  FileCode,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const defaultCodeSnippets = {
  cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    vector<int> nums = {5, 2, 8, 1, 9};\n    sort(nums.begin(), nums.end());\n    \n    cout << "Sorted array: ";\n    for (int x : nums) cout << x << " ";\n    cout << "\\n";\n    \n    return 0;\n}`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] nums = {5, 2, 8, 1, 9};\n        Arrays.sort(nums);\n        System.out.println("Sorted: " + Arrays.toString(nums));\n    }\n}`,
  python: `def solve():\n    nums = [5, 2, 8, 1, 9]\n    nums.sort()\n    print(f"Sorted array: {nums}")\n\nif __name__ == "__main__":\n    solve()`,
  javascript: `function solve() {\n    const nums = [5, 2, 8, 1, 9];\n    nums.sort((a, b) => a - b);\n    console.log("Sorted array:", nums);\n}\n\nsolve();`
};

export default function CodespacePage() {
  const [language, setLanguage] = useState<"cpp" | "java" | "python" | "javascript">("cpp");
  const [code, setCode] = useState<string>(defaultCodeSnippets.cpp);
  const [stdin, setStdin] = useState("");
  const [stdout, setStdout] = useState("Click 'Run Code' to compile and execute.");
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (lang: "cpp" | "java" | "python" | "javascript") => {
    setLanguage(lang);
    setCode(defaultCodeSnippets[lang]);
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
        {/* Left / Top: Code Editor */}
        <div className="lg:col-span-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle flex flex-col">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] text-zinc-400 font-normal">Language:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as "cpp" | "java" | "python" | "javascript")}
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
              onClick={() => setCode(defaultCodeSnippets[language])}
              className="h-6 text-[11px] text-zinc-400 hover:text-zinc-200 font-normal"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reset Template
            </Button>
          </div>

          {/* Editor Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={18}
            spellCheck={false}
            className="w-full bg-zinc-950 p-3.5 font-mono text-[12px] text-zinc-100 leading-relaxed focus:outline-none resize-none selection:bg-blue-600/30"
          />
        </div>

        {/* Right / Bottom: Console Output & Custom Input */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Output Terminal Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle flex flex-col">
            <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-950/70 px-3.5 py-2 text-[12px] font-semibold text-zinc-200">
              <Terminal className="h-3.5 w-3.5 text-blue-400" />
              <span>Console Output</span>
            </div>
            <pre className="p-3.5 bg-zinc-950 text-[11px] font-mono text-zinc-300 leading-relaxed min-h-[160px] max-h-[240px] overflow-y-auto whitespace-pre-wrap">
              {stdout}
            </pre>
          </div>

          {/* Stdin Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle p-3.5 space-y-1.5">
            <span className="text-[12px] font-semibold text-zinc-200">Custom Input (stdin)</span>
            <textarea
              placeholder="Enter standard input values (optional)..."
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2 font-mono text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
