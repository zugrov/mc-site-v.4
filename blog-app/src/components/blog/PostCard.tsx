import type { PostSummary } from "@shared/blog-types";

function CoverMark({ label }: { label: string }) {
  return (
    <div className="cover-mark" aria-hidden="true">
      <span>{label}</span>
      <svg viewBox="0 0 320 48" className="cover-mark__line">
        <path
          d="M0 36 C40 36 48 8 88 14 S150 42 190 22 260 6 320 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group flex flex-col rounded-xl border border-[var(--line)] bg-[#111313] overflow-hidden hover:border-teal-500/40 transition-colors">
      <a href={`/blog/${post.slug}/`} className="block">
        <CoverMark label={post.category} />
        <div className="p-5 flex flex-col gap-2 flex-1">
          <span className="text-xs uppercase tracking-wider text-teal-300/90">
            {post.category}
          </span>
          <h2 className="text-xl font-semibold font-[family-name:var(--font-display)] group-hover:text-teal-200">
            {post.title}
          </h2>
          <p className="text-sm text-[#898e87] line-clamp-3">{post.description}</p>
          <p className="mt-auto pt-3 text-xs text-[#a8a59c]">
            {post.date} · {post.readingTimeMinutes} мин
          </p>
        </div>
      </a>
    </article>
  );
}
