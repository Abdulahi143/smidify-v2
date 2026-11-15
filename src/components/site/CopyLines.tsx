import { Fragment } from "react";

export function Lines({
  value,
  accentLast = false,
}: {
  value: string | undefined;
  accentLast?: boolean;
}) {
  const lines = (value ?? "").split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {accentLast && i === lines.length - 1 ? <span>{line}</span> : line}
        </Fragment>
      ))}
    </>
  );
}
