import { createClient } from "@/lib/supabase/server";

const DEFAULT_SETTINGS = {
  store_name: "Sara Dolls",
  store_name_ar: "سارة دولز",
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  instapay_number: process.env.NEXT_PUBLIC_INSTAPAY_NUMBER || "",
  flat_shipping_fee: 50,
  free_shipping_threshold: 1000,
  announcement_bar_text:
    "🌸 شحن مجاني داخل مصر للطلبات فوق 1000 ج.م — تسوقي الآن!",
};

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getSiteSettings() {
  if (!isConfigured()) return DEFAULT_SETTINGS;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return { ...DEFAULT_SETTINGS, ...(data || {}) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Compute shipping fee given a subtotal.
export function computeShipping(subtotal, settings) {
  const fee = Number(settings?.flat_shipping_fee ?? 50);
  const threshold = Number(settings?.free_shipping_threshold ?? 0);
  if (threshold > 0 && subtotal >= threshold) return 0;
  return fee;
}
