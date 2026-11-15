"use server";

import { requireAdmin } from "@/lib/auth";
import { getCompanyDraft, saveCompanyDraft } from "./company";
import { passwordSchema, studioSettingsSchema } from "@/lib/validation/studio";

export async function saveStudioSettings(input: unknown, revision: number) {
  await requireAdmin();
  const parsed = studioSettingsSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Check your settings.",
    };
  const draft = await getCompanyDraft();
  if (draft.revision !== revision)
    return {
      ok: false as const,
      message:
        "The website draft changed in another session. Reload Settings before saving.",
    };
  return saveCompanyDraft(
    { ...draft.content, copy: { ...draft.content.copy, ...parsed.data } },
    revision,
  );
}

export async function updateAccountPassword(input: unknown) {
  const { supabase } = await requireAdmin();
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Check your password.",
    };
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error)
    return {
      ok: false as const,
      message:
        "Could not update your password. Sign in again and try a different password.",
    };
  return { ok: true as const, message: "Your password has been updated." };
}
