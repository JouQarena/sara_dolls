import { createClient } from "@/lib/supabase/server";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Returns the current auth user (or null). Use in Server Components.
export async function getCurrentUser() {
  if (!isConfigured()) return null;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

// Returns { user, profile } or { user: null, profile: null }.
export async function getUserAndProfile() {
  if (!isConfigured()) return { user: null, profile: null };
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { user: null, profile: null };

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return { user, profile: profile ?? null };
  } catch {
    return { user: null, profile: null };
  }
}

// Is the current user the configured admin?
export async function isAdminUser() {
  const user = await getCurrentUser();
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  return Boolean(user && adminEmail && user.email?.toLowerCase() === adminEmail);
}
