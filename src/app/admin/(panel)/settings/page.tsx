import type { Metadata } from "next";
import { StudioSettings } from "@/components/admin/StudioSettings";
import { requireStudioViewer } from "@/lib/auth";
import { getCompanyDraft } from "@/lib/actions/company";
import { siteUrl } from "@/lib/media";

export const metadata: Metadata = { title: "Settings" };
export const instant = false;

export default async function SettingsPage() {
  const [viewer, initial] = await Promise.all([
    requireStudioViewer(),
    getCompanyDraft(),
  ]);
  return (
    <StudioSettings
      initial={initial}
      email={viewer.email}
      websiteUrl={siteUrl()}
      configured={Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      )}
    />
  );
}
