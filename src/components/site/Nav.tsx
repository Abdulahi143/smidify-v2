"use client";

import { List, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "@/components/ui";
import clsx from "clsx";
import { defaultCompanyContent } from "@/lib/content/company";
import { usePathname } from "next/navigation";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/blog", label: "Blog" },
];

const FOCUSABLE = "a[href], button:not([disabled])";

export function Nav({
  copy = defaultCompanyContent.copy,
}: {
  copy?: Record<string, string>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const elements: HTMLElement[] = [
        ...(toggleRef.current ? [toggleRef.current] : []),
        ...Array.from(
          sheetRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
        ),
      ];
      if (!elements.length) return;
      e.preventDefault();
      const index = elements.indexOf(document.activeElement as HTMLElement);
      const next =
        (index + (e.shiftKey ? -1 : 1) + elements.length) % elements.length;
      elements[next]?.focus();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <header
      className={clsx("relative", pathname === "/" ? "cinema-nav" : "site-nav")}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-[1440px] items-center justify-between"
      >
        <Link href="/" aria-label="Smidify home" onClick={() => setOpen(false)}>
          <span className="brand-lockup">
            <Image
              src="/brand/smidify-keystone.svg"
              alt=""
              width={44}
              height={44}
              className="brand-keystone"
            />
            <Image
              src="/brand/smidify-wordmark.svg"
              alt="Smidify"
              width={180}
              height={48}
              className="site-brand-logo"
              priority
            />
            <sup className="brand-trademark" aria-label="trademark">
              ™
            </sup>
          </span>
        </Link>

        <div className="hidden items-center gap-[30px] lg:flex">
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
          className="-mr-2 cursor-pointer p-2 lg:hidden"
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
          className="bg-paper absolute inset-x-0 top-full z-50 px-5 pt-2 pb-8 lg:hidden"
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