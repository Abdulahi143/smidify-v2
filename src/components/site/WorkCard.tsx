import Link from "next/link";
import { Cover } from "./PostCover";
import { KIND_LABEL } from "@/lib/content/kinds";
import type { Project } from "@/lib/queries/projects";

export function WorkCard({ project }: { project: Project }) {
  return (
    <article>
      <Link href={`/work/${project.slug}`} className="text-ink hover:text-ink block no-underline">
        <Cover
          path={project.cover_path}
          ratio="aspect-[16/10]"
          label="Project screenshot"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <p className="mt-[15px] flex gap-[15px] text-[12px] tracking-[.08em] uppercase">
          <span className="text-cyan-700">
            {project.kinds.map((k) => KIND_LABEL[k]).join(" · ")}
          </span>
          <span className="text-ink/70">{project.year}</span>
        </p>
        <h2 className="mt-2.5 text-[26px] leading-8">{project.title}</h2>
        <p className="text-ink/78 mt-2.5 max-w-[46ch] text-[16px] leading-[26px] font-normal">
          {project.summary}
        </p>
      </Link>
    </article>
  );
}
