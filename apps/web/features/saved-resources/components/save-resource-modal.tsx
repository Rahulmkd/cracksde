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
import { Link2, Loader2, AlertCircle } from "lucide-react";
import { useSaveResource } from "../hooks/use-saved-resources";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface SaveResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveResourceModal({ open, onOpenChange }: SaveResourceModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [url, setUrl] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const saveMutation = useSaveResource(() => {
    setUrl("");
    setClientError(null);
    onOpenChange(false);
  });

  const validateUrl = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setClientError("URL is required");
      return false;
    }

    try {
      const toTest =
        trimmed.startsWith("http://") || trimmed.startsWith("https://")
          ? trimmed
          : `https://${trimmed}`;
      const parsed = new URL(toTest);
      if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname.includes(".")) {
        setClientError("Please enter a valid web URL (e.g. https://leetcode.com)");
        return false;
      }
      setClientError(null);
      return true;
    } catch {
      setClientError("Please enter a valid web URL");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      onOpenChange(false);
      router.push("/login");
      return;
    }

    if (!validateUrl(url)) {
      return;
    }

    setClientError(null);
    saveMutation.mutate(url.trim());
  };

  const handleClose = (newOpen: boolean) => {
    if (!saveMutation.isPending) {
      setClientError(null);
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Link2 className="h-4 w-4" />
            </div>
            <DialogTitle className="text-[17px] font-semibold text-zinc-100">
              Save Resource Link
            </DialogTitle>
          </div>
          <DialogDescription className="text-[13px] text-zinc-400 leading-normal">
            Paste any URL to save it to your curated resources. We&apos;ll automatically extract the
            page title, domain, and favicon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="resource-url" className="text-[12px] font-medium text-zinc-300">
              Resource URL <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Input
                id="resource-url"
                type="text"
                autoFocus
                placeholder="https://leetcode.com/problems/..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (clientError) setClientError(null);
                }}
                disabled={saveMutation.isPending}
                className="h-10 border-zinc-800 bg-zinc-900/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-blue-500 text-[13px]"
              />
            </div>

            {clientError && (
              <div className="flex items-center gap-1.5 text-[11px] text-red-400 pt-1">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{clientError}</span>
              </div>
            )}

            {saveMutation.isError && !clientError && (
              <div className="flex items-center gap-1.5 text-[11px] text-red-400 pt-1">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{saveMutation.error?.message || "Failed to extract or save URL."}</span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saveMutation.isPending}
              onClick={() => handleClose(false)}
              className="border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 h-9 text-[12px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saveMutation.isPending || !url.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium h-9 px-4 text-[12px] shadow-sm"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Extracting & Saving...</span>
                </>
              ) : (
                <span>Save Link</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
