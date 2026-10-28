import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkCard } from "@/components/site";
import { SegmentedLinks } from "@/components/ui";
import { KIND_FILTERS, isKind } from "@/lib/content/kinds";
import { getProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Work — Smidify",
  description: "Things we've built and still look after.",
};

const wrap = "mx-auto max-w-[1280px] px-5 md:px-[72px]";

async function Projects({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind: raw } = await searchParams;
  const kind = isKind(raw) ? raw : undefined;
  const projects = await getProjects(kind);

  return (
    <>
      <div className="mt-[15px] flex flex-col gap-[30px] md:flex-row md:items-end md:justify-between">
        <p className="text-ink/78 text-[19px] leading-[30px]">
          Things we&apos;ve built and still look after.
        </p>
        <SegmentedLinks
          label="Filter by kind"
          value={kind ?? ""}
          options={KIND_FILTERS.map((f) => ({
            ...f,
            href: f.value ? `/work?kind=${f.value}` : "/work",
          }))}
        />
      </div>
      <div className="mt-10 grid gap-x-12 gap-y-[72px] md:grid-cols-2">
        {projects.length === 0 ? (
          <p className="text-ink/78 text-[17px]">No projects in this category yet.</p>
        ) : (
          projects.map((p) => <WorkCard key={p.id} project={p} />)
        )}
      </div>
    </>
  );
}

export default function WorkPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  return (
    <div className={`${wrap} pt-16 pb-[84px] md:pt-28 md:pb-[112px]`}>
      <h1 className="text-[40px] leading-[46px] tracking-[-0.02em] md:text-[72px] md:leading-[78px]">
        Work
      </h1>
      <Suspense>
        <Projects searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
