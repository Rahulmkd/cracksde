"use client";

import React from "react";
import { MessageSquare, ThumbsUp, Share2, Building2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommentsThread } from "./comments-thread";
import type { PostItem } from "../types";

interface PostCardProps {
  post: PostItem;
  isCommentsExpanded: boolean;
  onToggleComments: () => void;
  onUpvote: () => void;
  newCommentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: () => void;
  onShare: () => void;
}

export function PostCard({
  post,
  isCommentsExpanded,
  onToggleComments,
  onUpvote,
  newCommentText,
  onCommentTextChange,
  onAddComment,
  onShare,
}: PostCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-subtle hover:border-zinc-700/80 transition-all duration-200">
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Post Author & Company Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-[11px] shadow-sm">
              {post.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-100 text-[13px]">{post.author}</span>
                <span className="text-zinc-600 text-[11px]">&middot;</span>
                <span className="text-[11px] text-zinc-400 font-medium">{post.role}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-0.5">
                <Clock className="h-3 w-3" />
                <span>{post.timeAgo}</span>
              </div>
            </div>
          </div>

          <Badge variant="blue" className="text-[11px] font-medium py-0.5 px-2 flex items-center gap-1 font-sans">
            <Building2 className="h-3 w-3" /> {post.company}
          </Badge>
        </div>

        {/* Post Title & Content */}
        <div className="space-y-1.5">
          <h2 className="text-[15px] sm:text-[16px] font-semibold text-zinc-100 leading-snug tracking-tight">
            {post.title}
          </h2>
          <p className="text-[12px] sm:text-[13px] text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80 text-[12px]">
          <Button
            size="sm"
            variant="outline"
            onClick={onUpvote}
            className={cn(
              "h-7 px-2.5 text-[11px] font-medium transition-colors",
              post.hasUpvoted
                ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
            )}
          >
            <ThumbsUp className={cn("h-3 w-3 mr-1.5", post.hasUpvoted && "fill-blue-400")} />
            <span>{post.upvotes} Helpful</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleComments}
            className="h-7 px-2.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <MessageSquare className="h-3 w-3 mr-1.5" />
            <span>{post.comments.length} Comments</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onShare}
            className="h-7 px-2 text-[11px] text-zinc-500 hover:text-zinc-300 ml-auto"
            title="Share discussion"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Expanded Comments Thread */}
      {isCommentsExpanded && (
        <CommentsThread
          comments={post.comments}
          postId={post.id}
          newCommentText={newCommentText}
          onCommentTextChange={onCommentTextChange}
          onAddComment={onAddComment}
        />
      )}
    </div>
  );
}
