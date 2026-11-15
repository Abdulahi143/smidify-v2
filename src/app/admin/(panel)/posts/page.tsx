import type { Metadata } from "next";
import { ContentList } from "@/components/admin";
import { deletePost } from "@/lib/actions";
import { listPosts, parseStatus } from "@/lib/queries/admin-content";

export const metadata: Metadata = { title: "Blog posts" };

// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function PostsPage({
  searchParams,
}: PageProps<"/admin/posts">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const status = parseStatus(params.status);
  const rows = await listPosts({ q: q || undefined, status });
  return (
    <ContentList
      kind="posts"
      rows={rows}
      q={q || undefined}
      status={status}
      remove={deletePost}
    />
  );
}
