import { cache } from "react";
import { forbidden, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isLocalStudioPreview } from "@/lib/studio-preview";

/** Signed-in admin for this request; redirects to login or renders the 403 page otherwise. */
export const requireAdmin = cache(async () => {
  if (await isLocalStudioPreview())
    throw new Error(
      "Local Studio preview is read-only. Connect Supabase and sign in to save changes.",
    );
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) forbidden();

  return { supabase, user };
});

/** Preview viewers can see fixtures; real data and all writes still require requireAdmin. */
export const requireStudioViewer = cache(async () => {
  if (await isLocalStudioPreview())
    return { email: "preview@smidify.local", preview: true };
  const { user } = await requireAdmin();
  return { email: user.email ?? "", preview: false };
});
