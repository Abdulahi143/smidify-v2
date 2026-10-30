import clsx from "clsx";
const sizes = {
  sm: "text-[29px]",
  md: "text-[37px]",
  lg: "text-[48px]",
  xl: "text-[72px]",
} as const;
export function Wordmark({
  size = "md",
  as: Tag = "span",
  className,
}: {
  size?: keyof typeof sizes;
  as?: "span" | "div";
  className?: string;
}) {
  return (
    <Tag
      className={clsx(
        "inline-flex items-center font-sans leading-none font-bold tracking-[-0.045em] whitespace-nowrap",
        sizes[size],
        className,
      )}
    >
      <svg
        className="brand-mark"
        width="44"
        height="44"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
        style={{
          width: "1.45em",
          height: "1.45em",
          flexShrink: 0,
          marginRight: 7,
        }}
      >
        <path
          d="M19 92h82M27 83c4-34 15-55 33-55s29 21 33 55"
          stroke="currentColor"
          strokeWidth="8"
        />
        <path d="m49 25 11-9 11 9-4 31H53Z" fill="currentColor" />
        <path d="M42 83V68M78 83V68" stroke="currentColor" strokeWidth="8" />
      </svg>
      Smidify
      <sup
        style={{
          fontSize: ".28em",
          position: "static",
          lineHeight: 1,
          letterSpacing: 0,
          alignSelf: "flex-start",
          marginLeft: 3,
          marginTop: ".7em",
        }}
      >
        ™
      </sup>
    </Tag>
  );
}
