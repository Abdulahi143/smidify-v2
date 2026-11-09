import Link from "next/link";
import { Cover, Markdown } from "@/components/site";
import { formatDate } from "@/lib/media";
import type { Post } from "@/lib/queries/posts";

const wrap = "mx-auto max-w-[1280px] px-5 md:px-[72px]";

export function PostArticle({ p }: { p: Post }) {
  return (
    <article className={`${wrap} pt-12 pb-[84px] md:pt-[72px] md:pb-[112px]`}>
      <Link href="/blog" className="text-[15px] underline">
        ← All posts
      </Link>
      <p className="meta mt-[30px] text-[12px] text-cyan-700">
        {p.category} · {formatDate(p.published_at)}
      </p>
      <h1 className="mt-[15px] max-w-[20ch] text-[40px] leading-[46px] tracking-[-0.02em] md:text-[64px] md:leading-[70px]">
        {p.title}
      </h1>
      <p className="mt-[30px] max-w-[44ch] text-[19px] leading-[30px]">{p.excerpt}</p>
      <div className="mt-10">
        <Cover
          path={p.cover_path}
          alt={p.cover_alt || p.title}
          ratio="aspect-[16/8]"
          label="Cover image"
          priority
          sizes="(min-width: 1280px) 1136px, 100vw"
        />
      </div>
      <div className="mt-[60px]">
        <Markdown>{p.body_md}</Markdown>
      </div>
    </article>
  );}
