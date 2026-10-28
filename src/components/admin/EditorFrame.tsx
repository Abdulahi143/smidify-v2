"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { relativeTime } from "@/lib/format";

/** Top bar + two-column grid shared by the project and post editors. */
export function EditorFrame({
  backHref,
  backLabel,
  status,
  saving,
  dirty,
  savedAt,
  message,
  onPreview,
  onSave,
  onPublish,
  main,
  side,
}: {
  backHref: string;
  backLabel: string;
  status: string;
  saving: boolean;
  dirty: boolean;
  savedAt: string | null;
  message?: string;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
  main: React.ReactNode;
  side: React.ReactNode;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const published = status === "published";
  const label = saving
    ? "Saving…"
    : dirty
      ? "Unsaved changes"
      : savedAt
        ? `Saved ${relativeTime(savedAt, now).toLowerCase().replace(/^just now$/, "just now")}`
        : "Not saved yet";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-[15px] md:py-[30px]">
        <Link href={backHref} className="text-[17px] underline">
          ← {backLabel}
        </Link>
        <div className="flex-1" />
        <p role="status" aria-live="polite" className="text-ink/70 text-[17px]">
          {label}
        </p>
        <Button variant="ghost" onClick={onPreview}>
          Preview
        </Button>
        <Button variant="secondary" onClick={onSave} disabled={saving}>
          {published ? "Save changes" : "Save draft"}
        </Button>
        <Button onClick={onPublish} disabled={saving}>
          {published ? "Update" : "Publish"}
        </Button>
      </div>
      {message ? (
        <p role="alert" className="text-magenta mt-[10px] text-[17px]">
          {message}
        </p>
      ) : null}
      <div className="mt-[30px] grid gap-x-[40px] gap-y-[40px] lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-[30px]">{main}</div>
        <aside aria-label="Settings" className="flex flex-col gap-[30px]">
          {side}
        </aside>
      </div>
    </div>
  );
}
