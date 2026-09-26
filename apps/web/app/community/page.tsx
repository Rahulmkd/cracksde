"use client";

import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Search,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface PostItem {
  id: string;
  author: string;
  avatar: string;
  title: string;
  company: string;
  role: string;
  content: string;
  upvotes: number;
  comments: number;
  timeAgo: string;
  hasUpvoted?: boolean;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: "cp1",
      author: "Aman Sharma",
      avatar: "AS",
      title: "Google L4 Interview Experience (Onsite 2026)",
      company: "Google",
      role: "SDE II",
      content: "Covered 3 coding rounds + 1 system design. Round 1 was graph Dijkstra with edge weights. Round 2 was DP on intervals. Round 3 was LLD Rate Limiter with Token Bucket.",
      upvotes: 48,
      comments: 12,
      timeAgo: "4h ago",
    },
    {
      id: "cp2",
      author: "Priya V",
      avatar: "PV",
      title: "Amazon SDE 1 Online Assessment & System Rounds",
      company: "Amazon",
      role: "SDE I",
      content: "Two coding questions on OA (Sliding Window & BFS grid). For the technical round, emphasis was placed on Leadership Principles alongside optimal complexity.",
      upvotes: 34,
      comments: 8,
      timeAgo: "1d ago",
    },
    {
      id: "cp3",
      author: "Rohan Gupta",
      avatar: "RG",
      title: "How I planned my 60-Day Study Sprint for FAANG",
      company: "Microsoft",
      role: "Software Engineer",
      content: "Dedicated 4 hours/day following the Crack SDE curriculum. Mastered 16 DSA patterns first, then tackled DBMS indexing and OS deadlocks. Key is consistent daily practice!",
      upvotes: 92,
      comments: 21,
      timeAgo: "2d ago",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newContent, setNewContent] = useState("");

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

  const handleCreatePost = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please provide a title and details");
      return;
    }
    const newPost: PostItem = {
      id: `cp-${Date.now()}`,
      author: "Rahul",
      avatar: "RA",
      title: newTitle.trim(),
      company: newCompany.trim() || "General",
      role: "Software Engineer",
      content: newContent.trim(),
      upvotes: 1,
      comments: 0,
      timeAgo: "Just now",
      hasUpvoted: true,
    };
    setPosts((prev) => [newPost, ...prev]);
    toast.success("Post shared with community");
    setIsNewPostModalOpen(false);
    setNewTitle("");
    setNewCompany("");
    setNewContent("");
  };

  const filteredPosts = posts.filter(
    (p) =>
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[12px] font-medium text-zinc-300 uppercase tracking-wider">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            <span>Community Discussions</span>
          </div>
          <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-zinc-100">
            Candidate Network &amp; Experiences
          </h1>
          <p className="text-[13px] font-normal leading-[1.45] text-zinc-400">
            Connect with peers, share recent interview experiences, and discuss tricky technical problems.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsNewPostModalOpen(true)}
          className="h-8 px-3.5 text-[13px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Share Experience
        </Button>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search interview experiences by company, title, or keywords (e.g. Google, Amazon, LLD)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3.5 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 text-[12px] font-semibold text-blue-400">
                  {post.avatar}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-zinc-200">{post.author}</div>
                  <div className="text-[12px] text-zinc-500 flex items-center gap-1.5 font-normal">
                    <span>{post.role}</span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.timeAgo}
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant="blue" className="text-[12px] font-medium">
                <Building2 className="h-3 w-3 mr-1" /> {post.company}
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold leading-[1.35] text-zinc-100">
                {post.title}
              </h3>
              <p className="text-[13px] font-normal text-zinc-400 leading-[1.45]">{post.content}</p>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/60 text-[13px] text-zinc-400">
              <button
                type="button"
                onClick={() => handleUpvote(post.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-[13px] font-medium ${
                  post.hasUpvoted
                    ? "text-blue-400 bg-blue-500/10"
                    : "hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{post.upvotes} Upvotes</span>
              </button>

              <button
                type="button"
                onClick={() => toast.info("Opening comments section")}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-[13px] font-medium"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{post.comments} Comments</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      <Dialog open={isNewPostModalOpen} onOpenChange={setIsNewPostModalOpen}>
        <DialogContent className="max-w-lg bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold leading-[1.3]">Share Interview Experience</DialogTitle>
            <DialogDescription className="text-[13px] text-zinc-400 leading-[1.45]">
              Help the community by sharing the rounds, question topics, and helpful prep suggestions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-200">Post Title</label>
              <input
                type="text"
                placeholder="e.g. Meta SDE II Interview Experience - Full Loop"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-200">Company</label>
              <input
                type="text"
                placeholder="e.g. Google, Amazon, Microsoft, Uber"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-200">Experience Details &amp; Questions</label>
              <textarea
                placeholder="Describe the interview format, coding questions asked, and key advice..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewPostModalOpen(false)}
              className="text-[13px] font-medium h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreatePost}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium h-8"
            >
              Publish Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
