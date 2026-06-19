import { admin, adminConfigured } from "@/lib/admin";
import { STORAGE_BUCKETS } from "@/lib/constants";

// ---------- ORDERS ----------
const DEMO_ADMIN_ORDERS = [
  {
    id: "o1", order_number: 1042, full_name: "منى علي", phone_number: "01155667788",
    governorate: "القاهرة", city: "مدينة نصر", address: "شارع 9، عمارة 12",
    payment_method: "cash_on_delivery", instapay_screenshot_url: null,
    subtotal: 570, shipping_fee: 50, discount_amount: 0, total_price: 620,
    status: "pending", notes: "", created_at: "2026-06-16T10:00:00Z",
    order_items: [{ id: "i1", product_name_ar: "دمية سارة الكلاسيكية", quantity: 2, price_at_purchase: 285 }],
  },
  {
    id: "o2", order_number: 1051, full_name: "هبة محمد", phone_number: "01099887766",
    governorate: "الجيزة", city: "الدقي", address: "شارع التحرير",
    payment_method: "instapay", instapay_screenshot_url: "demo/path.jpg",
    subtotal: 90, shipping_fee: 50, discount_amount: 0, total_price: 140,
    status: "shipped", notes: "", created_at: "2026-06-14T09:00:00Z",
    order_items: [{ id: "i2", product_name_ar: "باترون أرنب أميجورومي", quantity: 1, price_at_purchase: 90 }],
  },
];

export async function adminGetOrders() {
  if (!adminConfigured()) return DEMO_ADMIN_ORDERS;
  const sb = admin();
  const { data } = await sb
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  return data || [];
}

// ---------- CUSTOM ORDERS ----------
const DEMO_ADMIN_CUSTOM = [
  {
    id: "co1", order_number: 3007, full_name: "سارة أحمد", phone_number: "01012345678",
    email: "sara@example.com", governorate: "القاهرة", city: "المعادي", address: "—",
    order_type: "doll", description: "دمية تشبه بنتي بشعر بني وفستان وردي",
    preferred_colors: "وردي وبني", size: "medium", budget_range: "200_500",
    deadline: "2026-07-10", additional_notes: "تطريز الاسم لو ممكن",
    reference_images: [], status: "pending_review", admin_quote_price: null,
    admin_notes: null, created_at: "2026-06-15T09:00:00Z",
  },
  {
    id: "co2", order_number: 3012, full_name: "ندى سمير", phone_number: "01233344455",
    email: null, governorate: "الإسكندرية", city: "سموحة", address: "—",
    order_type: "gift", description: "باقة ورد كروشيه لعيد ميلاد",
    preferred_colors: "أحمر وأبيض", size: "large", budget_range: "500_1000",
    deadline: null, additional_notes: null, reference_images: [],
    status: "quoted", admin_quote_price: 650, admin_notes: "التنفيذ خلال أسبوع",
    created_at: "2026-06-13T11:00:00Z",
  },
];

export async function adminGetCustomOrders() {
  if (!adminConfigured()) return DEMO_ADMIN_CUSTOM;
  const sb = admin();
  const { data } = await sb
    .from("custom_orders")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

// Signed URL for a private instapay screenshot.
export async function adminInstapaySignedUrl(path) {
  if (!path || !adminConfigured()) return null;
  try {
    const sb = admin();
    const { data } = await sb.storage
      .from(STORAGE_BUCKETS.INSTAPAY)
      .createSignedUrl(path, 60 * 30);
    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

// ---------- PRODUCTS ----------
export async function adminGetProducts() {
  if (!adminConfigured()) {
    const { DEMO_PRODUCTS } = await import("@/data/demoProducts");
    return DEMO_PRODUCTS;
  }
  const sb = admin();
  const { data } = await sb
    .from("products")
    .select("*, categories(name_ar)")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function adminGetCategories() {
  if (!adminConfigured()) {
    const { DEMO_CATEGORIES } = await import("@/data/demoProducts");
    return DEMO_CATEGORIES;
  }
  const sb = admin();
  const { data } = await sb.from("categories").select("*").order("sort_order");
  return data || [];
}

// ---------- DISCOUNTS ----------
export async function adminGetDiscounts() {
  if (!adminConfigured())
    return [
      { id: "d1", code: "SARA10", discount_type: "percentage", discount_value: 10, min_order_amount: 0, max_uses: 100, used_count: 12, expires_at: null, is_active: true },
    ];
  const sb = admin();
  const { data } = await sb.from("discount_codes").select("*").order("created_at", { ascending: false });
  return data || [];
}

// ---------- REVIEWS ----------
export async function adminGetReviews() {
  if (!adminConfigured())
    return [
      { id: "r1", rating: 5, comment: "تحفة فنية!", created_at: "2026-06-10", products: { name_ar: "دمية سارة الكلاسيكية" } },
    ];
  const sb = admin();
  const { data } = await sb
    .from("reviews")
    .select("*, products(name_ar)")
    .order("created_at", { ascending: false });
  return data || [];
}

// ---------- MESSAGES ----------
export async function adminGetMessages() {
  if (!adminConfigured())
    return [
      { id: "m1", name: "أمل", email: "amal@x.com", phone: "01000000000", message: "هل يوجد شحن لأسوان؟", is_read: false, created_at: "2026-06-16" },
    ];
  const sb = admin();
  const { data } = await sb.from("contact_messages").select("*").order("created_at", { ascending: false });
  return data || [];
}

// ---------- SUBSCRIBERS ----------
export async function adminGetSubscribers() {
  if (!adminConfigured())
    return [
      { id: "s1", email: "fan1@example.com", created_at: "2026-06-15" },
      { id: "s2", email: "fan2@example.com", created_at: "2026-06-12" },
    ];
  const sb = admin();
  const { data } = await sb.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
  return data || [];
}

// ---------- SETTINGS ----------
export async function adminGetSettings() {
  const { getSiteSettings } = await import("@/lib/settings");
  return getSiteSettings();
}
