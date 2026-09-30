import React from "react";
import { renderToString } from "react-dom/server";
import { mdxComponents } from "../src/lib/mdx-components";
import type { TocItem } from "../src/components/blog/TableOfContents";
import type { BlogPostPayload } from "../src/types/global";
import type { PostSummary } from "../shared/blog-types";
import { loadPostBySlug, relatedPosts } from "./blog-server";

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const re = /^(#{2,3})\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) {
    const level = m[1].length;
    const text = m[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-");
    items.push({ id, text, level });
  }
  return items;
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addHeadingIds(html: string, toc: TocItem[]): string {
  let out = html;
  for (const item of toc) {
    const re = new RegExp(
      `<h${item.level}>([^<]*${escapeReg(item.text.slice(0, 20))}[^<]*)</h${item.level}>`,
      "i",
    );
    out = out.replace(
      re,
      `<h${item.level} id="${item.id}">$1</h${item.level}>`,
    );
  }
  return out;
}

export async function buildBlogPostPayload(
  slug: string,
  allPosts: PostSummary[],
): Promise<BlogPostPayload | null> {
  const post = await loadPostBySlug(slug);
  if (!post?.mdxModule) return null;

  const toc = extractToc(post.content);
  const Content = post.mdxModule;
  let bodyHtml = renderToString(
    React.createElement(Content, { components: mdxComponents }),
  );
  bodyHtml = addHeadingIds(bodyHtml, toc);

  return {
    ...post,
    bodyHtml,
    toc,
    related: relatedPosts(allPosts, post),
  };
}

export { serializeForInlineScript } from "./blog-summaries";
