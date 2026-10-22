import { cache } from "react";
import { requireAdmin } from "@/lib/auth";
import type { Database } from "@/lib/types/database";

export type ContentStatus = Database["public"]["Enums"]["content_status"];
export type ContentType = "all" | "projects" | "posts";

export type ContentRow = {
  id: string;
  title: string;
  type: "project" | "post";
  status: ContentStatus;
  updated_at: string | null;
};

export type AdminCounts = {
  pipeline: number;
  projects: number;
  publishedProjects: number;
  posts: number;
  publishedPosts: number;
  drafts: number;
  services: number;
  quotes: number;
};

export const getAdminCounts = cache(async (): Promise<AdminCounts> => {
  const { supabase } = await requireAdmin();
  const head = { count: "exact", head: true } as const;
  const [pipeline, projects, pubProjects, posts, pubPosts, draftProjects, draftPosts, services, quotes] =
    await Promise.all([
      supabase.from("pipeline_items").select("*", head),
      supabase.from("projects").select("*", head),
      supabase.from("projects").select("*", head).eq("status", "published"),
      supabase.from("posts").select("*", head),
      supabase.from("posts").select("*", head).eq("status", "published"),
      supabase.from("projects").select("*", head).neq("status", "published"),
      supabase.from("posts").select("*", head).neq("status", "published"),
      supabase.from("services").select("*", head),
      supabase.from("quote_requests").select("*", head).eq("handled", false),
    ]);
  const failed = [pipeline, projects, pubProjects, posts, pubPosts, draftProjects, draftPosts, services, quotes].find(
    (r) => r.error,
  );
  if (failed?.error) throw failed.error;

  return {
    pipeline: pipeline.count ?? 0,
    projects: projects.count ?? 0,
    publishedProjects: pubProjects.count ?? 0,
    posts: posts.count ?? 0,
    publishedPosts: pubPosts.count ?? 0,
    drafts: (draftProjects.count ?? 0) + (draftPosts.count ?? 0),
    services: services.count ?? 0,
    quotes: quotes.count ?? 0,
  };
});

export async function getSiteContent(
  type: ContentType,
  q?: string,
  limit = 8,
): Promise<ContentRow[]> {
  const { supabase } = await requireAdmin();
  const pattern = q ? `%${q.replace(/[%_\\]/g, "\\$&")}%` : null;

  const projects = async (): Promise<ContentRow[]> => {
    if (type === "posts") return [];
    let query = supabase.from("projects").select("id, title, status, updated_at");
    if (pattern) query = query.ilike("title", pattern);
    const { data, error } = await query.order("updated_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return data.map((r) => ({ ...r, type: "project" as const }));
  };
  const posts = async (): Promise<ContentRow[]> => {
    if (type === "projects") return [];
    let query = supabase.from("posts").select("id, title, status, updated_at");
    if (pattern) query = query.ilike("title", pattern);
    const { data, error } = await query.order("updated_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return data.map((r) => ({ ...r, type: "post" as const }));
  };

  const [p, b] = await Promise.all([projects(), posts()]);
  return [...p, ...b]
    .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))
    .slice(0, limit);
}
