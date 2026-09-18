import type { PostSummary } from "@shared/blog-types";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group flex flex-col rounded-xl border border-[var(--line)] bg-[#111313] overflow-hidden hover:border-teal-500/40 transition-colors">
      <a href={`/blog/${post.slug}/`} className="block">
        <img
          src={post.coverImage}
          alt=""
          className="h-44 w-full object-cover"
          loading="lazy"
        />
        <div className="p-5 flex flex-col gap-2 flex-1">
          <span className="text-xs uppercase tracking-wider text-teal-300/90">
            {post.category}
          </span>
          <h2 className="text-xl font-semibold font-[family-name:var(--font-display)] group-hover:text-teal-200">
            {post.title}
          </h2>
          <p className="text-sm text-[#898e87] line-clamp-3">{post.description}</p>
          <p className="mt-auto pt-3 text-xs text-[#6b7280]">
            {post.date} · {post.readingTimeMinutes} мин
          </p>
        </div>
      </a>
    </article>
  );
}
