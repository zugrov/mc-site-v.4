import { describe, expect, it } from "vitest";
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
});
