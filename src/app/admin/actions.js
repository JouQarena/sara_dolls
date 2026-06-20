"use server";

import { revalidatePath } from "next/cache";
import { admin, adminConfigured, requireAdmin } from "@/lib/admin";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { deleteProductImages } from "@/lib/deleteImage";

function slugify(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || `item-${Date.now()}`;
}

async function guard() {
  if (adminConfigured()) await requireAdmin();
}

// ---------- ORDERS ----------
export async function updateOrderStatus(formData) {
  await guard();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  const { error } = await sb.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
  return error ? { error: "تعذّر التحديث." } : { success: true };
}

// ---------- CUSTOM ORDERS ----------
export async function updateCustomOrder(formData) {
  await guard();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const quoteRaw = formData.get("admin_quote_price");
  const notes = String(formData.get("admin_notes") || "").trim();

  const update = { status };
  if (quoteRaw !== null && String(quoteRaw).trim() !== "")
    update.admin_quote_price = Number(quoteRaw);
  update.admin_notes = notes || null;

  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  const { error } = await sb.from("custom_orders").update(update).eq("id", id);
  revalidatePath("/admin/custom-orders");
  return error ? { error: "تعذّر التحديث." } : { success: true };
}

// ---------- PRODUCTS ----------
export async function saveProduct(formData) {
  await guard();
  const id = String(formData.get("id") || "");
  const name_ar = String(formData.get("name_ar") || "").trim();
  const name = String(formData.get("name") || "").trim() || name_ar;
  const description_ar = String(formData.get("description_ar") || "").trim();
  const price = Number(formData.get("price") || 0);
  const original_price = formData.get("original_price")
    ? Number(formData.get("original_price"))
    : null;
  const stock = Number(formData.get("stock") || 0);
  const category_id = String(formData.get("category_id") || "") || null;
  const product_type = String(formData.get("product_type") || "physical");
  const is_featured = formData.get("is_featured") === "on";
  const is_available = formData.get("is_available") === "on";

  if (!name_ar) return { error: "اسم المنتج مطلوب." };
  if (price <= 0) return { error: "السعر يجب أن يكون أكبر من صفر." };

  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();

  // Images are uploaded client-side (ImageUploader) and sent as URLs.
  const image_url = String(formData.get("image_url") || "") || null;
  let images_gallery = [];
  try {
    images_gallery = JSON.parse(String(formData.get("images_gallery_json") || "[]"));
    if (!Array.isArray(images_gallery)) images_gallery = [];
  } catch {
    images_gallery = [];
  }

  // Upload PDF for patterns.
  let pdf_url = String(formData.get("existing_pdf_url") || "") || null;
  const pdfFile = formData.get("pdf");
  if (product_type === "pattern_pdf" && pdfFile && typeof pdfFile === "object" && pdfFile.size > 0) {
    const path = `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`;
    const { error: upErr } = await sb.storage
      .from(STORAGE_BUCKETS.PRODUCTS)
      .upload(path, pdfFile, { contentType: "application/pdf" });
    if (!upErr) {
      pdf_url = sb.storage.from(STORAGE_BUCKETS.PRODUCTS).getPublicUrl(path).data.publicUrl;
    }
  }

  const payload = {
    name, name_ar, description_ar, price, original_price, stock,
    category_id, product_type, pdf_url, image_url, images_gallery,
    is_featured, is_available,
  };

  let error;
  if (id) {
    ({ error } = await sb.from("products").update(payload).eq("id", id));
  } else {
    payload.slug = slugify(name || name_ar);
    ({ error } = await sb.from("products").insert(payload));
  }
  revalidatePath("/admin/products");
  return error ? { error: "تعذّر الحفظ: " + error.message } : { success: true };
}

export async function deleteProduct(formData) {
  await guard();
  const id = String(formData.get("id"));
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();

  // Fetch image URLs first so we can clean up storage after delete.
  const { data: prod } = await sb
    .from("products")
    .select("image_url, images_gallery")
    .eq("id", id)
    .maybeSingle();

  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) return { error: "تعذّر الحذف." };

  // Best-effort: remove all images (main + gallery) from storage.
  if (prod) {
    const urls = [prod.image_url, ...(prod.images_gallery || [])].filter(Boolean);
    await deleteProductImages(sb, urls);
  }

  revalidatePath("/admin/products");
  return { success: true };
}

