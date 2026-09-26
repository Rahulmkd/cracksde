"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (session && !sessionLoading) {
      router.replace("/dashboard");
    }
  }, [session, sessionLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      const msg = authError.message || "Invalid credentials";
      setError(msg);
      toast.error(msg);
    } else {
      toast.success("Signed in successfully");
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);

    const { error: authError } = await signIn.email({
      email: "demo@example.com",
      password: "Demo@123",
    });

    setLoading(false);

    if (authError) {
      const msg = authError.message || "Demo login failed";
      setError(msg);
      toast.error(msg);
    } else {
      toast.success("Logged in as Demo User");
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-10 w-full mt-6" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5 animate-in fade-in-50 duration-200">
        <Card className="border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 shadow-card">
          <CardHeader className="text-center space-y-2 p-0 pb-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-600/20 text-white font-bold text-sm">
              ⚡
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
              Welcome back
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Sign in to your Crack SDE workspace and study planner
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400 font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-zinc-200">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-zinc-200">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-1"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-zinc-900 px-2 text-zinc-500 font-medium">
                  or quick access
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full h-10 text-xs border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 font-medium"
            >
              🚀 Instant Demo Login
            </Button>

            <div className="rounded-lg bg-zinc-950/60 p-2.5 text-center text-[11px] text-zinc-400 border border-zinc-800/80">
              <span className="font-semibold text-zinc-300">Demo Account:</span>{" "}
              demo@example.com &middot; Demo@123
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
