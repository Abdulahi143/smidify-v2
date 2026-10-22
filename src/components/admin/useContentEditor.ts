"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { checkSlug, type SaveResult } from "@/lib/actions";
import { slugify } from "@/lib/validation";
import { useAutosave } from "./useAutosave";

type Base = { id: string | null; title: string; slug: string; status: "draft" | "in_review" | "published" };

/**
 * Shared state for the project and post editors: dirty tracking, 10s autosave for
 * unpublished items, slug generation + uniqueness check, and save/publish/preview.
 */
export function useContentEditor<V extends Base>({
  initial,
  table,
  save,
  basePath,
  previewKind,
  savedAt: initialSavedAt,
  isNew,
}: {
  initial: V;
  table: "projects" | "posts";
  save: (v: V) => Promise<SaveResult>;
  basePath: string;
  previewKind: "projects" | "posts";
  savedAt: string | null;
  isNew: boolean;
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(initialSavedAt);
  const [persistedStatus, setPersistedStatus] = useState(initial.status);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(initial));
  const persisted = useRef(!isNew);
  const slugTouched = useRef(!isNew);
  const inFlight = useRef(false);

  const dirty = JSON.stringify(values) !== snapshot;

  const set = useCallback((patch: Partial<V>) => {
    setValues((v) => {
      const next = { ...v, ...patch };
      if (patch.slug !== undefined) slugTouched.current = true;
      else if (patch.title !== undefined && !slugTouched.current) next.slug = slugify(patch.title);
      return next;
    });
  }, []);

  const run = useCallback(
    async (override?: Partial<V>): Promise<string | null> => {
      if (inFlight.current) return null;
      inFlight.current = true;
      setSaving(true);
      setMessage(undefined);
      const payload = { ...values, ...override };
      try {
        const res = await save(payload);
        if (!res.ok) {
          setErrors(res.fieldErrors);
          setMessage(res.message ?? "Fix the highlighted fields and try again.");
          return null;
        }
        setErrors({});
        const next = { ...payload, id: res.id, slug: res.slug };
        setSnapshot(JSON.stringify(next));
        setValues(next);
        setSavedAt(res.savedAt);
        setPersistedStatus(next.status);
        persisted.current = true;
        if (!persisted.current) window.history.replaceState(null, "", `${basePath}/${res.id}`);
        return res.id;
      } catch {
        setMessage("Couldn't save. Check your connection and try again.");
        return null;
      } finally {
        inFlight.current = false;
        setSaving(false);
      }
    },
    [values, save, basePath],
  );

  // Autosave never touches live content: skip once the item is (or is about to be) published.
  const autosaveOn = values.title.trim() !== "" && values.slug !== "" && values.status !== "published" && persistedStatus !== "published";
  useAutosave(values, dirty, autosaveOn, () => void run());

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Debounced unique-slug check.
  useEffect(() => {
    if (!values.slug) return;
    const t = setTimeout(async () => {
      try {
        const free = await checkSlug(table, values.slug, values.id);
        setErrors((e) => {
          const { slug: _drop, ...rest } = e;
          void _drop;
          return free ? rest : { ...rest, slug: "That URL is already used." };
        });
      } catch {
        /* the save action re-checks */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [values.slug, values.id, table]);

  const preview = useCallback(async () => {
    const id = persisted.current ? values.id : values.title.trim() ? await run() : null;
    if (id) window.open(`/admin/preview/${previewKind}/${id}`, "_blank", "noopener");
    else setMessage("Add a title before previewing.");
  }, [values.id, values.title, run, previewKind]);

  return { values, set, errors, message, saving, dirty, savedAt, persistedStatus, run, preview };
}
