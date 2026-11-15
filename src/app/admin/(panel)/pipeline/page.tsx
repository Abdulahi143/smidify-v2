import type { Metadata } from "next";
import { PipelineBoard } from "@/components/admin";
import { SegmentedLinks } from "@/components/ui";
import { KIND_FILTERS, isKind, type ProjectKind } from "@/lib/content/kinds";
import { getPipelineItems, type PipelineItem } from "@/lib/queries/pipeline";
import { PipelineItemEditor } from "@/components/admin/PipelineItemEditor";

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

// Studio pages wait for the request and viewer identity before rendering.
export const instant = false;

export default async function PipelinePage({
  searchParams,
}: PageProps<"/admin/pipeline">) {
  const { kind: raw } = await searchParams;
  const kind = typeof raw === "string" && isKind(raw) ? raw : "";

  const all = await getPipelineItems();
  const items = kind ? all.filter((i) => hasKind(i, kind)) : all;

  return (
    <div className="studio-content-page">
      <header className="studio-page-header">
        <div>
          <p className="studio-eyebrow">Keep work moving</p>
          <h1>Client pipeline</h1>
          <p className="studio-description">
            Drag cards between stages, or use each card’s stage selector.
          </p>
        </div>
        <div className="studio-page-actions">
          <PipelineItemEditor />
          <SegmentedLinks
            label="Filter by kind"
            value={kind}
            options={KIND_FILTERS.map((f) => ({
              ...f,
              href: f.value
                ? `/admin/pipeline?kind=${f.value}`
                : "/admin/pipeline",
            }))}
          />
        </div>
      </header>
      <div className="studio-panel studio-board-panel">
        <PipelineBoard items={items} />
      </div>
    </div>
  );
}
