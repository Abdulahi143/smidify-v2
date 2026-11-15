import { requireAdmin } from "@/lib/auth";
import { isLocalStudioPreview } from "@/lib/studio-preview";
import { studioPipeline } from "@/lib/content/studio-samples";
import type { Database } from "@/lib/types/database";

export type PipelineItem =
  Database["public"]["Tables"]["pipeline_items"]["Row"];

export async function getPipelineItems(): Promise<PipelineItem[]> {
  if (await isLocalStudioPreview()) return studioPipeline;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("pipeline_items")
    .select("*")
    .order("sort")
    .order("created_at");
  if (error) throw error;
  return data;
}
