"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import { signOut } from "@/lib/actions";

const titles: Record<string, string> = {
  pipeline: "Client pipeline",
  projects: "Projects",
  website: "Website & milestones",
  posts: "Blog posts",
  services: "Services",
  quotes: "Quote requests",
  media: "Media library",
  settings: "Settings",
};

export function TopBar() {
  const pathname = usePathname();
  const [, , section, item] = pathname.split("/");
  const title = (section ? titles[section] : undefined) ?? "Overview";
  return (
    <header className="studio-topbar">
      <nav aria-label="Breadcrumb" className="studio-breadcrumb">
        <Link href="/admin">Studio</Link>
        <CaretRight size={12} aria-hidden="true" />
        {item ? (
          <>
            <Link href={`/admin/${section}`}>{title}</Link>
            <CaretRight size={12} aria-hidden="true" />
            <span>{item === "new" ? "Create" : "Edit"}</span>
          </>
        ) : (
          <span>{title}</span>
        )}
      </nav>
      <div className="studio-topbar-actions">
        <form action="/admin" role="search" className="studio-search">
          <MagnifyingGlass size={17} aria-hidden="true" />
          <label htmlFor="admin-search" className="sr-only">
            Search projects and posts
          </label>
          <input
            id="admin-search"
            name="q"
            type="search"
            placeholder="Search content…"
            maxLength={100}
          />
        </form>
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="studio-site-link"
          aria-label="View website in a new tab"
        >
          View website
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <form action={signOut} className="studio-mobile-signout">
          <button type="submit" aria-label="Sign out" title="Sign out">
            <SignOut size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </header>
  );
}
