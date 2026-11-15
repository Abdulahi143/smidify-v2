"use client";

import { useStudioPreview } from "./StudioPreview";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { relativeTime } from "@/lib/format";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { FloppyDisk } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { UploadSimple } from "@phosphor-icons/react/dist/ssr/UploadSimple";

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
  const local = useStudioPreview();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const published = status === "published";
  const label = local
    ? "Local preview · edits are not saved"
    : saving
      ? "Saving…"
      : dirty
        ? "Unsaved changes"
        : savedAt
          ? `Saved ${relativeTime(savedAt, now)
              .toLowerCase()
              .replace(/^just now$/, "just now")}`
          : "Not saved yet";

  return (
    <div className="studio-editor">
      <div className="studio-editor-toolbar">
        <Link href={backHref} className="studio-text-link">
          <ArrowLeft size={16} aria-hidden="true" />
          {backLabel}
        </Link>
        <p role="status" aria-live="polite" className="studio-save-status">
          <CheckCircle size={15} aria-hidden="true" />
          {label}
        </p>
        <Button
          variant="ghost"
          onClick={onPreview}
          disabled={saving || (local && !savedAt)}
        >
          Preview
          <ArrowUpRight size={15} aria-hidden="true" />
        </Button>
        <Button variant="secondary" onClick={onSave} disabled={saving || local}>
          <FloppyDisk size={15} aria-hidden="true" />
          {published ? "Save changes" : "Save draft"}
        </Button>
        <Button onClick={onPublish} disabled={saving || local}>
          <UploadSimple size={15} aria-hidden="true" />
          {published ? "Update" : "Publish"}
        </Button>
      </div>
      {message ? (
        <p role="alert" className="studio-notice studio-notice-warning">
          {message}
        </p>
      ) : null}
      <div className="studio-editor-grid">
        <div className="studio-editor-body">{main}</div>
        <aside
          aria-label="Publishing settings"
          className="studio-editor-settings"
        >
          <div>
            <p className="studio-eyebrow">Publishing</p>
            <h2>Content settings</h2>
          </div>
          {side}
        </aside>
      </div>
    </div>
  );
}
