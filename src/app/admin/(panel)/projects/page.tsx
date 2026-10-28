import type { Metadata } from "next";
import { ContentList } from "@/components/admin";
import { deleteProject } from "@/lib/actions";
import { listProjects, parseStatus } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const status = parseStatus(params.status);
  const rows = await listProjects({ q: q || undefined, status });
  return <ContentList kind="projects" rows={rows} q={q || undefined} status={status} remove={deleteProject} />;
}
