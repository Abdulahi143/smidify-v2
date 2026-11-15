"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import type { PipelineStage } from "@/lib/content/process";
import { moveStageSchema, quoteIdSchema } from "@/lib/validation";
import { pipelineItemSchema } from "@/lib/validation/pipeline";

function revalidateBoard() {
  revalidatePath("/admin");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/quotes");
}

/** Moves an item to `stage` at position `sort`, renumbering the destination column. */
export async function moveStage(
  id: string,
  stage: PipelineStage,
  sort: number,
): Promise<void> {
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

  // A retry after marking the quote handled failed must not insert a second item.
  const { data: existing, error: existingError } = await supabase
    .from("pipeline_items")
    .select("id")
    .eq("quote_request_id", quote.id)
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;
  if (!existing) {
    const { data: last, error: lastError } = await supabase
      .from("pipeline_items")
      .select("sort")
      .eq("stage", "idea")
      .order("sort", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) throw lastError;

    const { error: insertError } = await supabase
      .from("pipeline_items")
      .insert({
        name: quote.company || quote.name || quote.email,
        kind: quote.kind || "General",
        stage: "idea",
        quote_request_id: quote.id,
        sort: (last?.sort ?? -1) + 1,
      });
    if (insertError) throw insertError;
  }

  const { error: updateError } = await supabase
    .from("quote_requests")
    .update({ handled: true })
    .eq("id", quote.id);
  if (updateError) throw updateError;

  revalidateBoard();
}

export async function savePipelineItem(input: unknown) {
  const { supabase } = await requireAdmin();
  const parsed = pipelineItemSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Check the project details.",
    };
  const { id, ...values } = parsed.data;
  const stage = values.stage as PipelineStage;
  let sort: number | undefined;
  if (!id) {
    const { data: last, error } = await supabase
      .from("pipeline_items")
      .select("sort")
      .eq("stage", stage)
      .order("sort", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error)
      return {
        ok: false as const,
        message: "Could not read the board. Try again.",
      };
    sort = (last?.sort ?? -1) + 1;
  } else {
    const { data: current, error } = await supabase
      .from("pipeline_items")
      .select("stage")
      .eq("id", id)
      .single();
    if (error)
      return {
        ok: false as const,
        message: "This item is no longer available. Refresh the board.",
      };
    if (current.stage !== stage) {
      const { count, error: countError } = await supabase
        .from("pipeline_items")
        .select("id", { count: "exact", head: true })
        .eq("stage", stage);
      if (countError)
        return {
          ok: false as const,
          message: "Could not read the board. Try again.",
        };
      sort = count ?? 0;
    }
  }
  const row = {
    ...values,
    stage,
    due_note: values.due_note || null,
    ...(sort === undefined ? {} : { sort }),
  };
  const query = id
    ? supabase.from("pipeline_items").update(row).eq("id", id)
    : supabase.from("pipeline_items").insert(row);
  const { error } = await query.select("id").single();
  if (error)
    return {
      ok: false as const,
      message: "Could not save the pipeline item. Please try again.",
    };
  revalidateBoard();
  return { ok: true as const };
}

export async function deletePipelineItem(input: string): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = quoteIdSchema.parse(input);
  const { error } = await supabase.from("pipeline_items").delete().eq("id", id);
  if (error) throw error;
  revalidateBoard();
}
