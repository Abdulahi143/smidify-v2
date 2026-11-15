import type { Metadata } from "next";
import { connection } from "next/server";
import { PostForm } from "@/components/admin";
import { getPostCategoryOptions } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "New post" };

// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function NewPost() {
  await connection();
  const categories = await getPostCategoryOptions();
  return (
    <PostForm post={null} newId={crypto.randomUUID()} categories={categories} />
  );
}
