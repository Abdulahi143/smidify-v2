import { getCompanyDraft } from "@/lib/actions/company";
import { WebsiteEditor } from "@/components/admin/WebsiteEditor";
// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function WebsitePage() {
  const initial = await getCompanyDraft();
  return <WebsiteEditor initial={initial} />;
}
