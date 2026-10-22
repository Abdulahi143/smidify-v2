import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/site/PostArticle";
import { mediaUrl } from "@/lib/media";
import { getAllPosts, getPostBySlug } from "@/lib/queries/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllPosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.title} — Smidify`,
    description: p.excerpt,
    openGraph: {
      title: p.title,
      description: p.excerpt,
      type: "article",
      images: p.cover_path ? [mediaUrl(p.cover_path)] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) notFound();

  return <PostArticle p={p} />;
}
