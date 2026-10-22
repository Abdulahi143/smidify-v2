"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  idSchema,
  postSchema,
  projectSchema,
  serviceSchema,
  type ServiceInput,
} from "@/lib/validation";

export type SaveResult =
  | { ok: true; id: string; slug: string; status: string; savedAt: string }
  | { ok: false; message?: string; fieldErrors: Record<string, string> };

type Table = "projects" | "posts";

function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    out[key] ??= issue.message;
  }
  return out;
}

function revalidatePublic(table: Table, ...slugs: (string | null | undefined)[]) {
  updateTag(table);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  const base = table === "projects" ? "/work" : "/blog";
  revalidatePath(base);
  if (table === "posts") revalidatePath("/blog/rss.xml");
  for (const s of new Set(slugs)) if (s) revalidatePath(`${base}/${s}`);
  revalidatePath(`/admin/${table}`);
  revalidatePath("/admin");
}

async function slugTaken(table: Table, slug: string, id: string | null) {
  const { supabase } = await requireAdmin();
  let q = supabase.from(table).select("id").eq("slug", slug);
  if (id) q = q.neq("id", id);
  const { data, error } = await q.limit(1);
  if (error) throw error;
  return data.length > 0;
}

export async function checkSlug(table: Table, slug: string, id: string | null): Promise<boolean> {
  const parsed = z
    .object({ table: z.enum(["projects", "posts"]), slug: z.string().min(1).max(80), id: idSchema.nullable() })
    .parse({ table, slug, id });
  return !(await slugTaken(parsed.table, parsed.slug, parsed.id));
}

export async function saveProject(input: unknown): Promise<SaveResult> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  const v = parsed.data;
  const { supabase } = await requireAdmin();

  if (await slugTaken("projects", v.slug, v.id)) {
    return { ok: false, fieldErrors: { slug: "That URL is already used." } };
  }

  const existing = v.id
    ? (await supabase.from("projects").select("slug, status, published_at").eq("id", v.id).maybeSingle()).data
    : null;

  const row = {
    slug: v.slug,
    title: v.title,
    summary: v.summary,
    kinds: v.kinds,
    client: v.client || null,
    timeline: v.timeline || null,
    year: v.year,
    cover_path: v.cover_path,
    cover_alt: v.cover_alt || null,
    gallery_paths: v.gallery_paths,
    gallery_alts: v.gallery_alts,
    problem: v.problem || null,
    solution: v.solution || null,
    result: v.result || null,
    quote: v.quote || null,
    quote_author: v.quote_author || null,
    featured: v.featured,
    status: v.status,
    published_at:
      v.status === "published" ? (existing?.published_at ?? new Date().toISOString()) : (existing?.published_at ?? null),
  };

  const query = v.id
    ? supabase.from("projects").upsert({ ...row, id: v.id })
    : supabase.from("projects").insert(row);
  const { data, error } = await query.select("id, slug, status, updated_at").single();
  if (error) {
    return { ok: false, fieldErrors: {}, message: error.code === "23505" ? "That URL is already used." : error.message };
  }

  revalidatePublic("projects", existing?.slug, data.slug);
  return { ok: true, id: data.id, slug: data.slug, status: data.status, savedAt: data.updated_at ?? new Date().toISOString() };
}

export async function savePost(input: unknown): Promise<SaveResult> {
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  const v = parsed.data;
  const { supabase } = await requireAdmin();

  if (await slugTaken("posts", v.slug, v.id)) {
    return { ok: false, fieldErrors: { slug: "That URL is already used." } };
  }

  const existing = v.id
    ? (await supabase.from("posts").select("slug, status, published_at").eq("id", v.id).maybeSingle()).data
    : null;

  const row = {
    slug: v.slug,
    title: v.title,
    excerpt: v.excerpt,
    body_md: v.body_md,
    category: v.category,
    cover_path: v.cover_path,
    cover_alt: v.cover_alt || null,
    featured: v.featured,
    status: v.status,
    published_at:
      v.status === "published" ? (existing?.published_at ?? new Date().toISOString()) : (existing?.published_at ?? null),
  };

  const query = v.id
    ? supabase.from("posts").upsert({ ...row, id: v.id })
    : supabase.from("posts").insert(row);
  const { data, error } = await query.select("id, slug, status, updated_at").single();
  if (error) {
    return { ok: false, fieldErrors: {}, message: error.code === "23505" ? "That URL is already used." : error.message };
  }

  revalidatePublic("posts", existing?.slug, data.slug);
  return { ok: true, id: data.id, slug: data.slug, status: data.status, savedAt: data.updated_at ?? new Date().toISOString() };
}

async function remove(table: Table, idInput: string): Promise<void> {
  const id = idSchema.parse(idInput);
  const { supabase } = await requireAdmin();

  const { data: row } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;

  if (row) {
    const files = [row.cover_path, ...("gallery_paths" in row ? (row.gallery_paths ?? []) : [])].filter(
      (p): p is string => Boolean(p),
    );
    if (files.length) await supabase.storage.from("media").remove(files);
    revalidatePublic(table, row.slug);
  }
}

export async function deleteProject(id: string): Promise<void> {
  await remove("projects", id);
}

export async function deletePost(id: string): Promise<void> {
  await remove("posts", id);
}

export async function saveService(input: ServiceInput): Promise<SaveResult> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
  const { supabase } = await requireAdmin();
  const { id, ...rest } = parsed.data;

  const { error } = await supabase.from("services").update(rest).eq("id", id);
  if (error) return { ok: false, fieldErrors: {}, message: error.message };

  updateTag("services");
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
  return { ok: true, id, slug: "", status: "", savedAt: new Date().toISOString() };
}

export async function setQuoteHandled(id: string, handled: boolean): Promise<void> {
  const parsed = z.object({ id: idSchema, handled: z.boolean() }).parse({ id, handled });
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("quote_requests").update({ handled: parsed.handled }).eq("id", parsed.id);
  if (error) throw error;
  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
}
