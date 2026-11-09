import Link from "next/link";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
];

export async function Footer() {
  "use cache";

  return (
    <footer className="text-ink/70 mx-auto flex max-w-[1280px] flex-col gap-5 px-5 py-10 text-[13px] md:flex-row md:items-center md:justify-between md:px-[72px]">
      <p className="flex items-baseline gap-1">
        <span>© {new Date().getFullYear()}</span>
        <Wordmark size="sm" as="span" />
      </p>
      <nav aria-label="Footer">
        <ul className="flex flex-wrap gap-x-[30px] gap-y-2">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-ink/70 no-underline hover:text-cyan-700"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="mailto:hello@smidify.com"
              className="text-ink/70 no-underline hover:text-cyan-700"
            >
              hello@smidify.com
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
