"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Article } from "@phosphor-icons/react/dist/ssr/Article";
import { FolderSimple } from "@phosphor-icons/react/dist/ssr/FolderSimple";
import { Globe } from "@phosphor-icons/react/dist/ssr/Globe";
import { Kanban } from "@phosphor-icons/react/dist/ssr/Kanban";
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { Stack } from "@phosphor-icons/react/dist/ssr/Stack";
import { Tray } from "@phosphor-icons/react/dist/ssr/Tray";
import { Images } from "@phosphor-icons/react/dist/ssr/Images";
import { GearSix } from "@phosphor-icons/react/dist/ssr/GearSix";
import { Wordmark } from "@/components/site/Wordmark";
import { signOut } from "@/lib/actions";
import type { AdminCounts } from "@/lib/queries/admin";

export function Sidebar({
  counts,
  email,
}: {
  counts: AdminCounts;
  email: string;
}) {
  const pathname = usePathname();
  const groups = [
    {
      label: "Workspace",
      items: [
        {
          href: "/admin",
          label: "Overview",
          icon: SquaresFour,
          count: undefined,
        },
        {
          href: "/admin/pipeline",
          label: "Client pipeline",
          icon: Kanban,
          count: counts.pipeline,
        },
      ],
    },
    {
      label: "Content",
      items: [
        {
          href: "/admin/website",
          label: "Website & milestones",
          icon: Globe,
          count: undefined,
        },
        {
          href: "/admin/projects",
          label: "Projects",
          icon: FolderSimple,
          count: counts.projects,
        },
        {
          href: "/admin/posts",
          label: "Blog posts",
          icon: Article,
          count: counts.posts,
        },
        {
          href: "/admin/services",
          label: "Services",
          icon: Stack,
          count: counts.services,
        },
      ],
    },
    {
      label: "Manage",
      items: [
        {
          href: "/admin/media",
          label: "Media library",
          icon: Images,
          count: undefined,
        },
        {
          href: "/admin/settings",
          label: "Settings",
          icon: GearSix,
          count: undefined,
        },
      ],
    },
    {
      label: "Inbox",
      items: [
        {
          href: "/admin/quotes",
          label: "Quote requests",
          icon: Tray,
          count: counts.quotes,
        },
      ],
    },
  ];
  const initial = email.trim().charAt(0).toUpperCase() || "S";
  return (
    <aside className="studio-sidebar">
      <Link
        href="/admin"
        aria-label="Smidify Studio home"
        className="studio-brand"
      >
        <Wordmark size="sm" />
        <span className="studio-brand-label">Studio</span>
      </Link>
      <div className="studio-workspace-label">
        <span className="studio-workspace-icon">
          <Globe size={18} aria-hidden="true" />
        </span>
        <div>
          <strong>Smidify</strong>
          <span>Studio workspace</span>
        </div>
      </div>
      <nav aria-label="Studio" className="studio-navigation">
        {groups.map((group) => (
          <div className="studio-nav-group" key={group.label}>
            <p className="studio-nav-label">{group.label}</p>
            <ul>
              {group.items.map(({ href, label, icon: Icon, count }) => {
                const current =
                  href === "/admin"
                    ? pathname === href
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={current ? "page" : undefined}
                      className={clsx(
                        "studio-nav-link",
                        current && "is-current",
                      )}
                    >
                      <Icon
                        size={19}
                        weight={current ? "fill" : "regular"}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                      {count !== undefined && count > 0 ? (
                        <span className="studio-nav-count">{count}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="studio-account">
        <span className="studio-avatar" aria-hidden="true">
          {initial}
        </span>
        <div className="studio-account-copy">
          <strong>Studio admin</strong>
          <span title={email}>{email}</span>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="studio-signout"
            aria-label="Sign out"
            title="Sign out"
          >
            <SignOut size={19} aria-hidden="true" />
          </button>
        </form>
      </div>
    </aside>
  );
}