// ---------- CATEGORIES ----------
export async function saveCategory(formData) {
  await guard();
  const id = String(formData.get("id") || "");
  const name_ar = String(formData.get("name_ar") || "").trim();
  const name = String(formData.get("name") || "").trim() || name_ar;
  const slug = String(formData.get("slug") || "").trim() || slugify(name);
  const description_ar = String(formData.get("description_ar") || "").trim();
  const is_special = formData.get("is_special") === "on";
  if (!name_ar) return { error: "اسم التصنيف مطلوب." };
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  const payload = { name, name_ar, slug, description_ar, is_special };
  let error;
  if (id) ({ error } = await sb.from("categories").update(payload).eq("id", id));
  else ({ error } = await sb.from("categories").insert(payload));
  revalidatePath("/admin/categories");
  return error ? { error: "تعذّر الحفظ." } : { success: true };
}

export async function deleteCategory(formData) {
  await guard();
  const id = String(formData.get("id"));
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  const { error } = await sb.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  return error ? { error: "تعذّر الحذف." } : { success: true };
}

// ---------- DISCOUNTS ----------
export async function saveDiscount(formData) {
  await guard();
  const id = String(formData.get("id") || "");
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const discount_type = String(formData.get("discount_type") || "percentage");
  const discount_value = Number(formData.get("discount_value") || 0);
  const min_order_amount = Number(formData.get("min_order_amount") || 0);
  const max_uses = formData.get("max_uses") ? Number(formData.get("max_uses")) : null;
  const expires_at = formData.get("expires_at") ? String(formData.get("expires_at")) : null;
  const is_active = formData.get("is_active") === "on";
  if (!code) return { error: "الكود مطلوب." };
  if (discount_value <= 0) return { error: "قيمة الخصم غير صالحة." };
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  const payload = { code, discount_type, discount_value, min_order_amount, max_uses, expires_at, is_active };
  let error;
  if (id) ({ error } = await sb.from("discount_codes").update(payload).eq("id", id));
  else ({ error } = await sb.from("discount_codes").insert(payload));
  revalidatePath("/admin/discount-codes");
  return error ? { error: "تعذّر الحفظ (قد يكون الكود مكررًا)." } : { success: true };
}

export async function deleteDiscount(formData) {
  await guard();
  const id = String(formData.get("id"));
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  const { error } = await sb.from("discount_codes").delete().eq("id", id);
  revalidatePath("/admin/discount-codes");
  return error ? { error: "تعذّر الحذف." } : { success: true };
}

// ---------- REVIEWS ----------
export async function deleteReview(formData) {
  await guard();
  const id = String(formData.get("id"));
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  const { error } = await sb.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/reviews");
  return error ? { error: "تعذّر الحذف." } : { success: true };
}

// ---------- MESSAGES ----------
export async function toggleMessageRead(formData) {
  await guard();
  const id = String(formData.get("id"));
  const is_read = formData.get("is_read") === "true";
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  await sb.from("contact_messages").update({ is_read: !is_read }).eq("id", id);
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(formData) {
  await guard();
  const id = String(formData.get("id"));
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  await sb.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
  return { success: true };
}

// ---------- SETTINGS ----------
export async function saveSettings(formData) {
  await guard();
  const payload = {
    store_name_ar: String(formData.get("store_name_ar") || "").trim(),
    whatsapp_number: String(formData.get("whatsapp_number") || "").trim(),
    instapay_number: String(formData.get("instapay_number") || "").trim(),
    instagram_url: String(formData.get("instagram_url") || "").trim(),
    facebook_url: String(formData.get("facebook_url") || "").trim(),
    tiktok_url: String(formData.get("tiktok_url") || "").trim(),
    flat_shipping_fee: Number(formData.get("flat_shipping_fee") || 0),
    free_shipping_threshold: Number(formData.get("free_shipping_threshold") || 0),
    announcement_bar_text: String(formData.get("announcement_bar_text") || "").trim(),
    custom_order_intro_ar: String(formData.get("custom_order_intro_ar") || "").trim(),
    updated_at: new Date().toISOString(),
  };
  if (!adminConfigured()) return { success: true, demo: true };
  const sb = admin();
  const { error } = await sb.from("site_settings").update(payload).eq("id", 1);
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return error ? { error: "تعذّر الحفظ." } : { success: true };
}
