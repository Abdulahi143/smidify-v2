import { getAllPosts, getPostBySlug } from "@/lib/queries/posts";

import type { Metadata } from "next";
import { PostArticle } from "@/components/site/PostArticle";
import { mediaUrl } from "@/lib/media";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  if (posts.length === 0) return [{ slug: "__placeholder__" }];
  return posts.map(({ slug }) => ({ slug }));
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
