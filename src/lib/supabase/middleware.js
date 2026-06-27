import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and keeps cookies in sync.
 * Called from the root middleware.js. Route protection logic is added in Phase 2.
 */
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  // If env vars are missing (e.g. before setup), skip gracefully.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // If a Supabase auth link lands on any page with ?code=... (e.g. the root "/"),
  // forward it to the dedicated callback route that exchanges it for a session.
  const codeParam = request.nextUrl.searchParams.get("code");
  if (codeParam && request.nextUrl.pathname !== "/auth/callback") {
    const url = request.nextUrl.clone();
    const next = request.nextUrl.searchParams.get("next") || "/";
    url.pathname = "/auth/callback";
    url.search = `?code=${codeParam}&next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(url);
  }

  // IMPORTANT: refresh the session so it doesn't expire.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Routes that require authentication.
  const PROTECTED = ["/my-orders", "/profile", "/wishlist", "/checkout"];
  const isProtected = PROTECTED.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  // Auth pages that a logged-in user shouldn't see.
  const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];
  const isAuthPage = AUTH_PAGES.includes(path);

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
