import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(["en", "zh-CN"]),
    heavyCode: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

const cheatsheets = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/docs/cheatsheets",
    generateId: ({ entry }) => entry.replace(/\.md$/, "").replace(/\/index$/, ""),
  }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { blog, cheatsheets };
