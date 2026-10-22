"use client";

import clsx from "clsx";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={clsx(
        "inline-flex rounded-md bg-neutral-200 p-[3px]",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "cursor-pointer rounded-sm px-4 py-1.5 font-serif text-[15px] transition-colors",
            o.value === value
              ? "bg-paper text-ink font-semibold shadow-md"
              : "text-ink/70 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
