import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/media";
import { getAllPosts } from "@/lib/queries/posts";
import { getProjectSlugs } from "@/lib/queries/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [posts, projects] = await Promise.all([getAllPosts(), getProjectSlugs()]);
  const at = (d: string | null) => (d ? new Date(d) : undefined);
  return [
    ...["", "/services", "/process", "/work", "/blog"].map((p) => ({ url: `${base}${p}` })),
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}`, lastModified: at(p.published_at) })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: at(p.published_at) })),
  ];
}
