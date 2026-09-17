import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { GENDER_COOKIE, normalizeGender } from "@/lib/genderedText";

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

// How should the site address the current visitor? ('male' | 'female')
//   logged-in → profiles.gender (chosen at signup, editable in profile)
//   guest     → the sara_gender cookie set by the 👩/👨 toggle
//   fallback  → 'female' (brand default)
export async function getUserGender() {
  try {
    const user = await getCurrentUser();
    if (user) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("profiles")
          .select("gender")
          .eq("id", user.id)
          .maybeSingle();
        if (data?.gender === "male" || data?.gender === "female")
          return data.gender;
      } catch {}
      const meta = user.user_metadata?.gender;
      if (meta === "male" || meta === "female") return meta;
      return "female";
    }
    const cookieGender = cookies().get(GENDER_COOKIE)?.value;
    return normalizeGender(cookieGender);
  } catch {
    return "female";
  }
}
