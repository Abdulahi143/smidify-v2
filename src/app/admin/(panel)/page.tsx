import { StudioOverview } from "@/components/admin/StudioOverview";
import {
  getAdminCounts,
  getSiteContent,
  type ContentType,
} from "@/lib/queries/admin";
import { getPipelineItems } from "@/lib/queries/pipeline";
import { getOpenQuoteRequests } from "@/lib/queries/quotes";

function parseType(v: string | string[] | undefined): ContentType {
  return v === "projects" || v === "posts" ? v : "all";
}

// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function AdminOverview({
  searchParams,
}: PageProps<"/admin">) {
  const params = await searchParams;
  const type = parseType(params.type);
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const [counts, items, rows, quotes] = await Promise.all([
    getAdminCounts(),
    getPipelineItems(),
    getSiteContent(type, q || undefined),
    getOpenQuoteRequests(),
  ]);
  return (
    <StudioOverview
      counts={counts}
      items={items}
      rows={rows}
      quotes={quotes}
      type={type}
      q={q || undefined}
    />
  );
}
