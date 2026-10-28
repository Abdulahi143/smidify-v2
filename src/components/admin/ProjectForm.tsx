"use client";

import clsx from "clsx";
import { Field, Input, Segmented, Textarea } from "@/components/ui";
import { KIND_LABEL } from "@/lib/content/kinds";
import { saveProject } from "@/lib/actions";
import type { AdminProject } from "@/lib/queries/admin-content";
import { PROJECT_KINDS, type ProjectInput } from "@/lib/validation";
import { EditorFrame } from "./EditorFrame";
import { GalleryUpload, ImageUpload } from "./ImageUpload";
import { STATUS_OPTIONS } from "./status";
import { useContentEditor } from "./useContentEditor";

export function toProjectInput(p: AdminProject | null): ProjectInput {
  return {
    id: p?.id ?? null,
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    summary: p?.summary ?? "",
    kinds: p?.kinds ?? [],
    client: p?.client ?? "",
    timeline: p?.timeline ?? "",
    year: p?.year ?? new Date().getFullYear(),
    cover_path: p?.cover_path ?? null,
    cover_alt: p?.cover_alt ?? "",
    gallery_paths: p?.gallery_paths ?? [],
    gallery_alts: p?.gallery_alts ?? [],
    problem: p?.problem ?? "",
    solution: p?.solution ?? "",
    result: p?.result ?? "",
    quote: p?.quote ?? "",
    quote_author: p?.quote_author ?? "",
    featured: p?.featured ?? false,
    status: p?.status ?? "draft",
  };
}

export function ProjectForm({ project, newId }: { project: AdminProject | null; newId?: string }) {
  const { values: v, set, errors, message, saving, dirty, savedAt, run, preview } = useContentEditor({
    initial: { ...toProjectInput(project), id: project?.id ?? newId ?? null },
    isNew: !project,
    table: "projects",
    save: saveProject,
    basePath: "/admin/projects",
    previewKind: "projects",
    savedAt: project?.updated_at ?? null,
  });
  const folder = `projects/${v.id}`;

  return (
    <EditorFrame
      backHref="/admin/projects"
      backLabel="Projects"
      status={v.status}
      saving={saving}
      dirty={dirty}
      savedAt={savedAt}
      message={message}
      onPreview={() => void preview()}
      onSave={() => void run()}
      onPublish={() => void run({ status: "published" })}
      main={
        <>
          <Field label="Project title" htmlFor="title" error={errors.title}>
            <Input
              id="title"
              value={v.title}
              maxLength={140}
              onChange={(e) => set({ title: e.target.value })}
              aria-invalid={errors.title ? true : undefined}
              className="px-4 py-3 text-[32px] leading-[40px] font-semibold"
            />
          </Field>
          <Field label="Summary" htmlFor="summary" error={errors.summary}>
            <Textarea
              id="summary"
              rows={3}
              value={v.summary}
              maxLength={400}
              onChange={(e) => set({ summary: e.target.value })}
              aria-invalid={errors.summary ? true : undefined}
            />
          </Field>
          <ImageUpload
            label="Cover image"
            folder={folder}
            path={v.cover_path}
            alt={v.cover_alt}
            onChange={({ path, alt }) => set({ cover_path: path, cover_alt: alt })}
            pathError={errors.cover_path}
            altError={errors.cover_alt}
            aspect="aspect-[16/8]"
          />
          <Field label="The problem" htmlFor="problem" error={errors.problem}>
            <Textarea id="problem" rows={5} value={v.problem} onChange={(e) => set({ problem: e.target.value })} />
          </Field>
          <Field label="What we built" htmlFor="solution" error={errors.solution}>
            <Textarea id="solution" rows={5} value={v.solution} onChange={(e) => set({ solution: e.target.value })} />
          </Field>
          <Field label="The result" htmlFor="result" error={errors.result}>
            <Textarea id="result" rows={5} value={v.result} onChange={(e) => set({ result: e.target.value })} />
          </Field>
          <Field label="Client quote" htmlFor="quote" error={errors.quote}>
            <Textarea id="quote" rows={3} value={v.quote} onChange={(e) => set({ quote: e.target.value })} />
          </Field>
          <Field label="Quote author" htmlFor="quote_author" error={errors.quote_author}>
            <Input id="quote_author" value={v.quote_author} onChange={(e) => set({ quote_author: e.target.value })} />
          </Field>
          <GalleryUpload
            folder={folder}
            paths={v.gallery_paths}
            alts={v.gallery_alts}
            onChange={({ paths, alts }) => set({ gallery_paths: paths, gallery_alts: alts })}
            errors={errors}
          />
        </>
      }
      side={
        <>
          <div className="flex flex-col gap-[5px]">
            <span className="meta">Status</span>
            <Segmented
              label="Status"
              options={STATUS_OPTIONS}
              value={v.status}
              onChange={(status) => set({ status })}
            />
          </div>

          <fieldset className="flex flex-col gap-[10px]">
            <legend className="meta mb-[5px]">Category</legend>
            <div className="flex flex-wrap gap-[10px]">
              {PROJECT_KINDS.map((k) => {
                const on = v.kinds.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set({ kinds: on ? v.kinds.filter((x) => x !== k) : [...v.kinds, k] })}
                    className={clsx(
                      "cursor-pointer rounded-sm px-3 py-1 text-[15px]",
                      on ? "text-cyan-700 ring-cyan ring-1 ring-inset" : "bg-neutral-100 text-ink",
                    )}
                  >
                    {KIND_LABEL[k]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Field label="Client" htmlFor="client" error={errors.client}>
            <Input id="client" value={v.client} onChange={(e) => set({ client: e.target.value })} />
          </Field>
          <Field label="Timeline" htmlFor="timeline" error={errors.timeline}>
            <Input id="timeline" value={v.timeline} onChange={(e) => set({ timeline: e.target.value })} />
          </Field>
          <Field label="Year" htmlFor="year" error={errors.year}>
            <Input
              id="year"
              type="number"
              inputMode="numeric"
              value={v.year ?? ""}
              onChange={(e) => set({ year: e.target.value === "" ? null : Number(e.target.value) })}
            />
          </Field>
          <Field label="URL" htmlFor="slug" error={errors.slug}>
            <div className="flex items-center gap-[5px]">
              <span className="text-ink/70">/work/</span>
              <Input
                id="slug"
                value={v.slug}
                maxLength={80}
                onChange={(e) => set({ slug: e.target.value })}
                aria-invalid={errors.slug ? true : undefined}
              />
            </div>
          </Field>

          <fieldset className="flex flex-col gap-[10px]">
            <legend className="meta mb-[5px]">Show on</legend>
            <label className="flex items-center gap-[10px] text-[17px]">
              <input
                type="checkbox"
                checked={v.featured}
                onChange={(e) => set({ featured: e.target.checked })}
                className="accent-cyan size-[18px]"
              />
              Home — Selected work
            </label>
            <label className="flex items-center gap-[10px] text-[17px] opacity-70">
              <input type="checkbox" checked={v.status === "published"} disabled className="accent-cyan size-[18px]" />
              Work page (once published)
            </label>
          </fieldset>
        </>
      }
    />
  );
}
