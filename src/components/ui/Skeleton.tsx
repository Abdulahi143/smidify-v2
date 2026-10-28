import clsx from "clsx";

/** Flat surface block used by `loading.tsx` files; no spinner, no shimmer. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx("bg-surface rounded-md", className)} />;
}
