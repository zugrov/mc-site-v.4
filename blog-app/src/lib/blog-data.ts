import type { PostSummary } from "@shared/blog-types";

/** Сериализуемый список постов для клиента (инжектится при SSG). */
export let postsSnapshot: PostSummary[] = [];

export function setPostsSnapshot(posts: PostSummary[]) {
  postsSnapshot = posts;
}
