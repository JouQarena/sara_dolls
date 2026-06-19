"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidEgyptPhone, normalizeEgyptPhone } from "@/lib/validation";

export async function sendContactMessage(prevState, formData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phoneRaw = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (name.length < 2) return { error: "من فضلك أدخلي اسمك." };
  if (message.length < 5) return { error: "من فضلك اكتبي رسالتك." };
  if (phoneRaw && !isValidEgyptPhone(phoneRaw))
    return { error: "رقم الهاتف غير صحيح. مثال: 01012345678" };

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { error: "الخدمة غير متاحة حاليًا. حاولي لاحقًا." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email: email || null,
      phone: phoneRaw ? normalizeEgyptPhone(phoneRaw) : null,
      message,
    });
    if (error) return { error: "تعذّر إرسال الرسالة، حاولي مرة أخرى." };
    return { success: "تم إرسال رسالتك بنجاح! سنردّ عليك في أقرب وقت 🌸" };
  } catch {
    return { error: "حدث خطأ غير متوقع، حاولي مرة أخرى." };
  }
}
