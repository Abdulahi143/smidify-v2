import clsx from "clsx";

export const fieldControl =
  "font-serif w-full rounded-md bg-neutral-100 px-3 py-2.5 text-[17px] text-ink ring-1 ring-neutral-300 ring-inset placeholder:text-ink/50 disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:ring-magenta";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={clsx(fieldControl, className)} {...props} />;
}
