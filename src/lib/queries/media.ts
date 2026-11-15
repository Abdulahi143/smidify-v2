import { requireAdmin } from "@/lib/auth";
import { isLocalStudioPreview } from "@/lib/studio-preview";
import { mediaFolderSchema } from "@/lib/validation/studio";

export type MediaEntry = {
  name: string;
  path: string;
  kind: "folder" | "image" | "file";
  size: number | null;
};

export async function listMedia(folderInput = ""): Promise<MediaEntry[]> {
  const folder = mediaFolderSchema.parse(folderInput);
  if (await isLocalStudioPreview())
    return folder
      ? []
      : [
          {
            name: "Website concept",
            path: "/samples/website.svg",
            kind: "image",
            size: null,
          },
          {
            name: "App concept",
            path: "/samples/app.svg",
            kind: "image",
            size: null,
          },
          {
            name: "Network concept",
            path: "/samples/network.svg",
            kind: "image",
            size: null,
          },
        ];
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.storage
    .from("media")
    .list(folder, { limit: 200, sortBy: { column: "name", order: "asc" } });
  if (error) throw error;
  return data.map((file) => ({
    name: file.name,
    path: [folder, file.name].filter(Boolean).join("/"),
    kind: !file.id
      ? "folder"
      : /\.(jpe?g|png|webp|avif)$/i.test(file.name)
        ? "image"
        : "file",
    size: typeof file.metadata?.size === "number" ? file.metadata.size : null,
  }));
}
