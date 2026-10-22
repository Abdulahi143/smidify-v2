import { notFound } from "next/navigation";
import { PostArticle } from "@/components/site/PostArticle";
import { getPostById } from "@/lib/queries/admin-content";
import { idSchema } from "@/lib/validation";

export default async function PostPreview({ params }: PageProps<"/admin/preview/posts/[id]">) {
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const p = await getPostById(parsed.data);
  if (!p) notFound();
  return <PostArticle p={p} />;
}
