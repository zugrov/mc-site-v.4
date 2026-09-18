import type { PostSummary } from "@shared/blog-types";
import { PostCard } from "./PostCard";

export function RelatedPosts({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-16 border-t border-[var(--line)] pt-12">
      <h2 className="text-2xl font-semibold font-[family-name:var(--font-display)] mb-6">
        Похожие статьи
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
