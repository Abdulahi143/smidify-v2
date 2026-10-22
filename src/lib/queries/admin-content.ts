import { requireAdmin } from "@/lib/auth";
import type { ContentStatus } from "@/lib/queries/admin";
import type { Database } from "@/lib/types/database";

export type AdminProject = Database["public"]["Tables"]["projects"]["Row"];
export type AdminPost = Database["public"]["Tables"]["posts"]["Row"];
export type AdminService = Database["public"]["Tables"]["services"]["Row"];
export type AdminQuote = Database["public"]["Tables"]["quote_requests"]["Row"];

export type ListRow = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  updated_at: string | null;
};

export type ListFilter = { q?: string; status?: ContentStatus };

export function parseStatus(v: string | string[] | undefined): ContentStatus | undefined {
  return v === "draft" || v === "in_review" || v === "published" ? v : undefined;
}

const like = (q: string) => `%${q.replace(/[%_\\]/g, "\\$&")}%`;

async function list(table: "projects" | "posts", { q, status }: ListFilter): Promise<ListRow[]> {
  const { supabase } = await requireAdmin();
  let query = supabase.from(table).select("id, title, slug, status, updated_at");
  if (q) query = query.ilike("title", like(q));
  if (status) query = query.eq("status", status);
  const { data, error } = await query.order("updated_at", { ascending: false }).limit(200);
  if (error) throw error;
  return data;
}

export const listProjects = (f: ListFilter) => list("projects", f);
export const listPosts = (f: ListFilter) => list("posts", f);

export async function getProjectById(id: string): Promise<AdminProject | null> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPostById(id: string): Promise<AdminPost | null> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPostCategoryOptions(): Promise<string[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("posts").select("category");
  if (error) throw error;
  return [...new Set(data.map((r) => r.category))].sort();
}

export async function getAdminServices(): Promise<AdminService[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("services").select("*").order("sort");
  if (error) throw error;
  return data;
}

export async function getAllQuoteRequests(): Promise<AdminQuote[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("handled")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data;
}
