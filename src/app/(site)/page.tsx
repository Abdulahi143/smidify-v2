import type { Metadata } from "next";
import Link from "next/link";
import {
  PlateText,
  PostRow,
  ProjectCard,
  QuoteForm,
  ServiceIndex,
} from "@/components/site";
import { buttonStyles } from "@/components/ui";
import { getLatestPosts } from "@/lib/queries/posts";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getServices } from "@/lib/queries/services";

export const metadata: Metadata = {
  title: "Smidify — Websites, apps, networks. Easy to work with.",
  description:
    "Smidify designs, builds and runs the software and infrastructure small and medium businesses depend on.",
};

const wrap = "mx-auto max-w-[1280px] px-5 md:px-[72px]";

export default async function Home() {
  const [services, projects, posts] = await Promise.all([
    getServices(),
    getFeaturedProjects(3),
    getLatestPosts(3),
  ]);

  return (
    <div className={wrap}>
      <section className="pt-16 pb-14 md:pt-28 md:pb-20">
        <h1 className="text-[44px] leading-[48px] tracking-[-0.02em] md:ml-[-0.035em] md:text-[84px] md:leading-[90px]">
          <PlateText as="span">Websites, apps, networks.</PlateText>
          <br />
          Easy to work with.
        </h1>
        <p className="mt-[30px] max-w-[56ch] text-[19px] leading-[30px]">
          Smidify designs, builds and runs the software and infrastructure small
          and medium businesses depend on — with AI built in where it genuinely
          saves you time.
        </p>
        <div className="mt-10 flex items-center gap-[30px]">
          <Link href="#quote" className={buttonStyles("primary", "text-white hover:text-white")}>
            Request a quote
          </Link>
          <Link href="/work" className={buttonStyles("ghost")}>
            See our work
          </Link>
        </div>
      </section>

      <ServiceIndex services={services} />

      <section className="pt-[84px] md:pt-[112px]" aria-labelledby="work-title">
        <div className="mb-[30px] flex items-baseline justify-between gap-5">
          <h2 id="work-title" className="text-[28px] md:text-[40px]">
            Selected work
          </h2>
          <Link href="/work" className="text-[16px] underline">
            All projects →
          </Link>
        </div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-[30px]">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section
        className="grid gap-10 pt-[84px] md:grid-cols-[5fr_7fr] md:pt-[112px]"
        aria-labelledby="blog-title"
      >
        <div>
          <h2 id="blog-title" className="text-[28px] md:text-[40px]">
            From the blog
          </h2>
          <p className="text-ink/78 mt-[15px] max-w-[28ch] text-[17px] leading-7">
            Notes on building, shipping and keeping things running.
          </p>
          <Link href="/blog" className="mt-5 inline-block underline">
            Read the blog →
          </Link>
        </div>
        <div className="flex flex-col gap-[30px]">
          {posts.map((p) => (
            <PostRow key={p.id} post={p} />
          ))}
        </div>
      </section>

      <section
        id="quote"
        className="scroll-mt-10 py-[84px] md:py-[112px]"
        aria-labelledby="quote-title"
      >
        <h2 id="quote-title" className="text-[32px] leading-[1.15] md:text-[44px]">
          Have a project in mind?
        </h2>
        <p className="text-ink/78 mt-[15px] mb-[30px] max-w-[44ch] text-[17px] leading-7">
          Tell us what you need. We reply within one working day with a
          plain-language estimate.
        </p>
        <QuoteForm variant="inline" />
      </section>
    </div>
  );
}
