import { siteUrl } from "@/lib/media";
import { getAllPosts } from "@/lib/queries/posts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const base = siteUrl();
  const posts = await getAllPosts();
  const items = posts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${base}/blog/${p.slug}</link>
<guid>${base}/blog/${p.slug}</guid>
<description>${esc(p.excerpt)}</description>
<category>${esc(p.category)}</category>${
        p.published_at ? `\n<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : ""
      }
</item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Smidify blog</title>
<link>${base}/blog</link>
<description>Notes on building, shipping and keeping things running.</description>
${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
