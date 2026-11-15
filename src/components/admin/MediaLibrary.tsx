"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderSimple } from "@phosphor-icons/react/dist/ssr/FolderSimple";
import { ImageSquare } from "@phosphor-icons/react/dist/ssr/ImageSquare";
import { Button } from "@/components/ui";
import { mediaUrl } from "@/lib/media";
import { deleteMedia } from "@/lib/actions/media";
import type { MediaEntry } from "@/lib/queries/media";
import { uploadMedia } from "./ImageUpload";
import { useStudioPreview } from "./StudioPreview";

export function MediaLibrary({
  entries,
  folder,
}: {
  entries: MediaEntry[];
  folder: string;
}) {
  const local = useStudioPreview();
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function upload(files: FileList | null) {
    if (local || busy || !files?.length) return;
    setBusy(true);
    setError("");
    setNotice("");
    let completed = 0;
    try {
      for (const file of Array.from(files).slice(0, 12)) {
        await uploadMedia(folder || "library", file);
        completed++;
      }
      setNotice(`${completed} image${completed === 1 ? "" : "s"} uploaded.`);
    } catch (e) {
      setError(
        `${completed ? `${completed} images uploaded. ` : ""}${e instanceof Error ? e.message : "Upload failed."}`,
      );
    } finally {
      setBusy(false);
      router.refresh();
    }
  }
  async function remove(entry: MediaEntry) {
    if (
      local ||
      busy ||
      !window.confirm(
        `Delete “${entry.name}”? Only unused images can be deleted.`,
      )
    )
      return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await deleteMedia(entry.path);
      setNotice("Image deleted.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete image.");
    } finally {
      setBusy(false);
    }
  }
  const parent = folder.split("/").slice(0, -1).join("/");
  return (
    <div className="studio-content-page">
      <header className="studio-page-header">
        <div>
          <p className="studio-eyebrow">Your assets</p>
          <h1>Media library</h1>
          <p className="studio-description">
            Browse images, upload assets, and copy their public links.
          </p>
        </div>
        <Button disabled={local || busy} onClick={() => input.current?.click()}>
          {busy ? "Working…" : "Upload images"}
        </Button>
      </header>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-label="Upload media images"
        onChange={(e) => {
          void upload(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? (
        <p role="alert" className="studio-notice studio-notice-warning">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p role="status" className="studio-notice">
          {notice}
        </p>
      ) : null}
      <div className="studio-panel studio-media-panel">
        <div className="studio-panel-heading">
          <div>
            <h2>{folder || "All media"}</h2>
            <p>JPG, PNG, WebP or AVIF. Up to 8 MB per image.</p>
          </div>
          {folder ? (
            <Link
              href={
                parent
                  ? `/admin/media?folder=${encodeURIComponent(parent)}`
                  : "/admin/media"
              }
              className="studio-text-link"
            >
              ← Parent folder
            </Link>
          ) : (
            <Link
              href="/admin/media?folder=library"
              className="studio-text-link"
            >
              Open upload folder →
            </Link>
          )}
        </div>
        {entries.length === 0 ? (
          <div className="studio-empty">
            <span className="studio-empty-icon">
              <ImageSquare size={26} aria-hidden="true" />
            </span>
            <h3>No images in this folder</h3>
            <p>Upload an image to get started.</p>
          </div>
        ) : (
          <ul className="studio-media-grid">
            {entries.map((entry) => (
              <li key={entry.path} className="studio-media-card">
                {entry.kind === "folder" ? (
                  <Link
                    href={`/admin/media?folder=${encodeURIComponent(entry.path)}`}
                    className="studio-media-folder"
                  >
                    <FolderSimple size={38} aria-hidden="true" />
                    <strong>{entry.name}</strong>
                    <span>Open folder →</span>
                  </Link>
                ) : (
                  <>
                    <div className="studio-media-image">
                      {entry.kind === "image" ? (
                        <Image
                          src={mediaUrl(entry.path)}
                          alt={entry.name}
                          fill
                          sizes="(max-width: 700px) 90vw, 300px"
                          className="object-contain"
                        />
                      ) : (
                        <ImageSquare size={35} aria-hidden="true" />
                      )}
                    </div>
                    <div className="studio-media-info">
                      <strong title={entry.name}>{entry.name}</strong>
                      <span>
                        {entry.size === null
                          ? "Image asset"
                          : `${Math.max(1, Math.round(entry.size / 1024))} KB`}
                      </span>
                      <div className="studio-media-actions">
                        <a
                          href={mediaUrl(entry.path)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open ↗
                        </a>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                new URL(
                                  mediaUrl(entry.path),
                                  window.location.origin,
                                ).href,
                              );
                              setNotice("Image URL copied.");
                            } catch {
                              setError(
                                "Could not copy the URL. Open the image to copy its address.",
                              );
                            }
                          }}
                        >
                          Copy URL
                        </button>
                        <button
                          type="button"
                          disabled={local || busy}
                          onClick={() => void remove(entry)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {entries.length === 200 ? (
          <p className="studio-media-limit">
            Showing the first 200 items in this folder.
          </p>
        ) : null}
      </div>
    </div>
  );
}
