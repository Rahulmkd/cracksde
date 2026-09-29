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
  Send,
  CornerDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timeAgo: string;
}

interface PostItem {
  id: string;
  author: string;
  avatar: string;
  title: string;
  company: string;
  role: string;
  content: string;
  upvotes: number;
  comments: CommentItem[];
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
      content: "Covered 3 coding rounds + 1 system design. Round 1 was graph Dijkstra with edge weights. Round 2 was DP on intervals. Round 3 was LLD Rate Limiter with Token Bucket. Practicing patterns on Crack SDE made a huge difference!",
      upvotes: 48,
      timeAgo: "4h ago",
      comments: [
        {
          id: "cm1",
          author: "Rohan Gupta",
          avatar: "RG",
          content: "Did they ask concurrency handling for the Rate Limiter (e.g. Redis Lua scripts or atomic counters)?",
          timeAgo: "2h ago",
        },
        {
          id: "cm2",
          author: "Aman Sharma",
          avatar: "AS",
          content: "Yes! Specifically how to handle race conditions across multi-threaded workers with atomic CAS.",
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
      content: "Two coding questions on OA (Sliding Window & BFS grid). For the technical round, emphasis was placed on Leadership Principles alongside optimal complexity.",
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
      content: "Dedicated 4 hours/day following the Crack SDE curriculum. Mastered 16 DSA patterns first, then tackled DBMS indexing and OS deadlocks. Key is consistent daily practice!",
      upvotes: 92,
      timeAgo: "2d ago",
      comments: [],
    },
  ]);

  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>("cp1");
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});
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
      comments: [],
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
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
            <Users className="h-3 w-3 text-blue-400" />
            <span>Candidate Network &amp; Discussions</span>
          </div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-zinc-100">
            Interview Discussions &amp; Loops
          </h1>
          <p className="text-[12px] font-normal leading-normal text-zinc-400">
            Connect with peers, share recent interview loops, and discuss tricky design questions.
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
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search interview experiences by company (Google, Amazon, Meta) or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-9 pr-3.5 py-1.5 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 font-normal"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3.5">
        {filteredPosts.map((post) => {
          const isCommentsExpanded = expandedCommentsPostId === post.id;
          return (
            <div
              key={post.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 hover:border-zinc-700/80 transition-all duration-200 shadow-subtle"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 text-[11px] font-semibold text-blue-400">
                    {post.avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-zinc-200">{post.author}</div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-normal">
                      <span>{post.role}</span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" /> {post.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge variant="blue" className="text-[11px] font-medium py-0 px-2">
                  <Building2 className="h-3 w-3 mr-1" /> {post.company}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-[14px] font-semibold leading-snug text-zinc-100">
                  {post.title}
                </h3>
                <p className="text-[12px] font-normal text-zinc-400 leading-normal">{post.content}</p>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60 text-[12px] text-zinc-400">
                <button
                  type="button"
                  onClick={() => handleUpvote(post.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors text-[12px] font-medium",
                    post.hasUpvoted
                      ? "text-blue-400 bg-blue-500/10 font-semibold"
                      : "hover:text-zinc-200 hover:bg-zinc-800/50"
                  )}
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>{post.upvotes} Upvotes</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedCommentsPostId((prev) => (prev === post.id ? null : post.id))
                  }
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors text-[12px] font-medium",
                    isCommentsExpanded
                      ? "text-blue-400 bg-blue-500/10"
                      : "hover:text-zinc-200 hover:bg-zinc-800/50"
                  )}
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>{post.comments.length} Comments</span>
                </button>
              </div>

              {/* Interactive Collapsible Comments Thread */}
              {isCommentsExpanded && (
                <div className="pt-2 border-t border-zinc-800/60 space-y-2.5 animate-in fade-in-0 duration-150">
                  {post.comments.length > 0 ? (
                    <div className="space-y-2 pl-2 border-l-2 border-zinc-800">
                      {post.comments.map((cm) => (
                        <div key={cm.id} className="text-[12px] space-y-0.5 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/60">
                          <div className="flex items-center justify-between text-[11px] text-zinc-400">
                            <span className="font-semibold text-zinc-300">{cm.author}</span>
                            <span className="font-mono text-zinc-500">{cm.timeAgo}</span>
                          </div>
                          <p className="text-zinc-300 font-normal leading-normal">{cm.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-500 italic pl-1">
                      No comments yet. Start the conversation below!
                    </div>
                  )}

                  {/* Add Comment Input Form */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a reply or ask a question..."
                      value={newCommentText[post.id] || ""}
                      onChange={(e) =>
                        setNewCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(post.id);
                        }
                      }}
                      className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(post.id)}
                      className="h-7 px-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px]"
                    >
                      <Send className="h-3 w-3 mr-1" /> Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Share Modal */}
      <Dialog open={isNewPostModalOpen} onOpenChange={setIsNewPostModalOpen}>
        <DialogContent className="max-w-lg bg-zinc-950">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-[15px] font-semibold leading-snug">Share Interview Experience</DialogTitle>
            <DialogDescription className="text-[12px] text-zinc-400 leading-normal">
              Help the community by sharing the rounds, question topics, and helpful prep suggestions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Post Title</label>
              <input
                type="text"
                placeholder="e.g. Meta SDE II Interview Experience - Full Loop"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Company</label>
              <input
                type="text"
                placeholder="e.g. Google, Amazon, Microsoft, Uber"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-zinc-200">Experience Details &amp; Questions</label>
              <textarea
                placeholder="Describe the interview format, coding questions asked, and key advice..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-100 focus:outline-none focus:border-blue-500 font-normal"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewPostModalOpen(false)}
              className="text-[12px] font-medium h-7"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreatePost}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-medium h-7"
            >
              Publish Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
