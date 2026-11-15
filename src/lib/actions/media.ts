"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { mediaObjectSchema } from "@/lib/validation/studio";
import { listMedia } from "@/lib/queries/media";

export async function browseMedia(folder: string) {
  return listMedia(folder);
}

export async function deleteMedia(input: string): Promise<void> {
  const { supabase } = await requireAdmin();
  const path = mediaObjectSchema.parse(input);
  const head = { count: "exact", head: true } as const;
  const references = await Promise.all([
    supabase.from("projects").select("id", head).eq("cover_path", path),
    supabase
      .from("projects")
      .select("id", head)
      .contains("gallery_paths", [path]),
    supabase.from("posts").select("id", head).eq("cover_path", path),
  ]);
  if (references.some((result) => result.error))
    throw Error(
      "Could not check whether the image is in use. Please try again.",
    );
  if (references.some((result) => (result.count ?? 0) > 0))
    throw Error(
      "This image is used by a project or post. Remove it from that content before deleting it here.",
    );
  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) throw Error("Could not delete the image. Please try again.");
  revalidatePath("/admin/media");
}
