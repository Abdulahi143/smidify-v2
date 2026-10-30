"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import { defaultCompanyContent } from "@/lib/content/company";
export function Nav({
  copy = defaultCompanyContent.copy,
}: {
  copy?: Record<string, string>;
}) {
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
    <header>
      <Link className="logo" href="/" aria-label="Smidify home">
        <Wordmark />
      </Link>
      <nav
        ref={menu}
        id="company-navigation"
        aria-label="Main navigation"
        className={open ? "open" : ""}
      >
        {[
          ["about", "navAbout"],
          ["approach", "navExpertise"],
          ["projects", "navProjects"],
          ["milestones", "navMilestones"],
          ["vision", "navVision"],
        ].map(([id, key]) => (
          <Link key={id} href={"/#" + id} onClick={() => setOpen(false)}>
            {copy[key!]}
          </Link>
        ))}
      </nav>
      <div className="nav-end">
        <span>{copy.navTagline}</span>
        <Link href="/#contact">{copy.navContact}</Link>
      </div>
      <button
        ref={toggle}
        className="menu"
        type="button"
        aria-expanded={open}
        aria-controls="company-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
    </header>
  );
}
