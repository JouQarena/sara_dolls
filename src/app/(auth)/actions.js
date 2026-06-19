"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  isValidEgyptPhone,
  isValidEmail,
  normalizeEgyptPhone,
  passwordIssues,
  translateAuthError,
} from "@/lib/validation";

function getSiteOrigin() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

// ---- LOGIN ----
export async function loginAction(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!isValidEmail(email)) return { error: "البريد الإلكتروني غير صالح." };
  if (!password) return { error: "من فضلك أدخلي كلمة المرور." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message) };

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

  if (fullName.length < 2) return { error: "من فضلك أدخلي اسمك بالكامل." };
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
      data: { full_name: fullName, phone_number: phone },
    },
  });

  if (error) return { error: translateAuthError(error.message) };

  // If email confirmation is required, no session is returned.
  const needsConfirmation = !data.session;
  if (needsConfirmation) {
    return {
      success:
        "تم إنشاء حسابك! تحققي من بريدك الإلكتروني لتأكيد الحساب ثم سجّلي الدخول.",
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

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteOrigin()}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: translateAuthError(error.message) };

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

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  redirect("/login?reset=1");
}
