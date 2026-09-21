// 🔔 Notify Sara about new orders — admin 🔔 bell (DB row) + email (Resend).
// SERVER-ONLY (uses the service-role key). Every function is fail-safe:
// a notification failure must NEVER break checkout.

import { admin, adminConfigured } from "@/lib/admin";
import { ORDER_TYPES } from "@/lib/customOrders";

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function orderTypeLabel(v) {
  return ORDER_TYPES.find((t) => t.value === v)?.label || v || "—";
}

// ---------------------------------------------------------------------------
// 1) In-app 🔔 bell — insert one row into public.notifications
// ---------------------------------------------------------------------------
export async function createAdminNotification({
  type,
  title_ar,
  body_ar,
  link,
  ref_id = null,
  ref_number = null,
}) {
  try {
    if (!adminConfigured()) return false;
    const sb = admin();
    const { error } = await sb.from("notifications").insert({
      type,
      title_ar,
      body_ar: body_ar || null,
      link: link || "/admin",
      ref_id,
      ref_number,
    });
    if (error) {
      console.error("[notify] bell insert failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[notify] bell failed:", err?.message || err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// 2) Email via Resend (plain fetch — no dependency).
// Needs: RESEND_API_KEY + ADMIN_EMAIL. Optional: RESEND_FROM_EMAIL.
// Free tier without a verified domain: keep the default onboarding sender
// and make ADMIN_EMAIL the same address as the Resend account.
// ---------------------------------------------------------------------------
export async function sendAdminEmail({ subject, html }) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.ADMIN_EMAIL;
    if (!apiKey || !to) return false; // not configured → bell only
    const from =
      process.env.RESEND_FROM_EMAIL || "Sara Dolls <onboarding@resend.dev>";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[notify] resend failed:", res.status, text.slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[notify] email failed:", err?.message || err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Shared Arabic RTL email shell (inline styles for mail clients)
// ---------------------------------------------------------------------------
function emailShell({ heading, intro, rowsHtml, ctaUrl, ctaLabel }) {
  const url = ctaUrl || `${siteUrl()}/admin`;
  return `<!doctype html>
<html dir="rtl" lang="ar">
<body style="margin:0;background:#FFF8F5;font-family:tahoma,arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#E88A9A;color:#fff;border-radius:18px 18px 0 0;padding:20px;text-align:center;">
      <div style="font-size:22px;font-weight:bold;">${heading}</div>
      <div style="font-size:13px;opacity:.9;">سارة دولز 🌸</div>
    </div>
    <div style="background:#ffffff;border:1px solid #f3d9d4;border-top:0;border-radius:0 0 18px 18px;padding:22px;color:#5C3A21;font-size:14px;line-height:2;">
      <p style="margin:0 0 12px;">${intro}</p>
      ${rowsHtml}
      <div style="text-align:center;margin-top:18px;">
        <a href="${url}" style="display:inline-block;background:#E88A9A;color:#fff;text-decoration:none;font-weight:bold;padding:12px 30px;border-radius:14px;">${ctaLabel}</a>
      </div>
    </div>
    <p style="text-align:center;color:#a58a76;font-size:11px;">تنبيه تلقائي من متجر سارة دولز</p>
  </div>
</body>
</html>`;
}

function row(label, value) {
  return `<div style="background:#FFF8F5;border-radius:10px;padding:8px 12px;margin-bottom:8px;"><b>${label}:</b> ${esc(value) || "—"}</div>`;
}

// ---------------------------------------------------------------------------
// New REGULAR order → bell + email
// ---------------------------------------------------------------------------
export async function notifyNewOrder({
  id = null,
  orderNumber,
  fullName,
  phone,
  governorate,
  total,
  paymentMethod,
  items = [], // [{name, qty, line}]
}) {
  const title = `طلب جديد #${orderNumber} 🛍️`;
  const body = `${fullName} • ${phone} • الإجمالي ${total} ج.م`;
  const link = "/admin/orders";
  const payAr = paymentMethod === "instapay" ? "إنستاباي" : "الدفع عند الاستلام";
  const itemsHtml = items.length
    ? `<div style="margin:10px 0;">${items
        .map(
          (i) =>
            `<div style="background:#FFF8F5;border-radius:10px;padding:8px 12px;margin-bottom:8px;">• ${esc(i.name)} × ${i.qty} = ${esc(i.line)} ج.م</div>`
        )
        .join("")}</div>`
    : "";

  const html = emailShell({
    heading: esc(title),
    intro: "وصل طلب جديد من المتجر 🎉",
    rowsHtml:
      row("رقم الطلب", `#${orderNumber}`) +
      row("الاسم", fullName) +
      row("الهاتف", phone) +
      row("المحافظة", governorate) +
      row("الدفع", payAr) +
      itemsHtml +
      row("الإجمالي", `${total} ج.م`),
    ctaUrl: `${siteUrl()}/admin/orders`,
    ctaLabel: "فتح الطلبات",
  });

  const [bell, mail] = await Promise.allSettled([
    createAdminNotification({
      type: "new_order",
      title_ar: title,
      body_ar: body,
      link,
      ref_id: id,
      ref_number: orderNumber,
    }),
    sendAdminEmail({ subject: `${title} — سارة دولز`, html }),
  ]);
  return {
    bell: bell.status === "fulfilled" && bell.value,
    mail: mail.status === "fulfilled" && mail.value,
  };
}

// ---------------------------------------------------------------------------
// New CUSTOM order → bell + email
// ---------------------------------------------------------------------------
export async function notifyNewCustomOrder({
  id = null,
  orderNumber,
  fullName,
  phone,
  orderType,
  description,
  imagesCount = 0,
}) {
  const title = `طلب خاص جديد #${orderNumber} ✨`;
  const body = `${fullName} • ${phone} • ${orderTypeLabel(orderType)}`;
  const link = "/admin/custom-orders";
  const shortDesc =
    String(description || "").length > 220
      ? String(description).slice(0, 220) + "…"
      : String(description || "—");

  const html = emailShell({
    heading: esc(title),
    intro: "وصل طلب خاص جديد من المتجر ✨",
    rowsHtml:
      row("رقم الطلب", `#${orderNumber}`) +
      row("الاسم", fullName) +
      row("الهاتف", phone) +
      row("نوع الطلب", orderTypeLabel(orderType)) +
      row("الوصف", shortDesc) +
      row("الصور المرجعية", `${imagesCount} صور`),
    ctaUrl: `${siteUrl()}/admin/custom-orders`,
    ctaLabel: "فتح الطلبات الخاصة",
  });

  const [bell, mail] = await Promise.allSettled([
    createAdminNotification({
      type: "new_custom_order",
      title_ar: title,
      body_ar: body,
      link,
      ref_id: id,
      ref_number: orderNumber,
    }),
    sendAdminEmail({ subject: `${title} — سارة دولز`, html }),
  ]);
  return {
    bell: bell.status === "fulfilled" && bell.value,
    mail: mail.status === "fulfilled" && mail.value,
  };
}
