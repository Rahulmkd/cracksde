"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitPost: (title: string, company: string, content: string) => void;
}

export function CreatePostDialog({
  isOpen,
  onOpenChange,
  onSubmitPost,
}: CreatePostDialogProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");

  const handleReset = () => {
    setTitle("");
    setCompany("");
    setContent("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in the title and content.");
      return;
    }

    onSubmitPost(title.trim(), company.trim() || "Tech", content.trim());
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <div className="inline-flex items-center gap-1.5 text-blue-400 text-[11px] font-medium mb-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Community Feed</span>
          </div>
          <DialogTitle className="text-[16px] font-semibold text-zinc-100">
            Share Interview Experience
          </DialogTitle>
          <DialogDescription className="text-[12px] text-zinc-400">
            Post questions asked, round breakdown, or helpful preparation insights for fellow candidates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-zinc-200">Post Title *</label>
            <input
              type="text"
              placeholder="e.g. Meta E4 Onsite Experience & System Design Tips"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-zinc-200">Company (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Google, Microsoft, Uber, Startup"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-zinc-200">Details &amp; Questions *</label>
            <textarea
              placeholder="Breakdown the rounds, questions asked, complexity expectations, and key tips..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal resize-none"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-zinc-800/80 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleReset();
                onOpenChange(false);
              }}
              className="h-8 px-3 text-[12px] border-zinc-800 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium shadow-sm"
            >
              Publish Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
