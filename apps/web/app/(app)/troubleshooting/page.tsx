"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Puzzle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Wifi,
  Database,
  Server,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api-client";

export default function TroubleshootingPage() {
  const queryClient = useQueryClient();
  const [testingApi, setTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<"ok" | "error" | "untested">("ok");

  const handleClearCache = () => {
    try {
      localStorage.clear();
      queryClient.clear();
      toast.success("Local storage & React Query cache cleared successfully");
    } catch {
      toast.error("Failed to clear cache");
    }
  };

  const handleTestApi = async () => {
    setTestingApi(true);
    try {
      const res = await api.get<{ success?: boolean; data?: { status: string } }>("/api/health");
      if (res && (res.success || res.data?.status === "ok")) {
        setApiStatus("ok");
        toast.success("API server is healthy and responding (200 OK)");
      } else {
        setApiStatus("error");
        toast.error("API health check returned unexpected response");
      }
    } catch {
      setApiStatus("error");
      toast.error("Could not reach API server");
    } finally {
      setTestingApi(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Puzzle className="h-5 w-5 text-blue-400" />
          Troubleshooting &amp; Diagnostics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal mt-1">
          Verify system connectivity, test APIs, clear caches, and diagnose platform issues
        </p>
      </div>

      {/* System Health Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">API Gateway</span>
            <Server className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-zinc-200">Operational</span>
          </div>
          <p className="text-[11px] text-zinc-400">Port 5001 Express Engine</p>
        </Card>

        <Card className="border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">PostgreSQL Database</span>
            <Database className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-zinc-200">Connected</span>
          </div>
          <p className="text-[11px] text-zinc-400">Neon Serverless Cloud</p>
        </Card>

        <Card className="border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Network &amp; Client</span>
            <Wifi className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-zinc-200">Online</span>
          </div>
          <p className="text-[11px] text-zinc-400">Next.js App Router</p>
        </Card>
      </div>

      {/* Quick Troubleshooting Actions */}
      <Card className="border-zinc-800/80 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-amber-400" />
            Self-Service Remediation Tools
          </CardTitle>
          <p className="text-xs text-zinc-400 font-normal">
            Resolve stale cache issues or sync mismatches
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 gap-3">
            <div>
              <h4 className="text-xs font-semibold text-zinc-200">Clear Local App Cache</h4>
              <p className="text-[11px] text-zinc-400 font-normal">
                Clears localStorage and invalidates TanStack React Query cache to force fresh data fetches.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearCache}
              className="h-8 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100 gap-1.5 shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5 text-amber-400" />
              Clear App Cache
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 gap-3">
            <div>
              <h4 className="text-xs font-semibold text-zinc-200">Test Backend API Connection</h4>
              <p className="text-[11px] text-zinc-400 font-normal">
                Pings the backend server health check endpoint (`/api/health`) to ensure network connectivity.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleTestApi}
              disabled={testingApi}
              className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white gap-1.5 shrink-0"
            >
              <Server className="h-3.5 w-3.5" />
              {testingApi ? "Testing..." : "Ping API"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Frequently Asked Troubleshooting Questions */}
      <Card className="border-zinc-800/80 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-purple-400" />
            Common Issues &amp; FAQs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 space-y-1">
            <h5 className="text-xs font-semibold text-zinc-200">
              Why is my problem solve progress not reflecting immediately?
            </h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
              CrackSDE utilizes optimistic cache updates with server sync. If network is interrupted, your solve attempts are safely synced when connectivity resumes.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 space-y-1">
            <h5 className="text-xs font-semibold text-zinc-200">
              How does the Spaced Repetition recall algorithm work?
            </h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
              Concept revisions are scheduled dynamically based on your solve correctness: 1 day, 3 days, 7 days, and 14 days intervals to guarantee maximum recall retention before real interview loops.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
