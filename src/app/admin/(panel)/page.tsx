import { ContentTable, Greeting, PipelineBoard, QuoteList, StatRail } from "@/components/admin";
import { getAdminCounts, type ContentType } from "@/lib/queries/admin";
import { getSiteContent } from "@/lib/queries/admin";
import { getPipelineItems } from "@/lib/queries/pipeline";
import { getOpenQuoteRequests } from "@/lib/queries/quotes";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function parseType(v: string | string[] | undefined): ContentType {
  return v === "projects" || v === "posts" ? v : "all";
}

export default async function AdminOverview({ searchParams }: PageProps<"/admin">) {
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
    <div className="flex flex-col gap-[60px]">
      <header className="flex flex-col gap-[15px]">
        <Greeting />
        <p className="text-ink/75 text-[19px] leading-[30px] md:text-[22px]">
          {plural(counts.quotes, "new quote request")} and {plural(counts.drafts, "draft")} waiting
          for review.
        </p>
      </header>

      <StatRail
        stats={[
          { label: "Published projects", value: counts.publishedProjects },
          { label: "Blog posts", value: counts.publishedPosts },
          { label: "Drafts", value: counts.drafts },
          { label: "Quote requests", value: counts.quotes },
        ]}
      />

      <section aria-labelledby="pipeline-h">
        <div className="mb-[20px] flex flex-wrap items-baseline justify-between gap-[10px]">
          <h2 id="pipeline-h" className="text-[36px] leading-[44px]">
            Client pipeline
          </h2>
          <p className="text-ink/75 text-[17px]">Idea → production, {counts.pipeline} active</p>
        </div>
        <PipelineBoard items={items} />
      </section>

      <div className="grid gap-x-[40px] gap-y-[60px] lg:grid-cols-[7fr_4fr]">
        <ContentTable rows={rows} type={type} q={q || undefined} />
        <QuoteList quotes={quotes} />
      </div>
    </div>
  );
}
