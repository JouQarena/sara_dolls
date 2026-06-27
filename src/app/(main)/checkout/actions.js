"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getSiteSettings, computeShipping } from "@/lib/settings";
import {
  isValidEgyptPhone,
  normalizeEgyptPhone,
} from "@/lib/validation";
import { EGYPT_GOVERNORATES, STORAGE_BUCKETS } from "@/lib/constants";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const VALID_GOV = new Set(EGYPT_GOVERNORATES.map((g) => g.ar));

// ---- Validate a discount code (called from the cart/checkout) ----
export async function validateDiscount(code, subtotal) {
  const c = String(code || "").trim().toUpperCase();
  if (!c) return { valid: false, error: "أدخلي كود الخصم." };

  if (!isConfigured()) {
    // Demo: accept SARA10 for 10% off.
    if (c === "SARA10") {
      return {
        valid: true,
        code: c,
        type: "percentage",
        value: 10,
        amount: Math.round(subtotal * 0.1),
      };
    }
    return { valid: false, error: "كود الخصم غير صالح." };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", c)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return { valid: false, error: "كود الخصم غير صالح." };
    if (data.expires_at && new Date(data.expires_at) < new Date())
      return { valid: false, error: "انتهت صلاحية كود الخصم." };
    if (data.max_uses && data.used_count >= data.max_uses)
      return { valid: false, error: "تم استنفاد كود الخصم." };
    if (subtotal < Number(data.min_order_amount || 0))
      return {
        valid: false,
        error: `الحد الأدنى للطلب لاستخدام الكود ${data.min_order_amount} ج.م.`,
      };

    const amount =
      data.discount_type === "percentage"
        ? Math.round((subtotal * Number(data.discount_value)) / 100)
        : Math.min(subtotal, Number(data.discount_value));

    return {
      valid: true,
      code: c,
      type: data.discount_type,
      value: Number(data.discount_value),
      amount,
    };
  } catch {
    return { valid: false, error: "تعذّر التحقق من الكود." };
  }
}

