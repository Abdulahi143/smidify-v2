import clsx from "clsx";

export function Halftone({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={clsx("halftone", className)} {...props} />;
}
