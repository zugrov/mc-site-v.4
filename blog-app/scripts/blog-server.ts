import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXModule } from "mdx/types";
import {
  postFrontmatterSchema,
  type PostFull,
  type PostSummary,
} from "../shared/blog-types";
import { mdxRemarkPlugins } from "../shared/mdx-remark-plugins";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const CONTENT_DIR = path.join(repoRoot, "content", "blog");

export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function listMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export function loadPostSummaries(): PostSummary[] {
  const posts: PostSummary[] = [];
  for (const file of listMdxFiles()) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const parsed = postFrontmatterSchema.parse(data);
    if (parsed.draft) continue;
    const minutes =
      parsed.readingTimeMinutes ?? readingTimeMinutes(content);
    posts.push({ ...parsed, readingTimeMinutes: minutes });
  }
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
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
  posts: PostSummary[],
  category?: string | null,
): PostSummary[] {
  if (!category) return posts;
  return posts.filter((p) => p.category === category);
}

export function paginatePosts(
  posts: PostSummary[],
  page: number,
  pageSize = 10,
): { items: PostSummary[]; totalPages: number; page: number } {
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
  posts: PostSummary[],
  current: PostSummary,
  limit = 3,
): PostSummary[] {
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
