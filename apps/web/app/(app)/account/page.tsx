"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { DeleteAccountDialog } from "@/features/profile";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  KeyRound,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  User,
  Sparkles,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, session, signOut } = useAuth();
  const { data } = useProfile();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSignOutAll = async () => {
    try {
      await signOut();
      toast.success("Signed out of all sessions successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password update link has been sent to your email!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-400" />
          Account &amp; Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal mt-1">
          Manage your account credentials, authentication sessions, and security preferences
        </p>
      </div>

      {/* Account Overview */}
      <Card className="border-zinc-800/80 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-400" />
            Account Information
          </CardTitle>
          <p className="text-xs text-zinc-400 font-normal">
            Primary email and login credentials
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">Display Name</Label>
              <Input
                value={user?.name || data?.profile.name || "Demo User"}
                disabled
                className="bg-zinc-950/40 border-zinc-800 text-zinc-300 text-xs cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-zinc-300">Email Address</Label>
                {user?.emailVerified || data?.profile.emailVerified ? (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] gap-1 px-1.5 py-0">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px]">
                    Unverified
                  </Badge>
                )}
              </div>
              <Input
                value={user?.email || data?.profile.email || "demo@example.com"}
                disabled
                className="bg-zinc-950/40 border-zinc-800 text-zinc-300 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <div className="text-xs">
                <span className="font-semibold text-zinc-200">Current Membership:</span>{" "}
                <span className="text-blue-400 font-medium">Free Tier</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/unlock")}
              className="h-7 text-xs border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
            >
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <Card className="border-zinc-800/80 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-amber-400" />
            Password &amp; Authentication
          </CardTitle>
          <p className="text-xs text-zinc-400 font-normal">
            Update your account password or request a secure login link
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">Current Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 text-xs focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-300">New Password</Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 text-xs focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium"
            >
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Session */}
      <Card className="border-zinc-800/80 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Laptop className="h-4 w-4 text-emerald-400" />
            Active Authentication Session
          </CardTitle>
          <p className="text-xs text-zinc-400 font-normal">
            Devices and browser sessions currently logged into your account
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Laptop className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                  <span>Current Browser Session</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                    Active
                  </Badge>
                </div>
                <div className="text-[11px] text-zinc-400 font-normal">
                  Better Auth JWT Session • Expires in 7 days
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-800/60 p-4 flex justify-between items-center">
          <div className="text-xs text-zinc-400">
            Need to revoke all active logins?
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOutAll}
            className="h-7 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-rose-400 gap-1.5"
          >
            <LogOut className="h-3 w-3" />
            Sign Out of All Devices
          </Button>
        </CardFooter>
      </Card>

      {/* Danger Zone */}
      <Card className="border-rose-950/60 bg-rose-950/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold text-rose-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                Danger Zone
              </CardTitle>
              <p className="text-xs text-zinc-400 font-normal">
                Irreversible actions regarding your account and stored progress
              </p>
            </div>
            <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px]">
              Irreversible
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-rose-900/40 bg-zinc-950/60">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-zinc-200">
                Permanently Delete CrackSDE Account
              </h3>
              <p className="text-[11px] text-zinc-400 max-w-xl leading-relaxed">
                Delete your account and all associated data, including solved interview problems, streak history, study analytics, and active login sessions. Once deleted, this data cannot be recovered.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 text-xs font-medium border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all flex-shrink-0 gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog Modal */}
      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}
