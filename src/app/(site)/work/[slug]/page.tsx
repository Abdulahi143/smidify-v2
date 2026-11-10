import { getNextProject, getProjectBySlug, getProjectSlugs } from "@/lib/queries/projects";

import type { Metadata } from "next";
import { ProjectArticle } from "@/components/site/ProjectArticle";
import { mediaUrl } from "@/lib/media";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjectSlugs();
  if (projects.length === 0) return [{ slug: "__placeholder__" }];
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.title} — Smidify`,
    description: p.summary,
    openGraph: {
      title: p.title,
      description: p.summary,
      images: p.cover_path ? [mediaUrl(p.cover_path)] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) notFound();
  const next = await getNextProject(slug);

  return <ProjectArticle p={p} next={next} />;
}
