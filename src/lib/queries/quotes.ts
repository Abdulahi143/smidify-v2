import { requireAdmin } from "@/lib/auth";
import type { Database } from "@/lib/types/database";

export type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

export async function getOpenQuoteRequests(limit = 5): Promise<QuoteRequest[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("handled", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
