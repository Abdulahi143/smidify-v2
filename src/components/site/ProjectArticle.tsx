import Link from "next/link";
import { Cover } from "@/components/site";
import { buttonStyles } from "@/components/ui";
import { KIND_LABEL } from "@/lib/content/kinds";
import type { Project } from "@/lib/queries/projects";

const wrap = "mx-auto max-w-[1280px] px-5 md:px-[72px]";

export function ProjectArticle({
  p,
  next,
}: {
  p: Project;
  next: Pick<Project, "slug" | "title"> | null;
}) {
  const facts = [
    ["Client", p.client],
    ["Services", p.kinds.map((k) => KIND_LABEL[k]).join(", ")],
    ["Timeline", p.timeline],
    ["Year", p.year?.toString()],
  ] as const;
  const parts = [
    ["The problem", p.problem],
    ["What we built", p.solution],
    ["The result", p.result],
  ] as const;

  return (
    <article className={`${wrap} pt-12 pb-[84px] md:pt-[72px] md:pb-[112px]`}>
      <Link href="/work" className="text-[15px] underline">
        ← All work
      </Link>
      <p className="meta mt-[30px] text-[12px] text-cyan-700">
        {p.kinds.map((k) => KIND_LABEL[k]).join(" · ")}
      </p>
      <h1 className="mt-[15px] max-w-[18ch] text-[40px] leading-[46px] tracking-[-0.02em] md:text-[72px] md:leading-[78px]">
        {p.title}
      </h1>
      <p className="mt-[30px] max-w-[44ch] text-[19px] leading-[30px]">{p.summary}</p>

      <div className="mt-[60px]">
        <div className="rule-masthead" />
        <dl className="grid grid-cols-2 gap-[30px] py-5 md:grid-cols-4">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="meta text-[11px]">{k}</dt>
              <dd className="mt-[5px] text-[16px]">{v ?? "—"}</dd>
            </div>
          ))}
        </dl>
        <div className="border-ink border-t" />
      </div>

      <div className="mt-10">
        <Cover
          path={p.cover_path}
          alt={p.cover_alt || `${p.title} — cover`}
          ratio="aspect-[16/8]"
          label="Hero image — app screens or photo"
          priority
          sizes="(min-width: 1280px) 1136px, 100vw"
        />
      </div>

      <div className="mt-[84px] flex flex-col gap-[72px]">
        {parts.map(([title, text]) =>
          text ? (
            <section key={title} className="grid gap-[15px] md:grid-cols-[4fr_7fr] md:gap-12">
              <h2 className="text-[28px] leading-9 md:text-[30px]">{title}</h2>
              <p className="text-ink/78 text-[17px] leading-7">{text}</p>
            </section>
          ) : null,
        )}
      </div>

      {p.quote && (
        <figure className="mt-[60px] md:grid md:grid-cols-[4fr_7fr] md:gap-12">
          <div className="md:col-start-2">
            <blockquote className="text-[24px] leading-[34px] italic indent-[-0.475em] md:text-[30px] md:leading-[42px]">
              “{p.quote}”
            </blockquote>
            {p.quote_author && (
              <figcaption className="text-ink/70 mt-[15px] text-[15px]">
                — {p.quote_author}
              </figcaption>
            )}
          </div>
        </figure>
      )}

      <div className="mt-[72px] grid gap-[30px] md:grid-cols-2 md:gap-12">
        {[0, 1].map((i) => (
          <Cover
            key={i}
            path={p.gallery_paths?.[i] ?? null}
            alt={p.gallery_alts?.[i] || `${p.title} — detail ${i + 1}`}
            ratio="aspect-[4/3]"
            label="Detail image"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ))}
      </div>

      <div className="mt-[84px] flex flex-wrap items-end justify-between gap-[30px]">
        {next ? (
          <div>
            <p className="meta text-[12px]">Next project</p>
            <Link
              href={`/work/${next.slug}`}
              className="text-ink hover:text-cyan-700 mt-[5px] inline-block text-[28px] no-underline md:text-[34px]"
            >
              {next.title} →
            </Link>
          </div>
        ) : (
          <span />
        )}
        <Link href="/#quote" className={buttonStyles("primary", "text-white hover:text-white")}>
          Request a quote
        </Link>
      </div>
    </article>
  );}
