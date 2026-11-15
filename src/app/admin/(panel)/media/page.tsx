import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { listMedia } from "@/lib/queries/media";
import { mediaFolderSchema } from "@/lib/validation/studio";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Media" };
export const instant = false;

export default async function MediaPage({
  searchParams,
}: PageProps<"/admin/media">) {
  const params = await searchParams;
  const folder = mediaFolderSchema.safeParse(
    typeof params.folder === "string" ? params.folder : "",
  );
  if (!folder.success) notFound();
  return (
    <MediaLibrary entries={await listMedia(folder.data)} folder={folder.data} />
  );
}
