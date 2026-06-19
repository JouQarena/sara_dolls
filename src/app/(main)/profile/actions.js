"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import {
  isValidEgyptPhone,
  normalizeEgyptPhone,
  passwordIssues,
  translateAuthError,
} from "@/lib/validation";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ---- Update profile (name, phone, default address) ----
export async function updateProfile(prevState, formData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const phoneRaw = String(formData.get("phone_number") || "").trim();
  const governorate = String(formData.get("default_governorate") || "").trim();
  const city = String(formData.get("default_city") || "").trim();
  const address = String(formData.get("default_address") || "").trim();

  if (fullName.length < 2) return { error: "من فضلك أدخلي اسمك بالكامل." };
  if (phoneRaw && !isValidEgyptPhone(phoneRaw))
    return { error: "رقم الهاتف غير صحيح. مثال: 01012345678" };

  if (!isConfigured())
    return { success: "تم حفظ بياناتك (وضع المعاينة).", type: "profile" };

  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    if (!user) return { error: "يجب تسجيل الدخول." };

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone_number: phoneRaw ? normalizeEgyptPhone(phoneRaw) : null,
        default_governorate: governorate || null,
        default_city: city || null,
        default_address: address || null,
      })
      .eq("id", user.id);

    if (error) return { error: "تعذّر حفظ البيانات، حاولي مرة أخرى." };

    revalidatePath("/profile");
    return { success: "تم تحديث بياناتك بنجاح 🌸", type: "profile" };
  } catch {
    return { error: "حدث خطأ غير متوقع." };
  }
}

// ---- Change password ----
export async function changePassword(prevState, formData) {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm_password") || "");

  const issues = passwordIssues(password);
  if (issues.length) return { error: issues[0], type: "password" };
  if (password !== confirm)
    return { error: "كلمتا المرور غير متطابقتين.", type: "password" };

  if (!isConfigured())
    return { success: "تم تغيير كلمة المرور (وضع المعاينة).", type: "password" };

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: translateAuthError(error.message), type: "password" };
    return { success: "تم تغيير كلمة المرور بنجاح 🔒", type: "password" };
  } catch {
    return { error: "حدث خطأ غير متوقع.", type: "password" };
  }
}
