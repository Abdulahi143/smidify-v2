"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { buttonStyles } from "@/components/ui";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/blog", label: "Blog" },
];

const FOCUSABLE = "a[href], button:not([disabled])";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    sheet?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !sheet) return;
      // DOM order: menu toggle, then sheet contents
      const ordered = [
        ...(toggleRef.current ? [toggleRef.current] : []),
        ...sheet.querySelectorAll<HTMLElement>(FOCUSABLE),
      ];
      const first = ordered[0];
      const last = ordered[ordered.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="relative">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-7 md:px-[72px]"
      >
        <Link href="/" aria-label="Smidify home" onClick={() => setOpen(false)}>
          <Wordmark size="md" className="lg:text-[34px]" />
        </Link>

        <div className="hidden items-center gap-[30px] md:flex">
          <ul className="flex items-center gap-[30px]">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isCurrent(href) ? "page" : undefined}
                  className={clsx(
                    "text-[16px] no-underline hover:text-cyan-700",
                    isCurrent(href) ? "text-cyan-700" : "text-ink",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#quote"
            className={buttonStyles(
              "primary",
              "text-white no-underline hover:text-white",
            )}
          >
            Request a quote
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 cursor-pointer p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => (open ? close() : setOpen(true))}
        >
          {open ? (
            <X size={28} weight="duotone" aria-hidden />
          ) : (
            <List size={28} weight="duotone" aria-hidden />
          )}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          ref={sheetRef}
          className="bg-paper absolute inset-x-0 top-full z-50 px-5 pt-2 pb-8 md:hidden"
        >
          <ul className="flex flex-col gap-5">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isCurrent(href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "text-[22px] font-semibold no-underline hover:text-cyan-700",
                    isCurrent(href) ? "text-cyan-700" : "text-ink",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#quote"
            onClick={() => setOpen(false)}
            className={buttonStyles(
              "primary",
              "mt-8 text-white no-underline hover:text-white",
            )}
          >
            Request a quote
          </Link>
        </div>
      )}
    </header>
  );
}
