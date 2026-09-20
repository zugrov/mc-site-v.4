import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { mdxComponents } from "../src/lib/mdx-components";
import { loadPostBySlug, loadPostSummaries } from "../scripts/blog-server";

describe("MDX smoke", () => {
  it("рендерит первую опубликованную статью", async () => {
    const [first] = loadPostSummaries();
    expect(first).toBeDefined();
    const post = await loadPostBySlug(first.slug);
    expect(post).not.toBeNull();
    expect(post!.mdxModule).toBeDefined();
    expect(typeof post!.mdxModule).toBe("function");
  });

  it("markdown-таблицы рендерятся как HTML-таблицы", async () => {
    const post = await loadPostBySlug("nds-pri-importe-iz-eaes-2026");
    expect(post).not.toBeNull();
    const Content = post!.mdxModule!;
    const html = renderToString(
      React.createElement(Content, { components: mdxComponents }),
    );
    expect(html).toContain("blog-table-wrap");
    expect(html).toContain("<table");
    expect(html).not.toMatch(/\| --- \|/);
  });
});
