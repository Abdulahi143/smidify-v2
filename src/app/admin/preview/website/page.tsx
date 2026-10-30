import { CompanyHome } from "@/components/site/CompanyHome";
import { getCompanyPreview } from "@/lib/actions/company";
import { getFeaturedProjects } from "@/lib/queries/projects";
export default async function CompanyPreview() {
  const [content, projects] = await Promise.all([
    getCompanyPreview(),
    getFeaturedProjects(6),
  ]);
  return <CompanyHome content={content} projects={projects} />;
}
