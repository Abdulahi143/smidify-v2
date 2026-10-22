"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { quoteRequestSchema } from "@/lib/validation";

export type QuoteState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "name" | "phone" | "kind" | "message", string>>;
};

const SUCCESS: QuoteState = {
  status: "success",
  message: "Thanks — we'll reply within one working day.",
};

export async function createQuoteRequest(
  _prev: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  // Honeypot: real users never see or fill this field. Bots get a fake success.
  if (String(formData.get("website") ?? "") !== "") return SUCCESS;

  const parsed = quoteRequestSchema.safeParse({
    email: formData.get("email") ?? "",
    name: formData.get("name") ?? "",
    phone: formData.get("phone") ?? "",
    kind: formData.get("kind") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: NonNullable<QuoteState["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof fieldErrors;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", fieldErrors };
  }

  const { error } = await createPublicClient()
    .from("quote_requests")
    .insert(parsed.data);
  if (error) {
    return {
      status: "error",
      message: "Something went wrong. Please try again or email hello@smidify.com.",
    };
  }
  return SUCCESS;
}
