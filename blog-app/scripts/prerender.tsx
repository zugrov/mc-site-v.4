import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import BlogIndex from "../src/pages/BlogIndex";
import BlogPost from "../src/pages/BlogPost";
import { indexHead, postHead } from "./seo-head";
import { buildBlogPostPayload } from "./blog-post-payload";
import { loadPostSummaries } from "./blog-server";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(repoRoot, "blog");

function stylesheetFile(href: string): string | null {
  const rel = href.split("?")[0];
  if (!rel.startsWith("/")) return null;
  const file = path.join(repoRoot, rel);
  return fs.existsSync(file) ? file : null;
}

function fastBlog(html: string): string {
  const deferred = html.replace(
    /<script(?: fetchpriority="low")? type="module" crossorigin src="([^"]+)"><\/script>\s*/g,
    "",
  );
  return deferred.replace(
    /<link rel="stylesheet"(?: crossorigin)? href="([^"]+)"\s*\/?>/g,
    (full, href: string) => {
      const file = stylesheetFile(href);
      if (!file) return full;
      const css = fs.readFileSync(file, "utf-8")
        .replace(/font-display:\s*swap/g, "font-display: optional")
        .replace(/<\/style/gi, "<\\/style");
      return `<style data-href="${href}">${css}</style>`;
    },
  );
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
  if (injectScript) {
    html = html.replace(
      "</body>",
      `<script>${injectScript}</script></body>`,
    );
  }
  if (!html.includes("/assets/cookie-consent.js")) {
    html = html.replace(
      "</head>",
      `  <script src="/assets/cookie-consent.js?v=20261020"></script>\n</head>`,
    );
  }
  return html;
}

async function main() {
  const viteTemplate = fs.readFileSync(path.join(outDir, "index.html"), "utf-8");
  const posts = loadPostSummaries();

  const indexHtml = fastBlog(await renderRoute(
    "",
    viteTemplate,
    indexHead() + '\n  <script src="/assets/motion.js" defer></script>',
    <BlogIndex initialPosts={posts} />,
  ));
  fs.writeFileSync(path.join(outDir, "index.html"), indexHtml, "utf-8");

  for (const summary of posts) {
    const payload = await buildBlogPostPayload(summary.slug, posts);
    if (!payload) continue;

    const script = "";

    const slugDir = path.join(outDir, summary.slug);
    fs.mkdirSync(slugDir, { recursive: true });
    const html = fastBlog(await renderRoute(
      script,
      viteTemplate,
      postHead(summary) +
        '\n  <script src="/assets/motion.js" defer></script>\n  <script src="/assets/lead-form.js?v=20260905" defer></script>',
      <BlogPost initialPost={payload} />,
    ));
    fs.writeFileSync(path.join(slugDir, "index.html"), html, "utf-8");
  }

  console.log(`Prerendered blog: ${posts.length} posts → ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
