import { PlateText } from "./PlateText";
import clsx from "clsx";

const sizes = {
  sm: "text-[16px] tracking-[-0.01em]",
  md: "text-[22px] tracking-[-0.01em]",
  lg: "text-[48px] tracking-[-0.03em]",
  xl: "text-[72px] tracking-[-0.03em]",
} as const;

export function Wordmark({
  size = "md",
  as,
  className,
}: {
  size?: keyof typeof sizes;
  as?: "span" | "div";
  className?: string;
}) {
  return (
    <PlateText
      as={as}
      className={clsx(
        "font-serif leading-none font-semibold",
        sizes[size],
        className,
      )}
    >
      Smidify
    </PlateText>
  );
}
