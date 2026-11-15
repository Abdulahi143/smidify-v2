"use client";

import { useStudioPreview } from "./StudioPreview";

import { useCallback, useEffect, useRef, useState } from "react";
import { checkSlug, type SaveResult } from "@/lib/actions";
import { slugify } from "@/lib/validation";
import { useAutosave } from "./useAutosave";
import { mergeSavedValues } from "./editor-state";

type Base = {
  id: string | null;
  title: string;
  slug: string;
  status: "draft" | "in_review" | "published";
};

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
  const local = useStudioPreview();
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
      else if (patch.title !== undefined && !slugTouched.current)
        next.slug = slugify(patch.title);
      return next;
    });
  }, []);

  const run = useCallback(
    async (override?: Partial<V>): Promise<string | null> => {
      if (local) {
        setMessage("Local preview does not save changes.");
        return null;
      }
      if (inFlight.current) return null;
      inFlight.current = true;
      setSaving(true);
      setMessage(undefined);
      const submitted = values;
      const payload = { ...submitted, ...override };
      try {
        const res = await save(payload);
        if (!res.ok) {
          setErrors(res.fieldErrors);
          setMessage(
            res.message ?? "Fix the highlighted fields and try again.",
          );
          return null;
        }
        setErrors({});
        const next = { ...payload, id: res.id, slug: res.slug };
        setSnapshot(JSON.stringify(next));
        setValues((current) => mergeSavedValues(current, submitted, next));
        setSavedAt(res.savedAt);
        setPersistedStatus(next.status);
        const firstSave = !persisted.current;
        persisted.current = true;
        if (firstSave)
          window.history.replaceState(null, "", `${basePath}/${res.id}`);
        return res.id;
      } catch {
        setMessage("Couldn't save. Check your connection and try again.");
        return null;
      } finally {
        inFlight.current = false;
        setSaving(false);
      }
    },
    [values, save, basePath, local],
  );

  // Autosave never touches live content: skip once the item is (or is about to be) published.
  const autosaveOn =
    !local &&
    values.title.trim() !== "" &&
    values.slug !== "" &&
    values.status !== "published" &&
    persistedStatus !== "published";
  useAutosave(values, dirty, autosaveOn, () => void run());

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Debounced unique-slug check.
  useEffect(() => {
    if (local || !values.slug) return;
    let active = true;
    const t = setTimeout(async () => {
      try {
        const free = await checkSlug(table, values.slug, values.id);
        if (!active) return;
        setErrors((e) => {
          const { slug: _drop, ...rest } = e;
          void _drop;
          return free ? rest : { ...rest, slug: "That URL is already used." };
        });
      } catch {
        /* the save action re-checks */
      }
    }, 400);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [values.slug, values.id, table, local]);

  const preview = useCallback(async () => {
    if (local) {
      if (persisted.current && values.id)
        window.open(
          `/admin/preview/${previewKind}/${values.id}`,
          "_blank",
          "noopener",
        );
      else
        setMessage(
          "Save and preview require a connected workspace. This local preview does not save new items.",
        );
      return;
    }
    if (inFlight.current) return;
    if (!values.title.trim()) {
      setMessage("Add a title before previewing.");
      return;
    }
    // Open before awaiting the save so browsers do not block it as an unsolicited popup.
    const tab = window.open("about:blank", "_blank");
    if (!tab) {
      setMessage("Allow pop-ups for this site to open the preview.");
      return;
    }
    tab.opener = null;
    const live = persistedStatus === "published";
    const id = !persisted.current || (dirty && !live) ? await run() : values.id;
    if (!id) {
      tab.close();
      return;
    }
    tab.location.href = `/admin/preview/${previewKind}/${id}`;
    if (live && dirty)
      setMessage(
        "Preview shows the saved version. Your unsaved edits have not been published.",
      );
  }, [
    values.id,
    values.title,
    dirty,
    persistedStatus,
    run,
    previewKind,
    local,
  ]);

  return {
    values,
    set,
    errors,
    message,
    saving,
    dirty,
    savedAt,
    persistedStatus,
    run,
    preview,
  };
}
