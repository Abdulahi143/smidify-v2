import type { Metadata } from "next";
import { CompanyHome } from "@/components/site/CompanyHome";
import { getCompanyContent } from "@/lib/queries/company";
import { getFeaturedProjects } from "@/lib/queries/projects";
export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getCompanyContent();
  return { title: copy.metaTitle, description: copy.metaDescription };
}
export default async function Home() {
  const [content, projects] = await Promise.all([
    getCompanyContent(),
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? getFeaturedProjects(6)
      : Promise.resolve([]),
  ]);
  return <CompanyHome content={content} projects={projects} />;
}
