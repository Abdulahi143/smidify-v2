import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";
import { localStudioPreviewEnabled } from "@/lib/studio-preview-policy";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (
    localStudioPreviewEnabled({
      mode: process.env.NODE_ENV,
      enabled: process.env.SMIDIFY_STUDIO_PREVIEW,
      host: request.headers.get("host"),
    })
  ) {
    return request.nextUrl.pathname === "/admin/login"
      ? NextResponse.redirect(new URL("/admin", request.url))
      : response;
  }
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return request.nextUrl.pathname === "/admin/login"
      ? response
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Validates the token with Supabase Auth and refreshes it if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optimistic check only: admin status is verified server-side in the admin layout.
  const { pathname } = request.nextUrl;
  if (!user && pathname !== "/admin/login") {
    const redirect = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }
  return response;
}
