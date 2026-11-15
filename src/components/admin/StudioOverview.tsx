import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { Globe } from "@phosphor-icons/react/dist/ssr/Globe";
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { ContentTable } from "./ContentTable";
import { Greeting } from "./Greeting";
import { PipelineBoard } from "./PipelineBoard";
import { QuoteList } from "./QuoteList";
import { StatRail } from "./StatRail";
import type { AdminCounts, ContentRow, ContentType } from "@/lib/queries/admin";
import type { PipelineItem } from "@/lib/queries/pipeline";
import type { QuoteRequest } from "@/lib/queries/quotes";

export function StudioOverview({
  counts,
  items,
  rows,
  quotes,
  type,
  q,
}: {
  counts: AdminCounts;
  items: PipelineItem[];
  rows: ContentRow[];
  quotes: QuoteRequest[];
  type: ContentType;
  q?: string;
}) {
  return (
    <div className="studio-overview">
      <header className="studio-page-header">
        <div>
          <p className="studio-eyebrow">Workspace overview</p>
          <Greeting />
          <p className="studio-description">
            Your content, conversations, and projects in one place.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="studio-button studio-button-primary"
        >
          <Plus size={17} aria-hidden="true" />
          New project
        </Link>
      </header>
      <StatRail
        stats={[
          {
            label: "Published projects",
            value: counts.publishedProjects,
            href: "/admin/projects?status=published",
            note: "Live in your portfolio",
          },
          {
            label: "Published posts",
            value: counts.publishedPosts,
            href: "/admin/posts?status=published",
            note: "Stories on your blog",
          },
          {
            label: "Drafts & reviews",
            value: counts.drafts,
            href: "#content-h",
            note: "Content to keep moving",
          },
          {
            label: "New requests",
            value: counts.quotes,
            href: "/admin/quotes",
            note: "Conversations to start",
          },
        ]}
      />
      <section className="studio-website-card" aria-labelledby="website-card-h">
        <span className="studio-website-icon">
          <Globe size={26} weight="light" aria-hidden="true" />
        </span>
        <div>
          <p className="studio-eyebrow">Your website</p>
          <h2 id="website-card-h">Keep your story up to date.</h2>
          <p>Edit your website text and milestones. Preview, then publish.</p>
        </div>
        <Link
          href="/admin/website"
          className="studio-button studio-button-light"
        >
          Open website editor
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </section>
      <div className="studio-overview-columns">
        <ContentTable rows={rows} type={type} q={q} />
        <QuoteList quotes={quotes} />
      </div>
      <section
        className="studio-panel studio-pipeline-panel"
        aria-labelledby="pipeline-h"
      >
        <div className="studio-panel-heading">
          <div>
            <h2 id="pipeline-h">
              Client pipeline{" "}
              <span className="studio-count">{counts.pipeline}</span>
            </h2>
            <p>From the first idea to the next release.</p>
          </div>
          <Link href="/admin/pipeline" className="studio-text-link">
            Open board
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <PipelineBoard items={items} />
      </section>
    </div>
  );
}
