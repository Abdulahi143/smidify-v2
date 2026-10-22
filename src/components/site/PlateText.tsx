import clsx from "clsx";

/** Text printed as misregistered CMYK plates. Announced once to screen readers. */
export function PlateText({
  as: Tag = "span",
  children,
  className,
}: {
  as?: "span" | "div";
  children: string;
  className?: string;
}) {
  return (
    <Tag
      role="img"
      aria-label={children}
      className={clsx("plate-head relative inline-block", className)}
    >
      <span className="paper" aria-hidden>
        {children}
      </span>
      <span className="plate plate-c" aria-hidden>
        {children}
      </span>
      <span className="plate plate-m" aria-hidden>
        {children}
      </span>
      <span className="plate plate-y" aria-hidden>
        {children}
      </span>
    </Tag>
  );
}
