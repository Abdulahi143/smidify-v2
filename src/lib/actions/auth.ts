"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation";
import { isLocalStudioPreview } from "@/lib/studio-preview";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
};

export async function signIn(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: NonNullable<LoginState["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof fieldErrors;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", fieldErrors };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      status: "error",
      message:
        "Studio is not connected yet. Contact your workspace administrator.",
    };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error)
      return {
        status: "error",
        message:
          "Could not sign in. Check your email and password and try again.",
      };
    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError || !isAdmin) {
      await supabase.auth.signOut();
      return {
        status: "error",
        message:
          "This account does not have Studio access. Ask your workspace administrator to add you.",
      };
    }
  } catch {
    return { status: "error", message: "Could not connect. Please try again." };
  }

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  if (await isLocalStudioPreview()) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
