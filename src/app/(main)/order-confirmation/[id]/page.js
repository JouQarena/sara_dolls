import { createClient } from "@/lib/supabase/server";
import OrderConfirmationClient from "./OrderConfirmationClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "تم تأكيد طلبك | سارة دولز",
  robots: { index: false },
};

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function OrderConfirmationPage({ params }) {
  let orderNumber = null;

  if (isConfigured() && params.id !== "DEMO") {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("order_number")
        .eq("id", params.id)
        .maybeSingle();
      orderNumber = data?.order_number ?? null;
    } catch {}
  }

  return <OrderConfirmationClient id={params.id} orderNumber={orderNumber} />;
}
