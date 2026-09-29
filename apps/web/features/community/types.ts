export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timeAgo: string;
}

export interface PostItem {
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
