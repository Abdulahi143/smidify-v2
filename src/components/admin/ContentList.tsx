import { connection } from "next/server";
import Link from "next/link";
import { SegmentedLinks } from "@/components/ui";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Article } from "@phosphor-icons/react/dist/ssr/Article";
import { FolderSimple } from "@phosphor-icons/react/dist/ssr/FolderSimple";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { updatedLabel } from "@/lib/format";
import type { ContentStatus } from "@/lib/queries/admin";
import type { ListRow } from "@/lib/queries/admin-content";
import { DeleteButton } from "./DeleteButton";

const STATUS: Record<ContentStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};

const FILTERS = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In review" },
  { value: "published", label: "Published" },
] as const;

export async function ContentList({
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

  const Icon = kind === "projects" ? FolderSimple : Article;
  await connection();
  return (
    <section aria-labelledby="list-h" className="studio-content-page">
      <header className="studio-page-header">
        <div>
          <p className="studio-eyebrow">Manage content</p>
          <h1 id="list-h">{kind === "projects" ? "Projects" : "Blog posts"}</h1>
          <p className="studio-description">
            {kind === "projects"
              ? "The work you build. The stories behind it."
              : "Ideas and updates from the studio."}
          </p>
        </div>
        <Link
          href={`${base}/new`}
          className="studio-button studio-button-primary"
        >
          <Plus size={16} aria-hidden="true" />
          New {noun}
        </Link>
      </header>
      <div className="studio-panel">
        <div className="studio-list-filters">
          <SegmentedLinks
            options={options}
            value={status ?? ""}
            label="Status"
            className="studio-content-tabs"
          />
          <form action={base} role="search" className="studio-search">
            <MagnifyingGlass size={17} aria-hidden="true" />
            <label htmlFor="list-q" className="sr-only">
              Search {kind}
            </label>
            <input
              id="list-q"
              name="q"
              type="search"
              defaultValue={q}
              maxLength={100}
              placeholder={`Search ${kind}…`}
            />
            {status ? (
              <input type="hidden" name="status" value={status} />
            ) : null}
          </form>
        </div>
        {rows.length > 0 ? (
          <div
            className="studio-table-scroll"
            tabIndex={0}
            role="region"
            aria-label={`${kind} table`}
          >
            <table className="studio-content-table">
              <caption className="sr-only">{kind}</caption>
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Updated</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="studio-content-title">
                        <span className="studio-content-icon">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <div>
                          <Link href={`${base}/${row.id}`}>{row.title}</Link>
                          <span>
                            /{kind === "projects" ? "work" : "blog"}/{row.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`studio-status studio-status-${row.status}`}
                      >
                        <span aria-hidden="true" />
                        {STATUS[row.status]}
                      </span>
                    </td>
                    <td className="studio-updated">
                      {updatedLabel(row.updated_at) || "—"}
                    </td>
                    <td>
                      <DeleteButton
                        title={row.title}
                        action={remove.bind(null, row.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="studio-empty">
            <span className="studio-empty-icon">
              <Icon size={26} aria-hidden="true" />
            </span>
            <h3>
              {q || status
                ? "No matching content"
                : `Your first ${noun} starts here`}
            </h3>
            <p>
              {q || status
                ? "Try another search or status filter."
                : "Save a draft, add your content, and publish when it is ready."}
            </p>
            <Link
              href={q || status ? base : `${base}/new`}
              className="studio-text-link"
            >
              {q || status ? "Clear filters" : `Create a ${noun}`}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        )}
        <div className="studio-panel-footer">
          <span className="studio-list-count">
            {rows.length === 200
              ? "Showing the first 200 results. Search to narrow the list."
              : `${rows.length} ${rows.length === 1 ? noun : kind === "projects" ? "projects" : "posts"}`}
          </span>
        </div>
      </div>
    </section>
  );
}
