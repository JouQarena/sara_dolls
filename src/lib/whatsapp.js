// Build a wa.me link to the store admin with a prefilled message.
export function whatsappLink(message, number) {
  const num = (number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "")
    .toString()
    .replace(/[^\d]/g, "");
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${num}?text=${text}`;
}

// Public (client-safe) WhatsApp number.
export function adminWhatsappNumber() {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "")
    .toString()
    .replace(/[^\d]/g, "");
}

// Arabic WhatsApp summary for a NEW CUSTOM ORDER.
export function customOrderWhatsappMessage({
  orderNumber,
  fullName,
  phone,
  orderType,
  description,
  colors,
  size,
  budget,
  deadline,
  notes,
  imagesCount = 0,
}) {
  return [
    "طلب خاص جديد ✨",
    "-----------",
    `رقم الطلب: #${orderNumber}`,
    `الاسم: ${fullName}`,
    `الهاتف: ${phone}`,
    "-----------",
    `نوع الطلب: ${orderType}`,
    `الوصف: ${description}`,
    `الألوان: ${colors || "—"}`,
    `المقاس: ${size || "—"}`,
    `الميزانية: ${budget || "—"}`,
    `الموعد: ${deadline || "—"}`,
    "-----------",
    `ملاحظات: ${notes || "—"}`,
    `صور المرجع: ${imagesCount} صور مرفقة`,
  ].join("\n");
}

// Arabic WhatsApp summary for a NEW REGULAR ORDER (used in Phase 6).
export function regularOrderWhatsappMessage({
  orderNumber,
  fullName,
  phone,
  governorate,
  address,
  items, // array of "name x qty"
  total,
  paymentMethod,
}) {
  return [
    "طلب جديد 🛍️",
    "-----------",
    `رقم الطلب: #${orderNumber}`,
    `الاسم: ${fullName}`,
    `الهاتف: ${phone}`,
    `المحافظة: ${governorate}`,
    `العنوان: ${address}`,
    "-----------",
    "المنتجات:",
    (items || []).join("\n"),
    "-----------",
    `الإجمالي: ${total} ج.م`,
    `طريقة الدفع: ${paymentMethod}`,
  ].join("\n");
}
