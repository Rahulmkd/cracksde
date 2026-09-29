"use client";

import React from "react";
import { Send, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CommentItem } from "../types";

interface CommentsThreadProps {
  comments: CommentItem[];
  postId: string;
  newCommentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: () => void;
}

export function CommentsThread({
  comments,
  newCommentText,
  onCommentTextChange,
  onAddComment,
}: CommentsThreadProps) {
  return (
    <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-4 space-y-3.5">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5 text-[12px]">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-300">
                {c.avatar}
              </div>
              <div className="flex-1 rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200">{c.author}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{c.timeAgo}</span>
                </div>
                <p className="text-zinc-300 text-[12px] leading-relaxed font-normal">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Reply Input */}
      <div className="flex items-center gap-2 pt-1">
        <CornerDownRight className="h-4 w-4 text-zinc-500 shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Write a reply or follow-up question..."
          value={newCommentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAddComment();
            }
          }}
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
        />
        <Button
          size="sm"
          onClick={onAddComment}
          className="h-8 px-3 text-[12px] bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
        >
          <Send className="h-3 w-3 mr-1" /> Reply
        </Button>
      </div>
    </div>
  );
}
