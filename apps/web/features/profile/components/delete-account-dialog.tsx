"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, Loader2, ShieldAlert } from "lucide-react";
import { useDeleteAccount } from "../hooks/use-profile";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const deleteAccountMutation = useDeleteAccount();

  const isConfirmed = confirmationInput.trim().toUpperCase() === "DELETE";

  const handleDelete = async () => {
    if (!isConfirmed || deleteAccountMutation.isPending) return;

    try {
      await deleteAccountMutation.mutateAsync();
      onOpenChange(false);
    } catch {
      // Handled by toast in useDeleteAccount
    }
  };

  const handleClose = () => {
    if (deleteAccountMutation.isPending) return;
    setConfirmationInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-rose-950/60 bg-zinc-950 text-zinc-100 p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-rose-400">
                Delete Account Permanently
              </DialogTitle>
              <span className="text-[11px] text-zinc-400">
                This action is destructive and cannot be undone
              </span>
            </div>
          </div>
          <DialogDescription className="text-xs text-zinc-300 leading-relaxed pt-1">
            Are you sure you want to delete your CrackSDE account? Once confirmed, all your data will be permanently wiped from our database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Warning Points */}
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
              <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              What will be permanently erased:
            </div>
            <ul className="text-[11px] text-zinc-400 space-y-1.5 pl-5 list-disc">
              <li>All solved problem logs, code submissions, and difficulty history</li>
              <li>Your preparation streak, study points, and curriculum progress</li>
              <li>Scheduled spaced repetition revisions and custom study targets</li>
              <li>Your developer profile bio, career aspirations, and social links</li>
              <li>Active authentication sessions and login credentials</li>
            </ul>
          </div>

          {/* Type to Confirm Field */}
          <div className="space-y-2">
            <Label htmlFor="confirm-delete" className="text-xs font-medium text-zinc-300">
              To proceed, type <span className="font-mono font-bold text-rose-400">DELETE</span> below:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              disabled={deleteAccountMutation.isPending}
              className="bg-zinc-900/80 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:ring-rose-500"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-zinc-850">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteAccountMutation.isPending}
            className="w-full sm:w-auto h-8 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed || deleteAccountMutation.isPending}
            className="w-full sm:w-auto h-8 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteAccountMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting Account...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Permanently Delete Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
