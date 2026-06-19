// 🌸 Sara Dolls — shared constants (Egypt / EGP)

export const BRAND = {
  name: "Sara Dolls",
  nameAr: "سارة دولز",
  taglineAr: "كل دمية حكاية مصنوعة بحب",
  currency: "EGP",
  currencyAr: "ج.م",
};

// The 5 product categories (seeded into the DB in Phase 1).
export const CATEGORIES = [
  {
    slug: "dolls",
    name: "Dolls",
    nameAr: "الدمى",
    descriptionAr: "دمى كروشيه مصنوعة يدويًا بأحجام وشخصيات مختلفة",
    isSpecial: false,
  },
  {
    slug: "patterns",
    name: "Patterns",
    nameAr: "الباترونات",
    descriptionAr: "باترونات كروشيه جاهزة (PDF أو مطبوعة) لمحبي الصنع اليدوي",
    isSpecial: false,
  },
  {
    slug: "adult-gifts",
    name: "Gifts for Adults",
    nameAr: "هدايا للكبار",
    descriptionAr: "هدايا كروشيه مثالية للكبار",
    isSpecial: false,
  },
  {
    slug: "kids-gifts",
    name: "Gifts for Kids",
    nameAr: "هدايا للأطفال",
    descriptionAr: "هدايا كروشيه لطيفة وآمنة للأطفال",
    isSpecial: false,
  },
  {
    slug: "custom",
    name: "Custom Orders",
    nameAr: "طلبات خاصة",
    descriptionAr: "طلبات يدوية مخصصة تُصنع خصيصًا لك",
    isSpecial: true,
  },
];

// The 27 governorates of Egypt (Arabic + slug).
export const EGYPT_GOVERNORATES = [
  { slug: "cairo", ar: "القاهرة" },
  { slug: "giza", ar: "الجيزة" },
  { slug: "alexandria", ar: "الإسكندرية" },
  { slug: "dakahlia", ar: "الدقهلية" },
  { slug: "red-sea", ar: "البحر الأحمر" },
  { slug: "beheira", ar: "البحيرة" },
  { slug: "fayoum", ar: "الفيوم" },
  { slug: "gharbia", ar: "الغربية" },
  { slug: "ismailia", ar: "الإسماعيلية" },
  { slug: "menofia", ar: "المنوفية" },
  { slug: "minya", ar: "المنيا" },
  { slug: "qaliubiya", ar: "القليوبية" },
  { slug: "new-valley", ar: "الوادي الجديد" },
  { slug: "suez", ar: "السويس" },
  { slug: "aswan", ar: "أسوان" },
  { slug: "assiut", ar: "أسيوط" },
  { slug: "beni-suef", ar: "بني سويف" },
  { slug: "port-said", ar: "بورسعيد" },
  { slug: "damietta", ar: "دمياط" },
  { slug: "sharkia", ar: "الشرقية" },
  { slug: "south-sinai", ar: "جنوب سيناء" },
  { slug: "kafr-el-sheikh", ar: "كفر الشيخ" },
  { slug: "matrouh", ar: "مطروح" },
  { slug: "luxor", ar: "الأقصر" },
  { slug: "qena", ar: "قنا" },
  { slug: "north-sinai", ar: "شمال سيناء" },
  { slug: "sohag", ar: "سوهاج" },
];

// Order status options (regular orders).
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// Custom order status workflow.
export const CUSTOM_ORDER_STATUSES = [
  "pending_review",
  "quoted",
  "approved",
  "in_progress",
  "completed",
  "delivered",
  "cancelled",
];

export const PAYMENT_METHODS = {
  COD: "cash_on_delivery",
  INSTAPAY: "instapay",
};

// Supabase Storage bucket names (created in Phase 1 SQL/console steps).
export const STORAGE_BUCKETS = {
  PRODUCTS: "products",
  INSTAPAY: "instapay-screenshots",
  CUSTOM_REFS: "custom-order-references",
};

// Format a price in EGP for Arabic display.
export function formatEGP(amount) {
  const n = Number(amount || 0);
  return `${n.toLocaleString("ar-EG")} ج.م`;
}
