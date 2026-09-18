import type { PostSummary } from "@shared/blog-types";
import type { TocItem } from "@/components/blog/TableOfContents";

export type BlogPostPayload = PostSummary & {
  bodyHtml?: string;
  toc?: TocItem[];
  related?: PostSummary[];
};

declare global {
  interface Window {
    __BLOG_POSTS__?: PostSummary[];
    __BLOG_POST__?: BlogPostPayload;
  }
}

export {};
