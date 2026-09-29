"use client";

import React, { useState } from "react";
import { Users, Plus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PostCard } from "./post-card";
import { CreatePostDialog } from "./create-post-dialog";
import type { PostItem, CommentItem } from "../types";

const INITIAL_POSTS: PostItem[] = [
  {
    id: "cp1",
    author: "Aman Sharma",
    avatar: "AS",
    title: "Google L4 Interview Experience (Onsite 2026)",
    company: "Google",
    role: "SDE II",
    content:
      "Covered 3 coding rounds + 1 system design. Round 1 was graph Dijkstra with edge weights. Round 2 was DP on intervals. Round 3 was LLD Rate Limiter with Token Bucket. Practicing patterns on Crack SDE made a huge difference!",
    upvotes: 48,
    timeAgo: "4h ago",
    comments: [
      {
        id: "cm1",
        author: "Rohan Gupta",
        avatar: "RG",
        content:
          "Did they ask concurrency handling for the Rate Limiter (e.g. Redis Lua scripts or atomic counters)?",
        timeAgo: "2h ago",
      },
      {
        id: "cm2",
        author: "Aman Sharma",
        avatar: "AS",
        content:
          "Yes! Specifically how to handle race conditions across multi-threaded workers with atomic CAS.",
        timeAgo: "1h ago",
      },
    ],
  },
  {
    id: "cp2",
    author: "Priya V",
    avatar: "PV",
    title: "Amazon SDE 1 Online Assessment & System Rounds",
    company: "Amazon",
    role: "SDE I",
    content:
      "Two coding questions on OA (Sliding Window & BFS grid). For the technical round, emphasis was placed on Leadership Principles alongside optimal complexity.",
    upvotes: 34,
    timeAgo: "1d ago",
    comments: [
      {
        id: "cm3",
        author: "Kavya S",
        avatar: "KS",
        content: "Congratulations! Which LP questions did they focus most on?",
        timeAgo: "18h ago",
      },
    ],
  },
  {
    id: "cp3",
    author: "Rohan Gupta",
    avatar: "RG",
    title: "How I planned my 60-Day Study Sprint for FAANG",
    company: "Microsoft",
    role: "Software Engineer",
    content:
      "Dedicated 4 hours/day following the Crack SDE curriculum. Mastered 16 DSA patterns first, then tackled DBMS indexing and OS deadlocks. Key is consistent daily practice!",
    upvotes: 92,
    timeAgo: "2d ago",
    comments: [],
  },
];

export function CommunityDiscussions() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>("cp1");
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  const handleUpvote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextUpvoted = !p.hasUpvoted;
          return {
            ...p,
            upvotes: nextUpvoted ? p.upvotes + 1 : p.upvotes - 1,
            hasUpvoted: nextUpvoted,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = (newCommentText[postId] || "").trim();
    if (!text) return;

    const newComment: CommentItem = {
      id: `cm-${Date.now()}`,
      author: "Rahul",
      avatar: "RA",
      content: text,
      timeAgo: "Just now",
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Comment added");
  };

  const handleCreatePost = (title: string, company: string, content: string) => {
    const newPost: PostItem = {
      id: `cp-${Date.now()}`,
      author: "Rahul",
      avatar: "RA",
      title,
      company,
      role: "Software Engineer",
      content,
      upvotes: 1,
      timeAgo: "Just now",
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    toast.success("Experience published to Community!");
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.company.toLowerCase().includes(query) ||
      p.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <Users className="h-3 w-3 text-blue-400" />
            <span>Community Feed</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            Interview Discussions &amp; Experiences
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Learn from verified interview rounds, system design questions, and prep tips shared by candidates.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsNewPostModalOpen(true)}
          className="h-8 px-3 text-[12px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Share Experience
        </Button>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search discussions by company (Google, Amazon), role, or topics (Dijkstra, Rate Limiter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-normal"
          />
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isCommentsExpanded={expandedCommentsPostId === post.id}
            onToggleComments={() =>
              setExpandedCommentsPostId((prev) => (prev === post.id ? null : post.id))
            }
            onUpvote={() => handleUpvote(post.id)}
            newCommentText={newCommentText[post.id] || ""}
            onCommentTextChange={(text) =>
              setNewCommentText((prev) => ({ ...prev, [post.id]: text }))
            }
            onAddComment={() => handleAddComment(post.id)}
            onShare={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard");
            }}
          />
        ))}
      </div>

      {/* Create Post Dialog Modal */}
      <CreatePostDialog
        isOpen={isNewPostModalOpen}
        onOpenChange={setIsNewPostModalOpen}
        onSubmitPost={handleCreatePost}
      />
    </div>
  );
}
