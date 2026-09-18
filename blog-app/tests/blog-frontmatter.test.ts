import { describe, expect, it } from "vitest";
import { postFrontmatterSchema } from "../shared/blog-types";
import { loadPostSummaries } from "../scripts/blog-server";

describe("postFrontmatterSchema", () => {
  it("отклоняет невалидный slug", () => {
    expect(() =>
      postFrontmatterSchema.parse({
        title: "T",
        description: "D",
        slug: "Bad_Slug",
        date: "2026-01-01",
        updatedAt: "2026-01-01",
        category: "c",
        tags: ["a"],
        coverImage: "/x.webp",
        author: "a",
      }),
    ).toThrow();
  });

  it("принимает минимально валидный frontmatter", () => {
    const parsed = postFrontmatterSchema.parse({
      title: "Заголовок",
      description: "Описание",
      slug: "test-post",
      date: "2026-03-01",
      updatedAt: "2026-03-02",
      category: "Налоги",
      tags: ["ндс"],
      coverImage: "/images/blog/x.webp",
      author: "Максим",
      draft: false,
    });
    expect(parsed.slug).toBe("test-post");
    expect(parsed.draft).toBe(false);
  });
});

describe("loadPostSummaries", () => {
  it("не включает draft и возвращает ≥3 публикации", () => {
    const posts = loadPostSummaries();
    expect(posts.length).toBeGreaterThanOrEqual(3);
    expect(posts.every((p) => p.draft !== true)).toBe(true);
    expect(posts.every((p) => p.title.length > 0)).toBe(true);
  });
});
