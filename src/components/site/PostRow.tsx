import Link from "next/link";
import type { Post } from "@/lib/queries/posts";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function PostRow({ post }: { post: Post }) {
  return (
    <article className="grid gap-2.5 md:grid-cols-[120px_1fr] md:gap-0">
      <p className="meta pt-1.5 text-[12px]">
        {post.published_at ? dateFmt.format(new Date(post.published_at)) : null}
      </p>
      <div>
        <h3 className="text-[22px] leading-[28px]">
          <Link href={`/blog/${post.slug}`} className="text-ink hover:text-cyan-700 no-underline">
            {post.title}
          </Link>
        </h3>
        <p className="text-ink/78 mt-1.5 text-[15px] leading-6">{post.excerpt}</p>
      </div>
    </article>
  );
}
