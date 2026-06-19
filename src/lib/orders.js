import { createClient } from "@/lib/supabase/server";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Demo data so /my-orders previews without Supabase.
const DEMO_ORDERS = [
  {
    id: "o1",
    order_number: 1042,
    status: "shipped",
    total_price: 620,
    subtotal: 570,
    shipping_fee: 50,
    discount_amount: 0,
    payment_method: "cash_on_delivery",
    governorate: "القاهرة",
    address: "مدينة نصر",
    created_at: "2026-06-12T10:00:00Z",
    order_items: [
      { id: "i1", product_name_ar: "دمية سارة الكلاسيكية", quantity: 2, price_at_purchase: 285 },
    ],
  },
  {
    id: "o2",
    order_number: 1051,
    status: "pending",
    total_price: 140,
    subtotal: 90,
    shipping_fee: 50,
    discount_amount: 0,
    payment_method: "instapay",
    governorate: "الجيزة",
    address: "الدقي",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    order_items: [
      { id: "i2", product_name_ar: "باترون أرنب أميجورومي", quantity: 1, price_at_purchase: 90 },
    ],
  },
];

const DEMO_CUSTOM = [
  {
    id: "co1",
    order_number: 3007,
    status: "quoted",
    order_type: "doll",
    description: "دمية تشبه بنتي بشعر بني وفستان وردي",
    preferred_colors: "وردي وبني",
    size: "medium",
    budget_range: "200_500",
    deadline: "2026-07-10",
    admin_quote_price: 450,
    admin_notes: "السعر يشمل تطريز الاسم. التنفيذ خلال 10 أيام.",
    reference_images: [],
    created_at: "2026-06-10T09:00:00Z",
  },
  {
    id: "co2",
    order_number: 3012,
    status: "pending_review",
    order_type: "gift",
    description: "باقة ورد كروشيه لعيد ميلاد",
    preferred_colors: "أحمر وأبيض",
    size: "large",
    budget_range: "500_1000",
    deadline: null,
    admin_quote_price: null,
    admin_notes: null,
    reference_images: [],
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
];

export async function getMyOrders(userId) {
  if (!isConfigured()) return DEMO_ORDERS;
  if (!userId) return [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function getMyCustomOrders(userId) {
  if (!isConfigured()) return DEMO_CUSTOM;
  if (!userId) return [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("custom_orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export function isDemoMode() {
  return !isConfigured();
}
