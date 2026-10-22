import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Cover } from "@/components/site";
import { formatDate } from "@/lib/media";
import {
  POSTS_PER_PAGE,
  getFeaturedPost,
  getPostCategories,
  getPostsPage,
} from "@/lib/queries/posts";

export const metadata: Metadata = {
  title: "Blog — Smidify",
  description: "Notes on building, shipping and keeping things running.",
};

const wrap = "mx-auto max-w-[1280px] px-5 md:px-[72px]";
type SP = Promise<{ category?: string; page?: string }>;

function href(category?: string, page?: number) {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (page && page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `/blog?${s}` : "/blog";
}

async function Posts({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const categories = await getPostCategories();
  const category = sp.category && categories.includes(sp.category) ? sp.category : undefined;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const [featured, { posts, total }] = await Promise.all([
    getFeaturedPost(),
    getPostsPage(category, page),
  ]);
  const pages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  return (
    <>
      {featured && (
        <article className="mt-[60px] grid items-center gap-[30px] md:grid-cols-[7fr_5fr] md:gap-12">
          <Cover
            path={featured.cover_path}
            alt={featured.title}
            ratio="aspect-[3/2]"
            label="Featured post image"
            priority
            sizes="(min-width: 768px) 58vw, 100vw"
          />
          <div>
            <p className="meta text-[12px] text-cyan-700">
              {featured.category} · {formatDate(featured.published_at)}
            </p>
            <h2 className="mt-[15px] text-[30px] leading-9 md:text-[40px] md:leading-[46px]">
              {featured.title}
            </h2>
            <p className="text-ink/78 mt-[15px] text-[17px] leading-7">{featured.excerpt}</p>
            <Link href={`/blog/${featured.slug}`} className="mt-5 inline-block underline">
              Read the post →
            </Link>
          </div>
        </article>
      )}

      <nav aria-label="Categories" className="mt-[72px] flex flex-wrap gap-x-[30px] gap-y-2.5 text-[17px]">
        {[undefined, ...categories].map((c) => (
          <Link
            key={c ?? "all"}
            href={href(c)}
            aria-current={c === category ? "page" : undefined}
            className={c === category ? "text-ink no-underline" : ""}
          >
            {c ?? "All"}
          </Link>
        ))}
      </nav>

      <div className="mt-[30px] flex flex-col gap-[30px] md:gap-[40px]">
        {posts.map((p) => (
          <article key={p.id} className="grid gap-2.5 md:grid-cols-[160px_1fr_140px] md:gap-0">
            <p className="meta pt-2.5 text-[12px]">{formatDate(p.published_at)}</p>
            <div>
              <h3 className="text-[26px] leading-8">
                <Link href={`/blog/${p.slug}`} className="text-ink hover:text-cyan-700 no-underline">
                  {p.title}
                </Link>
              </h3>
              <p className="text-ink/78 mt-2.5 max-w-[56ch] text-[17px] leading-7">{p.excerpt}</p>
            </div>
            <p className="meta pt-2.5 text-[12px] text-cyan-700 md:text-right">{p.category}</p>
          </article>
        ))}
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-[60px] flex items-center gap-[30px] text-[17px]">
          {page > 1 && <Link href={href(category, page - 1)}>← Newer</Link>}
          <span className="text-ink/70">
            Page {page} of {pages}
          </span>
          {page < pages && <Link href={href(category, page + 1)}>Older →</Link>}
        </nav>
      )}
    </>
  );
}

export default function BlogPage({ searchParams }: { searchParams: SP }) {
  return (
    <div className={`${wrap} pt-16 pb-[84px] md:pt-28 md:pb-[112px]`}>
      <h1 className="text-[40px] leading-[46px] tracking-[-0.02em] md:text-[72px] md:leading-[78px]">
        Blog
      </h1>
      <p className="text-ink/78 mt-[15px] max-w-[30ch] text-[19px] leading-[30px]">
        Notes on building, shipping and keeping things running.
      </p>
      <Suspense>
        <Posts searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
