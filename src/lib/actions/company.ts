"use server";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  companySchema,
  defaultCompanyContent,
  type CompanyContent,
} from "@/lib/content/company";
import { getCompanyContent } from "@/lib/queries/company";
export async function getCompanyDraft() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("company_content")
    .select("*")
    .in("id", ["draft", "published"]);
  if (error)
    throw new Error(
      ["42P01", "PGRST205"].includes(error.code)
        ? "Apply Supabase migration 0004_company_content.sql before using the website editor."
        : error.message,
    );
  const draft = data.find((d) => d.id === "draft"),
    published = data.find((d) => d.id === "published");
  return {
    content: draft
      ? companySchema.parse(draft.content)
      : published
        ? companySchema.parse(published.content)
        : defaultCompanyContent,
    revision: draft?.revision ?? 0,
    updatedAt: draft?.updated_at ?? null,
    publishedRevision: published?.revision ?? 0,
    publishedAt: published?.updated_at ?? null,
  };
}
export async function saveCompanyDraft(input: unknown, revisionInput: number) {
  const { supabase } = await requireAdmin();
  const parsed = companySchema.safeParse(input),
    revision = z.number().int().min(0).safeParse(revisionInput);
  if (!parsed.success)
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Invalid content.",
    };
  if (!revision.success)
    return {
      ok: false as const,
      message: "Invalid revision. Reload the editor.",
    };
  const { data, error } = await supabase.rpc("save_company_draft", {
    input_content: parsed.data,
    expected_revision: revision.data,
  });
  if (error || !data?.[0])
    return {
      ok: false as const,
      message:
        error?.code === "40001"
          ? "The draft changed in another session. Reload before saving."
          : (error?.message ?? "Could not save draft."),
    };
  revalidatePath("/admin/preview/website");
  return {
    ok: true as const,
    revision: data[0].revision,
    updatedAt: data[0].updated_at,
  };
}
export async function publishCompanyDraft(revisionInput: number) {
  const { supabase } = await requireAdmin();
  const revision = z.number().int().min(1).parse(revisionInput);
  const { data, error } = await supabase.rpc("publish_company_content", {
    expected_revision: revision,
  });
  if (error || !data?.[0])
    return {
      ok: false as const,
      message:
        error?.code === "40001"
          ? "The draft changed. Reload and review it before publishing."
          : (error?.message ?? "Could not publish."),
    };
  updateTag("company-content");
  revalidatePath("/", "layout");
  revalidatePath("/admin/website");
  return {
    ok: true as const,
    revision: data[0].revision,
    updatedAt: data[0].updated_at,
  };
}
export async function getCompanyPreview(): Promise<CompanyContent> {
  await requireAdmin();
  try {
    const draft = await getCompanyDraft();
    return draft.revision ? draft.content : await getCompanyContent();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Apply Supabase migration")
    )
      return getCompanyContent();
    throw error;
  }
}
