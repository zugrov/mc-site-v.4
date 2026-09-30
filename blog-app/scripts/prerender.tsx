import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import BlogIndex from "../src/pages/BlogIndex";
import BlogPost from "../src/pages/BlogPost";
import { indexHead, postHead } from "./seo-head";
import {
  buildBlogPostPayload,
  serializeForInlineScript,
} from "./blog-post-payload";
import { loadPostSummaries } from "./blog-server";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(repoRoot, "blog");

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
  const postsJson = serializeForInlineScript(posts);

  const indexHtml = await renderRoute(
    `window.__BLOG_POSTS__=${postsJson};`,
    viteTemplate,
    indexHead(),
    <BlogIndex initialPosts={posts} />,
  );
  fs.writeFileSync(path.join(outDir, "index.html"), indexHtml, "utf-8");

  for (const summary of posts) {
    const payload = await buildBlogPostPayload(summary.slug, posts);
    if (!payload) continue;

    const script = `window.__BLOG_POST__=${serializeForInlineScript(payload)};window.__BLOG_POSTS__=${postsJson};`;

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
