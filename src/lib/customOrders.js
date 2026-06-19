// Constants & helpers shared by the Custom Orders feature.

export const ORDER_TYPES = [
  { value: "doll", label: "دمية كروشيه" },
  { value: "gift", label: "هدية مميّزة" },
  { value: "character", label: "إعادة تصميم شخصية" },
  { value: "other", label: "شيء آخر" },
];

export const SIZES = [
  { value: "small", label: "صغير" },
  { value: "medium", label: "متوسط" },
  { value: "large", label: "كبير" },
  { value: "custom", label: "مقاس مخصّص (اذكريه في الوصف)" },
];

export const BUDGET_RANGES = [
  { value: "under_200", label: "أقل من 200 ج.م" },
  { value: "200_500", label: "200 - 500 ج.م" },
  { value: "500_1000", label: "500 - 1000 ج.م" },
  { value: "1000_plus", label: "أكثر من 1000 ج.م" },
];

export const CUSTOM_STATUS_AR = {
  pending_review: "قيد المراجعة",
  quoted: "تم إرسال عرض السعر",
  approved: "تمت الموافقة",
  in_progress: "قيد التنفيذ",
  completed: "اكتمل",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export function orderTypeLabel(v) {
  return ORDER_TYPES.find((t) => t.value === v)?.label || v || "—";
}
export function sizeLabel(v) {
  return SIZES.find((s) => s.value === v)?.label || v || "—";
}
export function budgetLabel(v) {
  return BUDGET_RANGES.find((b) => b.value === v)?.label || v || "—";
}
