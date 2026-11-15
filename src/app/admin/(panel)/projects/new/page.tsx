import type { Metadata } from "next";
import { connection } from "next/server";
import { ProjectForm } from "@/components/admin";
import { requireStudioViewer } from "@/lib/auth";

export const metadata: Metadata = { title: "New project" };

// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function NewProject() {
  await connection();
  await requireStudioViewer();
  return <ProjectForm project={null} newId={crypto.randomUUID()} />;
}
