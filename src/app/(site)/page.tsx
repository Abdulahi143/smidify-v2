import type { Metadata } from "next";
import { CompanyHome } from "@/components/site/CompanyHome";
import { getCompanyContent } from "@/lib/queries/company";
import { getLatestPosts } from "@/lib/queries/posts";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getServices } from "@/lib/queries/services";

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getCompanyContent();
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function Home() {
  const contentConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const [content, services, projects, posts] = await Promise.all([
    getCompanyContent(),
    contentConfigured ? getServices() : Promise.resolve([]),
    getFeaturedProjects(3),
    getLatestPosts(3),
  ]);
  return (
    <CompanyHome
      content={content}
      services={services}
      projects={projects}
      posts={posts}
      contentConfigured={contentConfigured}
    />
  );
}
