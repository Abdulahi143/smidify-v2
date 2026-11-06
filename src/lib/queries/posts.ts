import { sampleMode, samplePosts } from "@/lib/content/samples";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/types/database";

export type Post = Database["public"]["Tables"]["posts"]["Row"];

export async function getLatestPosts(limit = 3): Promise<Post[]> {
  "use cache";
  cacheTag("posts");
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  if (sampleMode) {
    return samplePosts.slice(0, limit);
  }

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

const cache = { stale: 300, revalidate: 300, expire: 3600 } as const;
export const POSTS_PER_PAGE = 10;

export async function getPostsPage(
  category: string | undefined,
  page: number,
): Promise<{ posts: Post[]; total: number }> {
  "use cache";
  cacheTag("posts");
  cacheLife(cache);
  if (sampleMode) {
    const posts = samplePosts.filter(
      (p) => !category || p.category === category,
    );
    return {
      posts: posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
      total: posts.length,
    };
  }

  let q = createPublicClient()
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "published");
  if (category) q = q.eq("category", category);
  const from = (page - 1) * POSTS_PER_PAGE;
  const { data, error, count } = await q
    .order("published_at", { ascending: false })
    .range(from, from + POSTS_PER_PAGE - 1);
  if (error) throw error;
  return { posts: data, total: count ?? 0 };
}

export async function getFeaturedPost(): Promise<Post | null> {
  "use cache";
  cacheTag("posts");
  cacheLife(cache);
  if (sampleMode) {
    return samplePosts[0] ?? null;
  }

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPostCategories(): Promise<string[]> {
  "use cache";
  cacheTag("posts");
  cacheLife(cache);
  if (sampleMode) {
    return [...new Set(samplePosts.map((p) => p.category))].sort();
  }

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("category")
    .eq("status", "published");
  if (error) throw error;
  return [...new Set(data.map((r) => r.category))].sort();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag("posts");
  cacheLife(cache);
  if (sampleMode) {
    return samplePosts.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAllPosts(): Promise<Post[]> {
  "use cache";
  cacheTag("posts");
  cacheLife(cache);
  if (sampleMode) {
    return samplePosts;
  }

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data;
}
