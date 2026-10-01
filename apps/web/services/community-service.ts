import { api } from "./api-client";
import type { ApiResponse } from "@cracksde/shared";

export interface CommunityComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timeAgo: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  company: string;
  role: string;
  content: string;
  upvotes: number;
  comments: CommunityComment[];
  timeAgo: string;
  hasUpvoted?: boolean;
}

export interface CreatePostInput {
  title: string;
  company: string;
  role?: string;
  content: string;
}

export interface AddCommentInput {
  author?: string;
  content: string;
}

export const communityService = {
  /**
   * Fetch all community posts with upvotes and threaded comments
   */
  async getPosts(): Promise<CommunityPost[]> {
    // In current frontend-mocked or future backend persistence
    const res = await api.get<ApiResponse<CommunityPost[]>>("/api/community/posts").catch(() => null);
    if (res?.success && res.data) {
      return res.data;
    }
    // Default seed fallback
    return [
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
    ];
  },

  /**
   * Create a new interview experience share post
   */
  async createPost(input: CreatePostInput): Promise<CommunityPost> {
    const res = await api.post<ApiResponse<CommunityPost>>("/api/community/posts", input).catch(() => null);
    if (res?.success && res.data) {
      return res.data;
    }
    return {
      id: `cp-${Date.now()}`,
      author: "Rahul",
      avatar: "RA",
      title: input.title.trim(),
      company: input.company.trim() || "General",
      role: input.role || "Software Engineer",
      content: input.content.trim(),
      upvotes: 1,
      comments: [],
      timeAgo: "Just now",
      hasUpvoted: true,
    };
  },

  /**
   * Toggle upvote status on a post
   */
  async upvotePost(postId: string): Promise<{ success: boolean; upvotes: number }> {
    const res = await api.post<ApiResponse<{ upvotes: number }>>(`/api/community/posts/${postId}/upvote`).catch(() => null);
    if (res?.success && res.data) {
      return { success: true, upvotes: res.data.upvotes };
    }
    return { success: true, upvotes: 1 };
  },

  /**
   * Add a threaded reply comment to a post
   */
  async addComment(postId: string, input: AddCommentInput): Promise<CommunityComment> {
    const res = await api.post<ApiResponse<CommunityComment>>(`/api/community/posts/${postId}/comments`, input).catch(() => null);
    if (res?.success && res.data) {
      return res.data;
    }
    return {
      id: `cm-${Date.now()}`,
      author: input.author || "Rahul",
      avatar: "RA",
      content: input.content.trim(),
      timeAgo: "Just now",
    };
  },
};
