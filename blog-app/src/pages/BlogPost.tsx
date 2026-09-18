import { CTA } from "@/components/blog/CTA";
import { PostMeta } from "@/components/blog/PostMeta";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SiteLayout } from "@/components/layout/SiteLayout";
import type { BlogPostPayload } from "@/types/global";

function getPost(initial?: BlogPostPayload | null): BlogPostPayload | null {
  if (initial) return initial;
  if (typeof window !== "undefined" && window.__BLOG_POST__) {
    return window.__BLOG_POST__;
  }
  return null;
}

export default function BlogPost({
  initialPost,
}: {
  initialPost?: BlogPostPayload | null;
}) {
  const post = getPost(initialPost);
  if (!post) {
    return (
      <SiteLayout>
        <p>Статья не найдена.</p>
      </SiteLayout>
    );
  }

  const canonical =
    post.canonicalUrl ?? `https://maxima-consulting.ru/blog/${post.slug}/`;
  const ogImage = post.ogImage ?? post.coverImage;
  const pageUrl = canonical;

  return (
    <SiteLayout>
      <nav className="text-sm text-[#6b7280] mb-6">
        <a href="https://maxima-consulting.ru/" className="hover:text-teal-300">Главная</a>
        <span className="mx-2">→</span>
        <a href="/blog/" className="hover:text-teal-300">Блог</a>
        <span className="mx-2">→</span>
        <span className="text-[#bfc2ba]">{post.title}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
        <article>
          <img
            src={post.coverImage}
            alt=""
            className="w-full max-h-[360px] object-cover rounded-xl mb-8"
            fetchPriority="high"
          />
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] mb-4">
            {post.title}
          </h1>
          <PostMeta post={post} />
          <div
            className="blog-prose mt-8"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml ?? "" }}
          />
          <div className="mt-8 lg:hidden">
            <CTA />
          </div>
          <div className="mt-8">
            <ShareButtons url={pageUrl} title={post.title} />
          </div>
        </article>
        <aside className="hidden lg:block self-start">
          <div className="sticky top-24 flex max-h-[calc(100vh-6.5rem)] flex-col gap-6">
            {post.toc && post.toc.length >= 3 && (
              <div className="min-h-0 overflow-y-auto overscroll-contain">
                <TableOfContents items={post.toc} />
              </div>
            )}
            <div className="shrink-0">
              <CTA />
            </div>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
