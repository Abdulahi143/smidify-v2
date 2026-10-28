import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { companySchema, defaultCompanyContent } from "@/lib/content/company";
export async function getCompanyContent() {
  "use cache";
  cacheTag("company-content");
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return defaultCompanyContent;
  const { data, error } = await createPublicClient()
    .from("company_content")
    .select("content")
    .eq("id", "published")
    .maybeSingle();
  // Keep the approved homepage available while the additive migration is being rolled out.
  if (error) {
    if (["42P01", "PGRST205"].includes(error.code))
      return defaultCompanyContent;
    throw error;
  }
  return data ? companySchema.parse(data.content) : defaultCompanyContent;
}
