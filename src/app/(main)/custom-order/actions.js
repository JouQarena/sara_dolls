"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import {
  isValidEgyptPhone,
  isValidEmail,
  normalizeEgyptPhone,
} from "@/lib/validation";
import { ORDER_TYPES, SIZES, BUDGET_RANGES } from "@/lib/customOrders";
import { STORAGE_BUCKETS } from "@/lib/constants";

const VALID_TYPES = ORDER_TYPES.map((t) => t.value);
const VALID_SIZES = SIZES.map((s) => s.value);
const VALID_BUDGETS = BUDGET_RANGES.map((b) => b.value);

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function submitCustomOrder(prevState, formData) {
  // ---- read fields ----
  const fullName = String(formData.get("full_name") || "").trim();
  const phoneRaw = String(formData.get("phone_number") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const governorate = String(formData.get("governorate") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const orderType = String(formData.get("order_type") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const colors = String(formData.get("preferred_colors") || "").trim();
  const size = String(formData.get("size") || "").trim();
  const budget = String(formData.get("budget_range") || "").trim();
  const deadline = String(formData.get("deadline") || "").trim();
  const notes = String(formData.get("additional_notes") || "").trim();
  const agreed = formData.get("agreed_to_terms") === "on";

  // ---- validate ----
  if (fullName.length < 2) return { error: "من فضلك أدخلي اسمك بالكامل." };
  if (!isValidEgyptPhone(phoneRaw))
    return { error: "رقم الهاتف غير صحيح. مثال: 01012345678" };
  if (email && !isValidEmail(email))
    return { error: "البريد الإلكتروني غير صالح." };
  if (!VALID_TYPES.includes(orderType))
    return { error: "من فضلك اختاري نوع الطلب." };
  if (description.length < 10)
    return { error: "اكتبي وصفًا أوضح لطلبك (10 أحرف على الأقل)." };
  if (size && !VALID_SIZES.includes(size))
    return { error: "المقاس المختار غير صالح." };
  if (budget && !VALID_BUDGETS.includes(budget))
    return { error: "الميزانية المختارة غير صالحة." };
  if (!agreed)
    return { error: "يجب الموافقة على سياسة الطلبات الخاصة للمتابعة." };

  const phone = normalizeEgyptPhone(phoneRaw);

  // ---- collect images ----
  const files = formData
    .getAll("reference_images")
    .filter((f) => f && typeof f === "object" && f.size > 0);

  if (files.length > MAX_IMAGES)
    return { error: `يمكنك رفع حتى ${MAX_IMAGES} صور كحد أقصى.` };
  for (const f of files) {
    if (f.size > MAX_IMAGE_BYTES)
      return { error: "حجم إحدى الصور كبير جدًا (الحد 5 ميجابايت)." };
    if (!String(f.type || "").startsWith("image/"))
      return { error: "يُسمح برفع الصور فقط." };
  }

  // ---- demo mode (no Supabase) ----
  if (!isConfigured()) {
    return {
      success: true,
      demo: true,
      id: "DEMO",
      orderNumber: Math.floor(1000 + Math.random() * 9000),
      imagesCount: files.length,
      summary: buildSummary({
        fullName,
        phone,
        orderType,
        description,
        colors,
        size,
        budget,
        deadline,
        notes,
        imagesCount: files.length,
      }),
    };
  }

  try {
    const supabase = createClient();
    const user = await getCurrentUser();

    // ---- upload reference images ----
    const imageUrls = [];
    for (const file of files) {
      const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
      const path = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKETS.CUSTOM_REFS)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        return { error: "تعذّر رفع الصور، حاولي مرة أخرى." };
      }
      const { data: pub } = supabase.storage
        .from(STORAGE_BUCKETS.CUSTOM_REFS)
        .getPublicUrl(path);
      imageUrls.push(pub.publicUrl);
    }

    // ---- insert custom order ----
    const { data, error } = await supabase
      .from("custom_orders")
      .insert({
        user_id: user?.id || null,
        full_name: fullName,
        phone_number: phone,
        email: email || null,
        governorate: governorate || null,
        city: city || null,
        address: address || null,
        order_type: orderType,
        description,
        preferred_colors: colors || null,
        size: size || null,
        reference_images: imageUrls,
        budget_range: budget || null,
        deadline: deadline || null,
        additional_notes: notes || null,
        status: "pending_review",
        agreed_to_terms: true,
      })
      .select("id, order_number")
      .single();

    if (error) {
      return { error: "تعذّر حفظ الطلب، حاولي مرة أخرى." };
    }

    return {
      success: true,
      id: data.id,
      orderNumber: data.order_number,
      imagesCount: imageUrls.length,
    };
  } catch {
    return { error: "حدث خطأ غير متوقع، حاولي مرة أخرى." };
  }
}

function buildSummary(o) {
  return o;
}
