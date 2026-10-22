import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "New project" };

export default async function NewProject() {
  await requireAdmin();
  return <ProjectForm project={null} newId={crypto.randomUUID()} />;
}
