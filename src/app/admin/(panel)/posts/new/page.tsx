import type { Metadata } from "next";
import { PostForm } from "@/components/admin";
import { getPostCategoryOptions } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "New post" };

export default async function NewPost() {
  const categories = await getPostCategoryOptions();
  return <PostForm post={null} newId={crypto.randomUUID()} categories={categories} />;
}
