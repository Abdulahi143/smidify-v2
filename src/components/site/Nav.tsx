"use client";

import Image from "next/image";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { buttonStyles } from "@/components/ui";

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
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector("a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const links = Array.from(
          menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
        );
        const elements: HTMLElement[] = [
          ...(toggle.current ? [toggle.current] : []),
          ...links,
        ];
        if (!elements.length) return;
        e.preventDefault();
        const index = elements.indexOf(document.activeElement as HTMLElement);
        const next =
          (index + (e.shiftKey ? -1 : 1) + elements.length) % elements.length;
        elements[next]?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);
  return (
    <header
      className={clsx("relative", pathname === "/" ? "cinema-nav" : "site-nav")}
    >
      <nav
        ref={menu}
        id="company-navigation"
        aria-label="Main navigation"
        className={open ? "open" : ""}
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
