import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin";
import { getProjectById } from "@/lib/queries/admin-content";
import { idSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  const id = idSchema.safeParse((await params).id);
  if (!id.success) notFound();
  const project = await getProjectById(id.data);
  if (!project) notFound();
  return <ProjectForm key={project.id} project={project} />;
}
