import clsx from "clsx";
import Link from "next/link";

/** Server-rendered filter: each option is a plain link, so it works without JS. */
export function SegmentedLinks({
  options,
  value,
  label,
  className,
}: {
  options: readonly { href: string; value: string; label: string }[];
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={clsx("inline-flex rounded-md bg-neutral-200 p-[3px]", className)}
    >
      {options.map((o) => (
        <Link
          key={o.value}
          href={o.href}
          aria-current={o.value === value ? "page" : undefined}
          className={clsx(
            "rounded-sm px-4 py-1.5 text-[15px] no-underline transition-colors",
            o.value === value
              ? "bg-paper text-ink font-semibold shadow-md"
              : "text-cyan-700 hover:text-cyan-600",
          )}
        >
          {o.label}
        </Link>
      ))}
    </nav>
  );
}
