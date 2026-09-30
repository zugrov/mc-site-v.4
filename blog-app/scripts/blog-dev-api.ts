import type { IncomingMessage, ServerResponse } from "node:http";
import { buildBlogPostPayload } from "./blog-post-payload";
import { loadPostSummaries } from "./blog-summaries";

export async function handleBlogDevPostJson(
  req: IncomingMessage,
  res: ServerResponse,
  url: string,
): Promise<boolean> {
  const postMatch = url.match(/^\/blog\/__dev\/post\/([a-z0-9-]+)\.json$/);
  if (!postMatch) return false;

  const slug = postMatch[1];
  const posts = loadPostSummaries();
  const payload = await buildBlogPostPayload(slug, posts);
  if (!payload) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end("{}");
    return true;
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
  return true;
}
