import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/types/database";

export type Service = Database["public"]["Tables"]["services"]["Row"];

export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheTag("services");
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });

  const { data, error } = await createPublicClient()
    .from("services")
    .select("*")
    .order("sort");
  if (error) throw error;
  return data;
}
