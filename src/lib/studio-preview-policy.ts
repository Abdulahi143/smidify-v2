/** A preview is opt-in, development-only, and limited to literal loopback hosts. */
export function localStudioPreviewEnabled({
  mode,
  enabled,
  host,
}: {
  mode: string | undefined;
  enabled: string | undefined;
  host: string | null;
}): boolean {
  return (
    mode === "development" &&
    enabled === "1" &&
    Boolean(
      host && /^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(host),
    )
  );
}
