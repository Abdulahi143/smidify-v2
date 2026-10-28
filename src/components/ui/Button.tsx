import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-cyan text-white hover:bg-cyan-600",
  secondary: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  ghost: "text-cyan-700 hover:text-cyan-600",
};

export function buttonStyles(variant: Variant = "primary", className?: string) {
  return clsx(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 font-serif text-[17px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45",
    variant === "ghost" && "px-0",
    variants[variant],
    className,
  );
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, className)}
      {...props}
    />
  );
}
