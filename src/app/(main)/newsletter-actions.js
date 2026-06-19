"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidEmail } from "@/lib/validation";

export async function subscribeNewsletter(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  if (!isValidEmail(email)) return { error: "البريد الإلكتروني غير صالح." };

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Demo mode: pretend success.
    return { success: "تم اشتراكك بنجاح! 🌸 (وضع المعاينة)" };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });
    if (error) {
      if (error.code === "23505")
        return { success: "أنتِ مشتركة بالفعل معنا 🌸" };
      return { error: "تعذّر الاشتراك، حاولي مرة أخرى." };
    }
    return { success: "تم اشتراكك بنجاح! شكراً لانضمامك 🌸" };
  } catch {
    return { error: "حدث خطأ غير متوقع، حاولي مرة أخرى." };
  }
}
