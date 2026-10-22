"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import type { PipelineStage } from "@/lib/content/process";
import { moveStageSchema, quoteIdSchema } from "@/lib/validation";

function revalidateBoard() {
  revalidatePath("/admin");
  revalidatePath("/admin/pipeline");
}

/** Moves an item to `stage` at position `sort`, renumbering the destination column. */
export async function moveStage(id: string, stage: PipelineStage, sort: number): Promise<void> {
  const parsed = moveStageSchema.parse({ id, stage, sort });
  const { supabase } = await requireAdmin();

  const { data: column, error } = await supabase
    .from("pipeline_items")
    .select("id")
    .eq("stage", parsed.stage as PipelineStage)
    .neq("id", parsed.id)
    .order("sort")
    .order("created_at");
  if (error) throw error;

  const ids = column.map((r) => r.id);
  ids.splice(Math.min(parsed.sort, ids.length), 0, parsed.id);

  const results = await Promise.all(
    ids.map((itemId, i) =>
      supabase
        .from("pipeline_items")
        .update({ stage: parsed.stage as PipelineStage, sort: i })
        .eq("id", itemId),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;

  revalidateBoard();
}

/** Creates an 'idea' pipeline item from a quote request and marks the request handled. */
export async function moveQuoteToIdea(quoteId: string): Promise<void> {
  const id = quoteIdSchema.parse(quoteId);
  const { supabase } = await requireAdmin();

  const { data: quote, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (quote.handled) return;

  const { data: last } = await supabase
    .from("pipeline_items")
    .select("sort")
    .eq("stage", "idea")
    .order("sort", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("pipeline_items").insert({
    name: quote.company || quote.name || quote.email,
    kind: quote.kind || "General",
    stage: "idea",
    quote_request_id: quote.id,
    sort: (last?.sort ?? -1) + 1,
  });
  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("quote_requests")
    .update({ handled: true })
    .eq("id", quote.id);
  if (updateError) throw updateError;

  revalidateBoard();
}
