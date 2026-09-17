"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidEmail } from "@/lib/validation";
import { getUserGender } from "@/lib/auth";
import { gx } from "@/lib/genderedText";

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
      const gender = await getUserGender();
      if (error.code === "23505")
        return { success: gx(gender, "أنتِ مشتركة بالفعل معنا 🌸", "أنت مشترك بالفعل معنا 🌸") };
      return { error: gx(gender, "تعذّر الاشتراك، حاولي مرة أخرى.", "تعذّر الاشتراك، حاول مرة أخرى.") };
    }
    return { success: "تم اشتراكك بنجاح! شكراً لانضمامك 🌸" };
  } catch {
    const gender = await getUserGender();
    return { error: gx(gender, "حدث خطأ غير متوقع، حاولي مرة أخرى.", "حدث خطأ غير متوقع، حاول مرة أخرى.") };
  }
}
