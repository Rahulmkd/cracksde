"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      const msg = authError.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    } else {
      toast.success("Account created successfully!");
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
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-600/20 text-white font-semibold text-[14px]">
              ⚡
            </div>
            <CardTitle className="text-[20px] font-semibold leading-[1.25] tracking-tight text-zinc-100">
              Create an account
            </CardTitle>
            <CardDescription className="text-[13px] font-normal leading-[1.45] text-zinc-400">
              Get started with your personalized SDE preparation sprint
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-400 font-normal">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[13px] font-medium text-zinc-200">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] font-medium text-zinc-200">Email Address</Label>
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
                <Label htmlFor="password" className="text-[13px] font-medium text-zinc-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-zinc-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-[14px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-2"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[13px] text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
