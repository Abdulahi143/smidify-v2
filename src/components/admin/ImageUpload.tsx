"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Button, Field, Halftone, Input } from "@/components/ui";
import { mediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Uploads straight to the `media` bucket as the signed-in admin; returns the object path. */
async function upload(folder: string, file: File): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error("Use a JPG, PNG, WebP or AVIF image.");
  if (file.size > MAX_BYTES) throw new Error("Images must be under 8 MB.");
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await createClient().storage.from("media").upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) throw error;
  return path;
}

export function ImageUpload({
  label,
  folder,
  path,
  alt,
  onChange,
  pathError,
  altError,
  aspect = "aspect-[16/8]",
}: {
  label: string;
  folder: string;
  path: string | null;
  alt: string;
  onChange: (next: { path: string | null; alt: string }) => void;
  pathError?: string;
  altError?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [over, setOver] = useState(false);

  async function handle(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(undefined);
    try {
      onChange({ path: await upload(folder, file), alt });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <span id={`${id}-label`} className="meta">
        {label}
      </span>
      <Halftone
        className={`${aspect} bg-neutral-200 ${over ? "ring-cyan ring-2" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void handle(e.dataTransfer.files[0]);
        }}
      >
        {path ? <Image src={mediaUrl(path)} alt="" fill sizes="720px" className="object-cover" /> : null}
        <button
          type="button"
          aria-labelledby={`${id}-label`}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="text-ink/70 absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-[17px] disabled:cursor-wait"
        >
          {busy ? "Uploading…" : path ? <span className="bg-paper rounded-md px-3 py-1">Replace image</span> : "Drop an image or click to upload"}
        </button>
      </Halftone>
      <input
        ref={inputRef}
        type="file"
        accept={TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          void handle(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error || pathError ? (
        <p role="alert" className="text-magenta text-[15px]">
          {error ?? pathError}
        </p>
      ) : null}
      {path ? (
        <div className="flex flex-col gap-[10px]">
          <Field label="Alt text" htmlFor={`${id}-alt`} error={altError}>
            <Input
              id={`${id}-alt`}
              value={alt}
              maxLength={200}
              aria-invalid={altError ? true : undefined}
              onChange={(e) => onChange({ path, alt: e.target.value })}
              placeholder="Describe the image for screen readers"
            />
          </Field>
          <Button variant="ghost" className="self-start text-[15px]" onClick={() => onChange({ path: null, alt: "" })}>
            Remove image
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function GalleryUpload({
  folder,
  paths,
  alts,
  onChange,
  errors,
}: {
  folder: string;
  paths: string[];
  alts: string[];
  onChange: (next: { paths: string[]; alts: string[] }) => void;
  errors: Record<string, string>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(undefined);
    try {
      const added: string[] = [];
      for (const f of Array.from(files).slice(0, 12 - paths.length)) added.push(await upload(folder, f));
      onChange({ paths: [...paths, ...added], alts: [...alts, ...added.map(() => "")] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-[15px]">
      <span className="meta">Gallery</span>
      {paths.length ? (
        <ul className="grid gap-[20px] sm:grid-cols-2">
          {paths.map((p, i) => (
            <li key={p} className="flex flex-col gap-[10px]">
              <Halftone className="relative aspect-[4/3] bg-neutral-200">
                <Image src={mediaUrl(p)} alt="" fill sizes="340px" className="object-cover" />
              </Halftone>
              <Field label={`Alt text ${i + 1}`} htmlFor={`gallery-alt-${i}`} error={errors[`gallery_alts.${i}`]}>
                <Input
                  id={`gallery-alt-${i}`}
                  value={alts[i] ?? ""}
                  maxLength={200}
                  onChange={(e) => onChange({ paths, alts: alts.map((a, j) => (j === i ? e.target.value : a)) })}
                />
              </Field>
              <Button
                variant="ghost"
                className="self-start text-[15px]"
                onClick={() =>
                  onChange({ paths: paths.filter((_, j) => j !== i), alts: alts.filter((_, j) => j !== i) })
                }
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-label="Add gallery images"
        onChange={(e) => {
          void add(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? (
        <p role="alert" className="text-magenta text-[15px]">
          {error}
        </p>
      ) : null}
      {paths.length < 12 ? (
        <Button variant="secondary" className="self-start" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Uploading…" : "Add images"}
        </Button>
      ) : null}
    </div>
  );
}
