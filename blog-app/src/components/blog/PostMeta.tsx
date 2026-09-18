import type { PostSummary } from "@shared/blog-types";

export function PostMeta({ post }: { post: PostSummary }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#9da29b]">
      <span>{post.author}</span>
      <span>{post.date}</span>
      <span>{post.readingTimeMinutes} мин чтения</span>
      <span>{post.category}</span>
    </div>
  );
}
