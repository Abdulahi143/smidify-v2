import clsx from "clsx";
import { fieldControl } from "./Input";

export function Textarea({
  className,
  rows = 5,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={clsx(fieldControl, "resize-y", className)}
      {...props}
    />
  );
}
