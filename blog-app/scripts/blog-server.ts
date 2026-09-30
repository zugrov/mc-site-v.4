import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXModule } from "mdx/types";
import { postFrontmatterSchema, type PostFull } from "../shared/blog-types";
import { mdxRemarkPlugins } from "../shared/mdx-remark-plugins";
import {
  CONTENT_DIR,
  loadPostSummaries,
  readingTimeMinutes,
} from "./blog-summaries";

export { CONTENT_DIR, loadPostSummaries, readingTimeMinutes };

function listMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export async function loadPostBySlug(slug: string): Promise<PostFull | null> {
  for (const file of listMdxFiles()) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    if (data.slug !== slug) continue;
    const parsed = postFrontmatterSchema.parse(data);
    if (parsed.draft) return null;
    const minutes = parsed.readingTimeMinutes ?? readingTimeMinutes(content);
    const mod = (await evaluate(content, {
      ...runtime,
      baseUrl: import.meta.url,
      remarkPlugins: mdxRemarkPlugins,
    })) as MDXModule;
    return {
      ...parsed,
      readingTimeMinutes: minutes,
      content,
      mdxModule: mod.default,
    };
  }
  return null;
}

export function filterPosts(
  posts: ReturnType<typeof loadPostSummaries>,
  category?: string | null,
) {
  if (!category) return posts;
  return posts.filter((p) => p.category === category);
}

export function paginatePosts(
  posts: ReturnType<typeof loadPostSummaries>,
  page: number,
  pageSize = 10,
) {
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: posts.slice(start, start + pageSize),
    totalPages,
    page: safePage,
  };
}

export function relatedPosts(
  posts: ReturnType<typeof loadPostSummaries>,
  current: (ReturnType<typeof loadPostSummaries>)[number],
  limit = 3,
) {
  const scored = posts
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const tagOverlap = p.tags.filter((t) => current.tags.includes(t)).length;
      const cat = p.category === current.category ? 2 : 0;
      return { p, score: tagOverlap + cat };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (scored.length >= limit) return scored.slice(0, limit).map((x) => x.p);
  const rest = posts.filter(
    (p) => p.slug !== current.slug && !scored.some((s) => s.p.slug === p.slug),
  );
  return [...scored.map((x) => x.p), ...rest].slice(0, limit);
}
