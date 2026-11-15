import { connection } from "next/server";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Article } from "@phosphor-icons/react/dist/ssr/Article";
import { FolderSimple } from "@phosphor-icons/react/dist/ssr/FolderSimple";
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { SegmentedLinks } from "@/components/ui";
import { updatedLabel } from "@/lib/format";
import type {
  ContentRow,
  ContentStatus,
  ContentType,
} from "@/lib/queries/admin";

const STATUS: Record<ContentStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
};
const TYPES = [
  { value: "all", label: "All content" },
  { value: "projects", label: "Projects" },
  { value: "posts", label: "Posts" },
] as const;

export async function ContentTable({
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
    return { ...t, href: `${qs ? `/admin?${qs}` : "/admin"}#content-h` };
  });
  await connection();
  return (
    <section
      aria-labelledby="content-h"
      className="studio-panel studio-content-panel"
    >
      <div className="studio-panel-heading">
        <div>
          <h2 id="content-h" tabIndex={-1}>
            Recent content
          </h2>
          <p>
            {q ? `Search results for “${q}”` : "Pick up where you left off."}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="studio-icon-button"
          aria-label="Create a blog post"
          title="Create a blog post"
        >
          <Plus size={18} aria-hidden="true" />
        </Link>
      </div>
      <SegmentedLinks
        options={options}
        value={type}
        label="Content type"
        className="studio-content-tabs"
      />
      {rows.length > 0 ? (
        <div
          className="studio-table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Recent content table"
        >
          <table className="studio-content-table">
            <caption className="sr-only">
              Recently updated projects and blog posts
            </caption>
            <thead>
              <tr>
                <th scope="col">Content</th>
                <th scope="col">Status</th>
                <th scope="col">Updated</th>
                <th scope="col">
                  <span className="sr-only">Open editor</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const Icon = r.type === "project" ? FolderSimple : Article;
                return (
                  <tr key={`${r.type}-${r.id}`}>
                    <td>
                      <div className="studio-content-title">
                        <span className="studio-content-icon">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <div>
                          <Link
                            href={`/admin/${r.type === "project" ? "projects" : "posts"}/${r.id}`}
                          >
                            {r.title}
                          </Link>
                          <span>
                            {r.type === "project" ? "Project" : "Blog post"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`studio-status studio-status-${r.status}`}
                      >
                        <span aria-hidden="true" />
                        {STATUS[r.status]}
                      </span>
                    </td>
                    <td className="studio-updated">
                      {updatedLabel(r.updated_at) || "—"}
                    </td>
                    <td>
                      <ArrowRight size={15} aria-hidden="true" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="studio-empty">
          <span className="studio-empty-icon">
            <FolderSimple size={25} aria-hidden="true" />
          </span>
          <h3>
            {q ? "No matching content" : "A fresh start for your next idea"}
          </h3>
          <p>
            {q
              ? "Try another search or content filter."
              : "Create a project or write your first blog post."}
          </p>
          <Link
            href={q ? "/admin#content-h" : "/admin/projects/new"}
            className="studio-text-link"
          >
            {q ? "Clear search" : "Create a project"}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      )}
      <div className="studio-panel-footer">
        <Link href="/admin/projects" className="studio-text-link">
          All projects
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link href="/admin/posts" className="studio-text-link">
          All posts
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
