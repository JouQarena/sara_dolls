// Arabic labels + badge styles for regular & custom order statuses.

export const ORDER_STATUS_AR = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export const ORDER_STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-rose-100 text-rose-600",
};

export const CUSTOM_STATUS_AR = {
  pending_review: "قيد المراجعة",
  quoted: "تم إرسال عرض السعر",
  approved: "تمت الموافقة",
  in_progress: "قيد التنفيذ",
  completed: "اكتمل",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export const CUSTOM_STATUS_STYLE = {
  pending_review: "bg-amber-100 text-amber-700",
  quoted: "bg-soft-rose/20 text-soft-rose",
  approved: "bg-blue-100 text-blue-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  completed: "bg-teal-100 text-teal-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-rose-100 text-rose-600",
};

// Can a regular order still be cancelled by the customer?
export function canCancelOrder(order) {
  if (!order) return false;
  if (order.status !== "pending") return false;
  const created = new Date(order.created_at).getTime();
  const hours = (Date.now() - created) / (1000 * 60 * 60);
  return hours <= 24;
}

export function formatDateAr(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
