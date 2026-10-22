import { notFound } from "next/navigation";
import { ProjectArticle } from "@/components/site/ProjectArticle";
import { getProjectById } from "@/lib/queries/admin-content";
import { idSchema } from "@/lib/validation";

export default async function ProjectPreview({ params }: PageProps<"/admin/preview/projects/[id]">) {
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const p = await getProjectById(parsed.data);
  if (!p) notFound();
  return <ProjectArticle p={p} next={null} />;
}
