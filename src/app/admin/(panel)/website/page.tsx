import { getCompanyDraft } from "@/lib/actions/company";
import { WebsiteEditor } from "@/components/admin/WebsiteEditor";
export default async function WebsitePage() {
  const initial = await getCompanyDraft();
  return <WebsiteEditor initial={initial} />;
}
