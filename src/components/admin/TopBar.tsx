import Link from "next/link";
import { buttonStyles } from "@/components/ui";
import { fieldControl } from "@/components/ui/Input";
import clsx from "clsx";

export function TopBar() {
  return (
    <div className="flex flex-wrap items-center gap-[15px] md:py-[30px]">
      <form action="/admin" role="search" className="w-full max-w-[360px]">
        <label htmlFor="admin-search" className="sr-only">
          Search projects, posts, requests
        </label>
        <input
          id="admin-search"
          name="q"
          type="search"
          placeholder="Search projects, posts, requests…"
          className={clsx(fieldControl, "py-2 text-[15px]")}
        />
      </form>
      <div className="flex-1" />
      <Link href="/admin/posts/new" className={buttonStyles("secondary", "no-underline hover:text-cyan-800")}>
        New post
      </Link>
      <Link href="/admin/projects/new" className={buttonStyles("primary", "text-white no-underline hover:text-white")}>
        New project
      </Link>
    </div>
  );
}
