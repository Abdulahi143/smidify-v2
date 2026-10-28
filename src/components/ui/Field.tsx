import clsx from "clsx";

export function Field({
  label,
  htmlFor,
  error,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  label: string;
  htmlFor: string;
  error?: string;
}) {
  return (
    <div className={clsx("flex flex-col gap-[5px]", className)} {...props}>
      <label htmlFor={htmlFor} className="meta">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-magenta text-[15px]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
