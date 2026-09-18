import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import BlogIndex from "../src/pages/BlogIndex";
import BlogPost from "../src/pages/BlogPost";
import { mdxComponents } from "../src/lib/mdx-components";
import { indexHead, postHead } from "./seo-head";
import type { TocItem } from "../src/components/blog/TableOfContents";
import {
  loadPostBySlug,
  loadPostSummaries,
  relatedPosts,
} from "./blog-server";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(repoRoot, "blog");

function extractToc(markdown: string): TocItem[] {
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

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function renderRoute(
  injectScript: string,
  template: string,
  headExtra: string,
  page: React.ReactElement,
) {
  const body = renderToString(page);

  let html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div>`,
  );
  html = html.replace("</head>", `${headExtra}</head>`);
  html = html.replace(
    "</body>",
    `<script>${injectScript}</script></body>`,
  );
  return html;
}

async function main() {
  const viteTemplate = fs.readFileSync(path.join(outDir, "index.html"), "utf-8");
  const posts = loadPostSummaries();
  const postsJson = JSON.stringify(posts).replace(/</g, "\\u003c");

  const indexHtml = await renderRoute(
    `window.__BLOG_POSTS__=${postsJson};`,
    viteTemplate,
    indexHead(),
    <BlogIndex initialPosts={posts} />,
  );
  fs.writeFileSync(path.join(outDir, "index.html"), indexHtml, "utf-8");

  for (const summary of posts) {
    const post = await loadPostBySlug(summary.slug);
    if (!post?.mdxModule) continue;

    const toc = extractToc(post.content);
    const Content = post.mdxModule!;
    let bodyHtml = renderToString(
      <Content components={mdxComponents} />,
    );
    bodyHtml = addHeadingIds(bodyHtml, toc);

    const related = relatedPosts(posts, summary);
    const payload = {
      ...summary,
      bodyHtml,
      toc,
      related,
    };
    const script = `window.__BLOG_POST__=${JSON.stringify(payload).replace(/</g, "\\u003c")};window.__BLOG_POSTS__=${postsJson};`;

    const slugDir = path.join(outDir, summary.slug);
    fs.mkdirSync(slugDir, { recursive: true });
    const html = await renderRoute(script, viteTemplate, postHead(summary), (
      <BlogPost initialPost={payload} />
    ));
    fs.writeFileSync(path.join(slugDir, "index.html"), html, "utf-8");
  }

  console.log(`Prerendered blog: ${posts.length} posts → ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
