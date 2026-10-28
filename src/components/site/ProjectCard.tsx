import Image from "next/image";
import Link from "next/link";
import { Halftone } from "@/components/ui";
import type { Project } from "@/lib/queries/projects";

const KIND_LABEL: Record<Project["kinds"][number], string> = {
  website: "Website",
  mobile: "Mobile app",
  network: "Network",
  ai: "AI",
};

function coverUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article>
      <Link
        href={`/work/${project.slug}`}
        className="text-ink hover:text-ink block no-underline"
      >
        <Halftone className="bg-neutral-200 relative aspect-[4/3]">
          {project.cover_path ? (
            <Image
              src={coverUrl(project.cover_path)}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="text-ink/70 absolute bottom-2.5 left-2.5 text-[13px]">
              Project screenshot
            </span>
          )}
        </Halftone>
        <p className="text-cyan-700 mt-[15px] text-[12px] tracking-[.08em] uppercase">
          {project.kinds.map((k) => KIND_LABEL[k]).join(" · ")}
        </p>
        <h3 className="mt-2.5 text-[22px] leading-[28px]">{project.title}</h3>
        <p className="text-ink/78 mt-2.5 text-[15px] leading-6 font-normal">
          {project.summary}
        </p>
      </Link>
    </article>
  );
}
