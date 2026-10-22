import type { Metadata } from "next";
import { PipelineBoard } from "@/components/admin";
import { SegmentedLinks } from "@/components/ui";
import { KIND_FILTERS, isKind, type ProjectKind } from "@/lib/content/kinds";
import { getPipelineItems, type PipelineItem } from "@/lib/queries/pipeline";

export const metadata: Metadata = { title: "Pipeline" };

const ALIASES: Record<ProjectKind, string[]> = {
  website: ["web", "website"],
  mobile: ["mobile"],
  network: ["network"],
  ai: ["ai"],
};

/** Item kinds are free text like "Web · AI", so match on whole words. */
function hasKind(item: PipelineItem, kind: ProjectKind) {
  const words = item.kind.toLowerCase().split(/[^a-z]+/);
  return ALIASES[kind].some((a) => words.includes(a));
}

export default async function PipelinePage({ searchParams }: PageProps<"/admin/pipeline">) {
  const { kind: raw } = await searchParams;
  const kind = typeof raw === "string" && isKind(raw) ? raw : "";

  const all = await getPipelineItems();
  const items = kind ? all.filter((i) => hasKind(i, kind)) : all;

  return (
    <div className="flex flex-col gap-[30px]">
      <header className="flex flex-wrap items-center justify-between gap-[15px]">
        <h1 className="text-[40px] leading-[46px] md:text-[56px] md:leading-[64px]">Pipeline</h1>
        <SegmentedLinks
          label="Filter by kind"
          value={kind}
          options={KIND_FILTERS.map((f) => ({
            ...f,
            href: f.value ? `/admin/pipeline?kind=${f.value}` : "/admin/pipeline",
          }))}
        />
      </header>
      <PipelineBoard items={items} />
    </div>
  );
}
