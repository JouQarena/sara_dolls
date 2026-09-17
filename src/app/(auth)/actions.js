"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getUserGender } from "@/lib/auth";
import { gx } from "@/lib/genderedText";
import {
  isValidEgyptPhone,
  isValidEmail,
  normalizeEgyptPhone,
  passwordIssues,
  translateAuthError,
} from "@/lib/validation";

function getSiteOrigin() {
  // Prefer the explicitly configured site URL in production.
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  if (host) return `${proto}://${host}`;
  return envUrl || "http://localhost:3000";
}

// ---- LOGIN ----
export async function loginAction(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const gender = await getUserGender();

  if (!isValidEmail(email)) return { error: "البريد الإلكتروني غير صالح." };
  if (!password)
    return { error: gx(gender, "من فضلك أدخلي كلمة المرور.", "من فضلك أدخل كلمة المرور.") };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message, gender) };

  let redirectTo = String(formData.get("redirect") || "/");
  // Only allow internal relative paths.
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) redirectTo = "/";

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

// ---- SIGNUP ----
export async function signupAction(prevState, formData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phoneRaw = String(formData.get("phone_number") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm_password") || "");
  const agreed = formData.get("agreed_to_terms") === "on";
  // Gender choice (ذكر / أنثى) — defaults to female (brand default).
  const gender = formData.get("gender") === "male" ? "male" : "female";

  if (fullName.length < 2)
    return { error: gx(gender, "من فضلك أدخلي اسمك بالكامل.", "من فضلك أدخل اسمك بالكامل.") };
  if (!isValidEmail(email)) return { error: "البريد الإلكتروني غير صالح." };
  if (!isValidEgyptPhone(phoneRaw))
    return { error: "رقم الهاتف غير صحيح. مثال: 01012345678" };
  const pwIssues = passwordIssues(password);
  if (pwIssues.length) return { error: pwIssues[0] };
  if (password !== confirm) return { error: "كلمتا المرور غير متطابقتين." };
  if (!agreed)
    return { error: "يجب الموافقة على اتفاقية المستخدم للمتابعة." };

  const phone = normalizeEgyptPhone(phoneRaw);
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteOrigin()}/auth/callback`,
      data: { full_name: fullName, phone_number: phone, gender },
    },
  });

  if (error) return { error: translateAuthError(error.message, gender) };

  // If email confirmation is still enabled in Supabase, no session is returned.
  // (Store owner: turn OFF "Confirm email" in Supabase → Authentication → Providers → Email
  // so customers can register and log in immediately with no email step.)
  const needsConfirmation = !data.session;
  if (needsConfirmation) {
    return {
      success: gx(
        gender,
        "تم إنشاء حسابك! تحققي من بريدك الإلكتروني لتأكيد الحساب ثم سجّلي الدخول. ولو مش حابة تستني، يمكنك الطلب مباشرة بدون حساب من المتجر 🌸",
        "تم إنشاء حسابك! تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول. ولو مش حابب تستنى، يمكنك الطلب مباشرة بدون حساب من المتجر 🌸"
      ),
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// ---- LOGOUT ----
export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// ---- FORGOT PASSWORD ----
export async function forgotPasswordAction(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  if (!isValidEmail(email)) return { error: "البريد الإلكتروني غير صالح." };
  const gender = await getUserGender();

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteOrigin()}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: translateAuthError(error.message, gender) };

  return {
    success:
      "إذا كان البريد مسجّلاً لدينا، فستصلك رسالة بها رابط لإعادة تعيين كلمة المرور.",
  };
}

// ---- RESET PASSWORD (after clicking email link) ----
export async function resetPasswordAction(prevState, formData) {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm_password") || "");

  const pwIssues = passwordIssues(password);
  if (pwIssues.length) return { error: pwIssues[0] };
  if (password !== confirm) return { error: "كلمتا المرور غير متطابقتين." };

  const gender = await getUserGender();
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateAuthError(error.message, gender) };

  revalidatePath("/", "layout");
  redirect("/login?reset=1");
}

// ---- UPDATE GENDER (from the 👩/👨 toggle or profile) ----
export async function updateGenderAction(gender) {
  const g = gender === "male" ? "male" : "female";
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    await supabase.from("profiles").update({ gender: g }).eq("id", user.id);
    // Keep auth metadata in sync too (best effort).
    try {
      await supabase.auth.updateUser({ data: { gender: g } });
    } catch {}

    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
