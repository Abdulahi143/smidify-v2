"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { Wordmark } from "@/components/site/Wordmark";
import { signOut } from "@/lib/actions";
import type { AdminCounts } from "@/lib/queries/admin";

type Item = { href: string; label: string; count?: number };

export function Sidebar({ counts, email }: { counts: AdminCounts; email: string }) {
  const pathname = usePathname();
  const items: Item[] = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/pipeline", label: "Pipeline", count: counts.pipeline },
    { href: "/admin/projects", label: "Projects", count: counts.projects },
    { href: "/admin/website", label: "Website & milestones" },
    { href: "/admin/posts", label: "Blog posts", count: counts.posts },
    { href: "/admin/services", label: "Services", count: counts.services },
    { href: "/admin/quotes", label: "Quote requests", count: counts.quotes },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/settings", label: "Settings" },
  ];
  const isCurrent = (href: string) =>
    href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex flex-col gap-[30px] md:sticky md:top-0 md:h-screen md:py-[30px]">
      <div className="flex items-baseline gap-[10px] px-[15px]">
        <Link href="/admin" aria-label="Smidify admin home">
          <Wordmark size="md" />
        </Link>
        <span className="meta">Admin</span>
      </div>

      <nav aria-label="Admin" className="md:flex-1">
        <ul className="flex flex-wrap gap-[5px] md:flex-col">
          {items.map(({ href, label, count }) => {
            const current = isCurrent(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className={clsx(
                    "flex items-center justify-between gap-[10px] rounded-md px-[15px] py-[10px] text-[15px] no-underline hover:bg-cyan-100",
                    current ? "bg-cyan-100 text-cyan-800" : "text-ink hover:text-ink",
                  )}
                >
                  {label}
                  {count !== undefined ? (
                    <span className="text-ink/70 text-[13px]">{count}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-[10px] px-[15px]">
        <p className="text-[15px] leading-6">
          <span className="text-ink/70">Signed in as</span>
          <br />
          <span className="break-all">{email}</span>
        </p>
        <form action={signOut}>
          <Button type="submit" variant="ghost" className="text-[15px]">
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
