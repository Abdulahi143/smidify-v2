import { CompanyHome } from "@/components/site/CompanyHome";
import { getCompanyPreview } from "@/lib/actions/company";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getLatestPosts } from "@/lib/queries/posts";
import { getServices } from "@/lib/queries/services";
import { isLocalStudioPreview } from "@/lib/studio-preview";
import {
  studioProjects,
  studioPosts,
  studioServices,
} from "@/lib/content/studio-samples";
// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function CompanyPreview() {
  const content = await getCompanyPreview();
  const local = await isLocalStudioPreview();
  const [projects, posts, services] = local
    ? [
        studioProjects.filter((p) => p.status === "published"),
        studioPosts.filter((p) => p.status === "published"),
        studioServices,
      ]
    : await Promise.all([
        getFeaturedProjects(3),
        getLatestPosts(3),
        getServices(),
      ]);
  return (
    <CompanyHome
      content={content}
      projects={projects}
      posts={posts}
      services={services}
      contentConfigured={!local}
    />
  );
}
