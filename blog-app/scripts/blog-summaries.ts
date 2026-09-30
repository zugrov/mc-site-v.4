import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  postFrontmatterSchema,
  type PostSummary,
} from "../shared/blog-types";

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

export function serializeForInlineScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Slug из URL dev-сервера: /blog/my-slug/ или /blog/my-slug */
export function slugFromBlogRequestUrl(url?: string): string | null {
  if (!url) return null;
  const pathOnly = url.split("?")[0].replace(/\/$/, "");
  const m = pathOnly.match(/\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  return m?.[1] ?? null;
}
