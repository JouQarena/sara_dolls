"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { canCancelOrder } from "@/lib/orderStatus";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ---- Cancel a regular order (within 24h, pending only) ----
export async function cancelOrder(prevState, formData) {
  const orderId = String(formData.get("order_id") || "");
  const reason = String(formData.get("reason") || "").trim();

  if (!isConfigured()) {
    return { success: "تم إلغاء الطلب (وضع المعاينة)." };
  }

  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    if (!user) return { error: "يجب تسجيل الدخول." };

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!order) return { error: "الطلب غير موجود." };
    if (!canCancelOrder(order))
      return { error: "لا يمكن إلغاء هذا الطلب (مرّ أكثر من 24 ساعة أو تم تجهيزه)." };

    const { error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        cancellation_reason: reason || "ألغى العميل الطلب",
      })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (error) return { error: "تعذّر إلغاء الطلب، حاولي مرة أخرى." };

    revalidatePath("/my-orders");
    return { success: "تم إلغاء الطلب بنجاح." };
  } catch {
    return { error: "حدث خطأ غير متوقع." };
  }
}

// ---- Respond to a custom order quote (accept / reject) ----
export async function respondToQuote(prevState, formData) {
  const orderId = String(formData.get("custom_order_id") || "");
  const decision = String(formData.get("decision") || ""); // approved | cancelled

  if (!["approved", "cancelled"].includes(decision))
    return { error: "إجراء غير صالح." };

  if (!isConfigured()) {
    return {
      success:
        decision === "approved"
          ? "تمت الموافقة على العرض (وضع المعاينة)."
          : "تم رفض العرض (وضع المعاينة).",
    };
  }

  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    if (!user) return { error: "يجب تسجيل الدخول." };

    const { data: co } = await supabase
      .from("custom_orders")
      .select("id, status, user_id")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!co) return { error: "الطلب غير موجود." };
    if (co.status !== "quoted")
      return { error: "لا يمكن الرد على هذا الطلب في حالته الحالية." };

    const { error } = await supabase
      .from("custom_orders")
      .update({ status: decision })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (error) return { error: "تعذّر تحديث الطلب." };

    revalidatePath("/my-orders");
    return {
      success:
        decision === "approved"
          ? "تمت الموافقة على العرض! سنبدأ التنفيذ قريبًا 🌸"
          : "تم رفض العرض.",
    };
  } catch {
    return { error: "حدث خطأ غير متوقع." };
  }
}
