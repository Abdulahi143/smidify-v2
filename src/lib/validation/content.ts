import { z } from "zod";

export const CONTENT_STATUSES = ["draft", "in_review", "published"] as const;
export const PROJECT_KINDS = ["website", "mobile", "network", "ai"] as const;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const text = (max: number) => z.string().trim().max(max);
const slug = z
  .string()
  .trim()
  .min(1, "Add a URL slug.")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.");
const status = z.enum(CONTENT_STATUSES);
const mediaPath = z.string().trim().max(300).nullable();

const publishChecks = (
  v: { status: string; summary?: string; excerpt?: string; cover_path: string | null; cover_alt: string },
  ctx: z.RefinementCtx,
) => {
  if (v.status !== "published") return;
  const lead = v.summary ?? v.excerpt ?? "";
  if (!lead) {
    ctx.addIssue({
      code: "custom",
      path: [v.summary === undefined ? "excerpt" : "summary"],
      message: "Write a summary before publishing.",
    });
  }
  if (!v.cover_path) {
    ctx.addIssue({ code: "custom", path: ["cover_path"], message: "Upload a cover image before publishing." });
  }
};

const coverAlt = (v: { cover_path: string | null; cover_alt: string }, ctx: z.RefinementCtx) => {
  if (v.cover_path && !v.cover_alt) {
    ctx.addIssue({ code: "custom", path: ["cover_alt"], message: "Describe the image for screen readers." });
  }
};

export const projectSchema = z
  .object({
    id: z.uuid().nullable(),
    title: text(140).min(1, "Add a title."),
    slug,
    summary: text(400),
    kinds: z.array(z.enum(PROJECT_KINDS)).max(4),
    client: text(120),
    timeline: text(60),
    year: z.number().int().min(1990).max(2100).nullable(),
    cover_path: mediaPath,
    cover_alt: text(200),
    gallery_paths: z.array(z.string().max(300)).max(12),
    gallery_alts: z.array(text(200)).max(12),
    problem: text(4000),
    solution: text(4000),
    result: text(4000),
    quote: text(600),
    quote_author: text(120),
    featured: z.boolean(),
    status,
  })
  .superRefine((v, ctx) => {
    coverAlt(v, ctx);
    v.gallery_paths.forEach((_, i) => {
      if (!v.gallery_alts[i]) {
        ctx.addIssue({ code: "custom", path: ["gallery_alts", i], message: "Describe each gallery image." });
      }
    });
    publishChecks(v, ctx);
  });

export const postSchema = z
  .object({
    id: z.uuid().nullable(),
    title: text(160).min(1, "Add a title."),
    slug,
    excerpt: text(400),
    body_md: z.string().max(100_000),
    category: text(60).min(1, "Pick or type a category."),
    cover_path: mediaPath,
    cover_alt: text(200),
    featured: z.boolean(),
    status,
  })
  .superRefine((v, ctx) => {
    coverAlt(v, ctx);
    publishChecks(v, ctx);
  });

export const serviceSchema = z.object({
  id: z.uuid(),
  title: text(80).min(1, "Add a title."),
  body: text(600).min(1, "Add a description."),
  items: z.array(text(80).min(1)).max(8),
});

export const idSchema = z.uuid();

export type ProjectInput = z.infer<typeof projectSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
