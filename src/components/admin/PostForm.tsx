"use client";

import { useId } from "react";
import { Field, Input, Segmented, Textarea } from "@/components/ui";
import { Markdown } from "@/components/site/Markdown";
import { savePost } from "@/lib/actions";
import type { AdminPost } from "@/lib/queries/admin-content";
import type { PostInput } from "@/lib/validation";
import { EditorFrame } from "./EditorFrame";
import { ImageUpload } from "./ImageUpload";
import { STATUS_OPTIONS } from "./status";
import { useContentEditor } from "./useContentEditor";

function toPostInput(p: AdminPost | null): PostInput {
  return {
    id: p?.id ?? null,
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    excerpt: p?.excerpt ?? "",
    body_md: p?.body_md ?? "",
    category: p?.category ?? "",
    cover_path: p?.cover_path ?? null,
    cover_alt: p?.cover_alt ?? "",
    featured: p?.featured ?? false,
    status: p?.status ?? "draft",
  };
}

export function PostForm({ post, newId, categories }: { post: AdminPost | null; newId?: string; categories: string[] }) {
  const { values: v, set, errors, message, saving, dirty, savedAt, run, preview } = useContentEditor({
    initial: { ...toPostInput(post), id: post?.id ?? newId ?? null },
    isNew: !post,
    table: "posts",
    save: savePost,
    basePath: "/admin/posts",
    previewKind: "posts",
    savedAt: post?.updated_at ?? null,
  });
  const listId = useId();

  return (
    <EditorFrame
      backHref="/admin/posts"
      backLabel="Blog posts"
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
          <Field label="Post title" htmlFor="title" error={errors.title}>
            <Input
              id="title"
              value={v.title}
              maxLength={160}
              onChange={(e) => set({ title: e.target.value })}
              aria-invalid={errors.title ? true : undefined}
              className="px-4 py-3 text-[32px] leading-[40px] font-semibold"
            />
          </Field>
          <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt}>
            <Textarea
              id="excerpt"
              rows={3}
              value={v.excerpt}
              maxLength={400}
              onChange={(e) => set({ excerpt: e.target.value })}
              aria-invalid={errors.excerpt ? true : undefined}
            />
          </Field>
          <ImageUpload
            label="Cover image"
            folder={`posts/${v.id}`}
            path={v.cover_path}
            alt={v.cover_alt}
            onChange={({ path, alt }) => set({ cover_path: path, cover_alt: alt })}
            pathError={errors.cover_path}
            altError={errors.cover_alt}
          />
          <div className="grid gap-[20px] xl:grid-cols-2">
            <Field label="Body (Markdown)" htmlFor="body" error={errors.body_md}>
              <Textarea
                id="body"
                rows={22}
                value={v.body_md}
                onChange={(e) => set({ body_md: e.target.value })}
                className="font-mono text-[15px] leading-6"
              />
            </Field>
            <div className="flex flex-col gap-[5px]">
              <span className="meta">Preview</span>
              <div className="bg-surface min-h-[200px] rounded-md p-[20px] text-[16px]">
                {v.body_md.trim() ? <Markdown>{v.body_md}</Markdown> : <p className="text-ink/70">Nothing to preview yet.</p>}
              </div>
            </div>
          </div>
        </>
      }
      side={
        <>
          <div className="flex flex-col gap-[5px]">
            <span className="meta">Status</span>
            <Segmented label="Status" options={STATUS_OPTIONS} value={v.status} onChange={(status) => set({ status })} />
          </div>
          <Field label="Category" htmlFor="category" error={errors.category}>
            <Input
              id="category"
              list={listId}
              value={v.category}
              maxLength={60}
              onChange={(e) => set({ category: e.target.value })}
              aria-invalid={errors.category ? true : undefined}
            />
            <datalist id={listId}>
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="URL" htmlFor="slug" error={errors.slug}>
            <div className="flex items-center gap-[5px]">
              <span className="text-ink/70">/blog/</span>
              <Input
                id="slug"
                value={v.slug}
                maxLength={80}
                onChange={(e) => set({ slug: e.target.value })}
                aria-invalid={errors.slug ? true : undefined}
              />
            </div>
          </Field>
          <label className="flex items-center gap-[10px] text-[17px]">
            <input
              type="checkbox"
              checked={v.featured}
              onChange={(e) => set({ featured: e.target.checked })}
              className="accent-cyan size-[18px]"
            />
            Featured post
          </label>
        </>
      }
    />
  );
}
