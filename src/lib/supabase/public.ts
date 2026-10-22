import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/** Cookie-less anon client for public reads, safe inside `"use cache"` scopes. */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
