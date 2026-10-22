import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin";
import { getPostById, getPostCategoryOptions } from "@/lib/queries/admin-content";
import { idSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPost({ params }: PageProps<"/admin/posts/[id]">) {
  const id = idSchema.safeParse((await params).id);
  if (!id.success) notFound();
  const [post, categories] = await Promise.all([getPostById(id.data), getPostCategoryOptions()]);
  if (!post) notFound();
  return <PostForm key={post.id} post={post} categories={categories} />;
}
