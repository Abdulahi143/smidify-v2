import Link from "next/link";
import { SegmentedLinks, Tag } from "@/components/ui";
import { updatedLabel } from "@/lib/format";
import type { ContentRow, ContentStatus, ContentType } from "@/lib/queries/admin";

const STATUS: Record<ContentStatus, { label: string; tone: "neutral" | "magenta" | "cyan" }> = {
  draft: { label: "Draft", tone: "neutral" },
  in_review: { label: "In review", tone: "magenta" },
  published: { label: "Published", tone: "cyan" },
};

const TYPES = [
  { value: "all", label: "All" },
  { value: "projects", label: "Projects" },
  { value: "posts", label: "Posts" },
] as const;

export function ContentTable({
  rows,
  type,
  q,
}: {
  rows: ContentRow[];
  type: ContentType;
  q?: string;
}) {
  const options = TYPES.map((t) => {
    const params = new URLSearchParams();
    if (t.value !== "all") params.set("type", t.value);
    if (q) params.set("q", q);
    const qs = params.toString();
    return { ...t, href: qs ? `/admin?${qs}` : "/admin" };
  });

  return (
    <section aria-labelledby="content-h">
      <div className="flex flex-wrap items-center justify-between gap-[15px]">
        <h2 id="content-h" className="text-[36px] leading-[44px]">
          Site content
        </h2>
        <SegmentedLinks options={options} value={type} label="Content type" />
      </div>

      <table className="mt-[20px] w-full text-left text-[17px]">
        <thead>
          <tr className="border-b border-neutral-300">
            <th scope="col" className="meta py-[10px] pr-[10px] font-normal">Title</th>
            <th scope="col" className="meta px-[10px] py-[10px] font-normal">Type</th>
            <th scope="col" className="meta px-[10px] py-[10px] font-normal">Status</th>
            <th scope="col" className="meta py-[10px] pl-[10px] font-normal">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const status = STATUS[r.status];
            return (
              <tr key={`${r.type}-${r.id}`} className="border-b border-neutral-200">
                <td className="py-[15px] pr-[10px]">
                  <Link
                    href={`/admin/${r.type === "project" ? "projects" : "posts"}/${r.id}`}
                    className="text-ink no-underline hover:text-cyan-700"
                  >
                    {r.title}
                  </Link>
                </td>
                <td className="px-[10px] py-[15px] capitalize">{r.type}</td>
                <td className="px-[10px] py-[15px]">
                  <Tag tone={status.tone}>{status.label}</Tag>
                </td>
                <td className="py-[15px] pl-[10px] whitespace-nowrap">{updatedLabel(r.updated_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="text-ink/70 mt-[20px]">Nothing matches.</p>
      ) : null}
    </section>
  );
}
