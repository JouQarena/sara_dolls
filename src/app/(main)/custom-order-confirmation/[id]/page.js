import { createClient } from "@/lib/supabase/server";
import ConfirmationClient from "./ConfirmationClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "تم استلام طلبك الخاص | سارة دولز",
  robots: { index: false },
};

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function CustomOrderConfirmationPage({ params }) {
  let orderNumber = null;

  // Try to fetch the human-friendly order number (best-effort).
  if (isConfigured() && params.id !== "DEMO") {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("custom_orders")
        .select("order_number")
        .eq("id", params.id)
        .maybeSingle();
      orderNumber = data?.order_number ?? null;
    } catch {}
  }

  return <ConfirmationClient id={params.id} orderNumber={orderNumber} />;
}
