import { z } from "zod";
import type { ComponentType } from "react";

export const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1),
  coverImage: z.string().min(1),
  author: z.string().min(1),
  readingTimeMinutes: z.number().int().positive().optional(),
  draft: z.boolean().default(false),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().url().nullable().optional(),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type PostSummary = PostFrontmatter & {
  readingTimeMinutes: number;
};

export type PostFull = PostSummary & {
  content: string;
  mdxModule?: ComponentType;
};
