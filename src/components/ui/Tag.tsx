import clsx from "clsx";

type Tone = "cyan" | "magenta" | "neutral" | "outline";

const tones: Record<Tone, string> = {
  cyan: "bg-cyan-100 text-cyan-800",
  magenta: "bg-magenta text-white",
  neutral: "bg-neutral-200 text-ink",
  outline: "text-ink ring-1 ring-ink/40 ring-inset",
};

export function Tag({
  tone = "cyan",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={clsx(
        "inline-block rounded-sm px-2 py-0.5 text-[13px] tracking-[.08em] uppercase",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
