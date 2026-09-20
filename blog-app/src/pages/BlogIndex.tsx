import { useMemo } from "react";
import { PostCard } from "@/components/blog/PostCard";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { postsSnapshot } from "@/lib/blog-data";
import type { PostSummary } from "@shared/blog-types";

const PAGE_SIZE = 10;

function getPosts(initial?: PostSummary[]): PostSummary[] {
  if (initial?.length) return initial;
  if (typeof window !== "undefined" && window.__BLOG_POSTS__?.length) {
    return window.__BLOG_POSTS__;
  }
  return postsSnapshot;
}

export default function BlogIndex({
  initialPosts,
  ssrSearch = "",
}: {
  initialPosts?: PostSummary[];
  ssrSearch?: string;
}) {
  const search =
    typeof window !== "undefined"
      ? window.location.search.replace(/^\?/, "")
      : ssrSearch;
  const params = new URLSearchParams(search);
  const category = params.get("category");
  const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);

  const { items, totalPages, categories } = useMemo(() => {
    const all = getPosts(initialPosts);
    const filtered = category
      ? all.filter((p) => p.category === category)
      : all;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    const cats = [...new Set(all.map((p) => p.category))].sort();
    return {
      items: filtered.slice(start, start + PAGE_SIZE),
      totalPages,
      categories: cats,
      safePage,
    };
  }, [category, page, initialPosts]);

  const safePage = Math.min(page, totalPages);

  return (
    <SiteLayout>
      <h1 className="text-4xl font-bold font-[family-name:var(--font-display)] mb-3">
        Статьи
      </h1>
      <p className="text-[#898e87] max-w-2xl mb-8">
        Разборы налоговых изменений, управленческого учёта и решений для собственников.
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/blog/"
          className={`text-sm px-3 py-1 rounded-full border ${!category ? "border-teal-500 text-teal-200" : "border-[var(--line)] text-[#9da29b]"}`}
        >
          Все
        </a>
        {categories.map((c) => (
          <a
            key={c}
            href={`/blog/?category=${encodeURIComponent(c)}`}
            className={`text-sm px-3 py-1 rounded-full border ${category === c ? "border-teal-500 text-teal-200" : "border-[var(--line)] text-[#9da29b]"}`}
          >
            {c}
          </a>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-10 text-sm">
          {safePage > 1 && (
            <a
              href={`/blog/?page=${safePage - 1}${category ? `&category=${encodeURIComponent(category)}` : ""}`}
              className="text-teal-300"
            >
              ← Назад
            </a>
          )}
          <span className="text-[#6b7280]">
            {safePage} / {totalPages}
          </span>
          {safePage < totalPages && (
            <a
              href={`/blog/?page=${safePage + 1}${category ? `&category=${encodeURIComponent(category)}` : ""}`}
              className="text-teal-300"
            >
              Вперёд →
            </a>
          )}
        </div>
      )}
    </SiteLayout>
  );
}