// ---- Place a regular order ----
export async function placeOrder(formData) {
  // Parse cart (sent as JSON string from the client).
  let items;
  try {
    items = JSON.parse(String(formData.get("cart_json") || "[]"));
  } catch {
    return { error: "السلة غير صالحة." };
  }
  if (!Array.isArray(items) || items.length === 0)
    return { error: "سلة التسوّق فارغة." };

  const fullName = String(formData.get("full_name") || "").trim();
  const phoneRaw = String(formData.get("phone_number") || "").trim();
  const governorate = String(formData.get("governorate") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const paymentMethod = String(formData.get("payment_method") || "").trim();
  const discountCode = String(formData.get("discount_code") || "").trim();
  const agreed = formData.get("agreed_to_terms") === "on";

  // Validate
  if (fullName.length < 2) return { error: "من فضلك أدخلي اسمك بالكامل." };
  if (!isValidEgyptPhone(phoneRaw))
    return { error: "رقم الهاتف غير صحيح. مثال: 01012345678" };
  if (!VALID_GOV.has(governorate)) return { error: "من فضلك اختاري المحافظة." };
  if (address.length < 5) return { error: "من فضلك أدخلي عنوانًا واضحًا." };
  if (!["cash_on_delivery", "instapay"].includes(paymentMethod))
    return { error: "من فضلك اختاري طريقة الدفع." };
  if (!agreed) return { error: "يجب الموافقة على الشروط للمتابعة." };

  const phone = normalizeEgyptPhone(phoneRaw);
  const settings = await getSiteSettings();

  // ---- DEMO MODE ----
  if (!isConfigured()) {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const disc = discountCode
      ? await validateDiscount(discountCode, subtotal)
      : { valid: false };
    const discountAmount = disc.valid ? disc.amount : 0;
    const shipping = computeShipping(subtotal - discountAmount, settings);
    return {
      success: true,
      demo: true,
      id: "DEMO",
      orderNumber: Math.floor(1000 + Math.random() * 9000),
      total: subtotal - discountAmount + shipping,
    };
  }

  try {
    const supabase = createClient();
    const user = await getCurrentUser();

    // Require login to place an order (defense in depth; middleware also guards /checkout).
    if (!user) {
      return { error: "يجب تسجيل الدخول لإتمام الطلب." };
    }

    // Re-fetch product prices/stock server-side (never trust the client).
    const ids = items.map((i) => i.id);
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id, name_ar, price, stock, product_type, is_available")
      .in("id", ids);
    if (prodErr || !products?.length)
      return { error: "تعذّر تأكيد المنتجات." };

    const byId = Object.fromEntries(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const lineItems = [];

    for (const item of items) {
      const p = byId[item.id];
      if (!p || !p.is_available)
        return { error: `أحد المنتجات لم يعد متاحًا.` };
      const isPattern = p.product_type === "pattern_pdf";
      if (!isPattern && p.stock < item.quantity)
        return { error: `الكمية المطلوبة من «${p.name_ar}» غير متوفّرة.` };
      const lineTotal = Number(p.price) * item.quantity;
      subtotal += lineTotal;
      lineItems.push({
        product_id: p.id,
        product_name_ar: p.name_ar,
        quantity: item.quantity,
        price_at_purchase: Number(p.price),
        isPattern,
        currentStock: p.stock,
      });
    }

    // Discount
    let discountAmount = 0;
    let appliedCode = null;
    if (discountCode) {
      const disc = await validateDiscount(discountCode, subtotal);
      if (disc.valid) {
        discountAmount = disc.amount;
        appliedCode = disc.code;
      }
    }

    const shipping = computeShipping(subtotal - discountAmount, settings);
    const total = subtotal - discountAmount + shipping;

    // Instapay screenshot upload
    let instapayUrl = null;
    if (paymentMethod === "instapay") {
      const file = formData.get("instapay_screenshot");
      if (!file || typeof file !== "object" || file.size === 0)
        return { error: "من فضلك ارفعي صورة إيصال التحويل عبر إنستاباي." };
      if (file.size > 5 * 1024 * 1024)
        return { error: "حجم الصورة كبير جدًا (الحد 5 ميجابايت)." };
      const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
      const path = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKETS.INSTAPAY)
        .upload(path, file, { contentType: file.type });
      if (upErr) return { error: "تعذّر رفع إيصال الدفع." };
      instapayUrl = path; // private bucket — store path, admin views via signed URL
    }

    // Insert order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        full_name: fullName,
        phone_number: phone,
        governorate,
        city: city || null,
        address,
        payment_method: paymentMethod,
        instapay_screenshot_url: instapayUrl,
        discount_code: appliedCode,
        discount_amount: discountAmount,
        subtotal,
        shipping_fee: shipping,
        total_price: total,
        status: "pending",
        notes: notes || null,
        agreed_to_terms: true,
      })
      .select("id, order_number")
      .single();

    if (orderErr) return { error: "تعذّر حفظ الطلب، حاولي مرة أخرى." };

    // Insert order items
    const { error: itemsErr } = await supabase.from("order_items").insert(
      lineItems.map((li) => ({
        order_id: order.id,
        product_id: li.product_id,
        product_name_ar: li.product_name_ar,
        quantity: li.quantity,
        price_at_purchase: li.price_at_purchase,
      }))
    );
    if (itemsErr) return { error: "تعذّر حفظ تفاصيل الطلب." };

    // Reduce stock (physical only)
    for (const li of lineItems) {
      if (!li.isPattern) {
        await supabase
          .from("products")
          .update({ stock: Math.max(0, li.currentStock - li.quantity) })
          .eq("id", li.product_id);
      }
    }

    // Increment discount usage
    if (appliedCode) {
      await supabase.rpc("increment_discount_use", { p_code: appliedCode }).catch(
        () => {}
      );
    }

    return {
      success: true,
      id: order.id,
      orderNumber: order.order_number,
      total,
    };
  } catch {
    return { error: "حدث خطأ غير متوقع، حاولي مرة أخرى." };
  }
}
