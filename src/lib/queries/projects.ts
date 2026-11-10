import { sampleMode, sampleProjects } from "@/lib/content/samples";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/types/database";

export type Project = Database["public"]["Tables"]["projects"]["Row"];

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  "use cache";
  cacheTag("projects");
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  if (sampleMode) {
    return sampleProjects.filter((p) => p.featured).slice(0, limit);
  }

  const { data, error } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

const cache = { stale: 300, revalidate: 300, expire: 3600 } as const;

export async function getProjects(
  kind?: Project["kinds"][number],
): Promise<Project[]> {
  "use cache";
  cacheTag("projects");
  cacheLife(cache);
  if (sampleMode) {
    return sampleProjects.filter((p) => !kind || p.kinds.includes(kind));
  }

  let q = createPublicClient()
    .from("projects")
    .select("*")
    .eq("status", "published");
  if (kind) q = q.contains("kinds", [kind]);
  const { data, error } = await q.order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  "use cache";
  cacheTag("projects");
  cacheLife(cache);
  if (sampleMode) {
    return sampleProjects.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProjectSlugs(): Promise<
  { slug: string; published_at: string | null }[]
> {
  "use cache";
  cacheTag("projects");
  cacheLife(cache);
  if (sampleMode) {
    return sampleProjects.map(({ slug, published_at }) => ({
      slug,
      published_at,
    }));
  }

  const { data, error } = await createPublicClient()
    .from("projects")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}

/** The next project in publish order, wrapping to the newest. */
export async function getNextProject(
  slug: string,
): Promise<Pick<Project, "slug" | "title"> | null> {
  "use cache";
  cacheTag("projects");
  cacheLife(cache);
  if (sampleMode) {
    const index = sampleProjects.findIndex((p) => p.slug === slug);
    return index < 0
      ? null
      : (sampleProjects[(index + 1) % sampleProjects.length] ?? null);
  }

  const all = await getProjectSlugs();
  if (all.length < 2) return null;
  const i = all.findIndex((p) => p.slug === slug);
  const next = all[(i + 1) % all.length];
  if (!next) return null;
  const { data, error } = await createPublicClient()
    .from("projects")
    .select("slug, title")
    .eq("slug", next.slug)
    .single();
  if (error) throw error;
  return data;
}
