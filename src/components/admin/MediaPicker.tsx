"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { FolderSimple } from "@phosphor-icons/react/dist/ssr/FolderSimple";
import { browseMedia } from "@/lib/actions/media";
import type { MediaEntry } from "@/lib/queries/media";
import { mediaUrl } from "@/lib/media";

export function MediaPicker({
  onChoose,
  disabled = false,
}: {
  onChoose: (path: string) => void;
  disabled?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const label = useId();
  const [entries, setEntries] = useState<MediaEntry[]>([]);
  const [folder, setFolder] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function load(next: string) {
    setBusy(true);
    setError("");
    try {
      setEntries(await browseMedia(next));
      setFolder(next);
    } catch {
      setError("Could not load the image library. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="secondary"
        className="self-start"
        disabled={disabled}
        onClick={() => {
          dialog.current?.showModal();
          void load("");
        }}
      >
        Choose from library
      </Button>
      <dialog
        ref={dialog}
        aria-labelledby={label}
        className="studio-dialog studio-image-picker"
      >
        <div className="studio-page-header">
          <div>
            <h2 id={label}>Choose an image</h2>
            <p className="studio-description">{folder || "Media library"}</p>
          </div>
          <Button variant="ghost" onClick={() => dialog.current?.close()}>
            Close
          </Button>
        </div>
        {folder ? (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => void load(folder.split("/").slice(0, -1).join("/"))}
          >
            ← Parent folder
          </Button>
        ) : null}
        {error ? (
          <p role="alert" className="studio-notice studio-notice-warning">
            {error}
          </p>
        ) : null}
        {busy ? (
          <p role="status" className="studio-notice">
            Loading images…
          </p>
        ) : (
          <ul className="studio-picker-grid">
            {entries
              .filter((entry) => entry.kind !== "file")
              .map((entry) => (
                <li key={entry.path}>
                  <button
                    type="button"
                    className="studio-picker-image"
                    onClick={() => {
                      if (entry.kind === "folder") void load(entry.path);
                      else {
                        onChoose(entry.path);
                        dialog.current?.close();
                      }
                    }}
                  >
                    {entry.kind === "folder" ? (
                      <FolderSimple size={35} aria-hidden="true" />
                    ) : (
                      <span className="studio-picker-thumbnail">
                        <Image
                          src={mediaUrl(entry.path)}
                          alt=""
                          fill
                          sizes="200px"
                          className="object-contain"
                        />
                      </span>
                    )}
                    <span>{entry.name}</span>
                  </button>
                </li>
              ))}
          </ul>
        )}
        {!busy && !error && entries.length === 0 ? (
          <p className="studio-notice">
            No images in this folder. Upload one in Media library.
          </p>
        ) : null}
      </dialog>
    </>
  );
}
