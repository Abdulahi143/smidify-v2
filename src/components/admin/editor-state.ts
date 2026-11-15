type EditorValue = { id: string | null; slug: string; status: string };

/** Apply save metadata without discarding edits made while the request was running. */
export function mergeSavedValues<V extends EditorValue>(
  current: V,
  submitted: V,
  saved: V,
): V {
  return {
    ...current,
    id: saved.id,
    slug: current.slug === submitted.slug ? saved.slug : current.slug,
    status: current.status === submitted.status ? saved.status : current.status,
  };
}
