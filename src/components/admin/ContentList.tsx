import Link from "next/link";
import { buttonStyles, SegmentedLinks, Tag } from "@/components/ui";
import { updatedLabel } from "@/lib/format";
import type { ContentStatus } from "@/lib/queries/admin";
import type { ListRow } from "@/lib/queries/admin-content";
import { DeleteButton } from "./DeleteButton";

const STATUS: Record<ContentStatus, { label: string; tone: "neutral" | "magenta" | "cyan" }> = {
  draft: { label: "Draft", tone: "neutral" },
  in_review: { label: "In review", tone: "magenta" },
  published: { label: "Published", tone: "cyan" },
};

const FILTERS = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In review" },
  { value: "published", label: "Published" },
] as const;

export function ContentList({
  kind,
  rows,
  q,
  status,
  remove,
}: {
  kind: "projects" | "posts";
  rows: ListRow[];
  q?: string;
  status?: ContentStatus;
  remove: (id: string) => Promise<void>;
}) {
  const base = `/admin/${kind}`;
  const noun = kind === "projects" ? "project" : "post";
  const options = FILTERS.map((f) => {
    const params = new URLSearchParams();
    if (f.value) params.set("status", f.value);
    if (q) params.set("q", q);
    const qs = params.toString();
    return { ...f, href: qs ? `${base}?${qs}` : base };
  });

  return (
    <section aria-labelledby="list-h" className="flex flex-col gap-[30px]">
      <div className="flex flex-wrap items-baseline justify-between gap-[15px]">
        <h1 id="list-h" className="text-[44px] leading-[52px]">
          {kind === "projects" ? "Projects" : "Blog posts"}
        </h1>
        <Link href={`${base}/new`} className={buttonStyles("primary", "text-white no-underline hover:text-white")}>
          New {noun}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-[20px]">
        <form action={base} role="search" className="w-full max-w-[320px]">
          <label htmlFor="list-q" className="sr-only">
            Search {kind}
          </label>
          <input
            id="list-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder={`Search ${kind}…`}
            className="bg-neutral-100 text-ink ring-neutral-300 w-full rounded-md px-3 py-2 text-[15px] ring-1 ring-inset"
          />
          {status ? <input type="hidden" name="status" value={status} /> : null}
        </form>
        <SegmentedLinks options={options} value={status ?? ""} label="Status" />
      </div>

      <table className="w-full text-left text-[17px]">
        <caption className="sr-only">{kind}</caption>
        <thead>
          <tr className="border-b border-neutral-300">
            <th scope="col" className="meta py-[10px] pr-[10px] font-normal">Title</th>
            <th scope="col" className="meta px-[10px] py-[10px] font-normal">Status</th>
            <th scope="col" className="meta px-[10px] py-[10px] font-normal">Updated</th>
            <th scope="col" className="py-[10px] pl-[10px]"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const s = STATUS[r.status];
            return (
              <tr key={r.id} className="border-b border-neutral-200">
                <td className="py-[15px] pr-[10px]">
                  <Link href={`${base}/${r.id}`} className="text-ink no-underline hover:text-cyan-700">
                    {r.title}
                  </Link>
                </td>
                <td className="px-[10px] py-[15px]"><Tag tone={s.tone}>{s.label}</Tag></td>
                <td className="px-[10px] py-[15px] whitespace-nowrap">{updatedLabel(r.updated_at)}</td>
                <td className="py-[15px] pl-[10px] text-right">
                  <DeleteButton title={r.title} action={remove.bind(null, r.id)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 ? <p className="text-ink/70">Nothing matches.</p> : null}
    </section>
  );
}
