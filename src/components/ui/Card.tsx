import clsx from "clsx";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={clsx("bg-surface rounded-md p-3", className)} {...props} />
  );
}
