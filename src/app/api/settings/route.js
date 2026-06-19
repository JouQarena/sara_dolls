import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

// Public shipping/settings values for the cart & checkout UI.
export async function GET() {
  const s = await getSiteSettings();
  return NextResponse.json({
    flat_shipping_fee: Number(s.flat_shipping_fee ?? 50),
    free_shipping_threshold: Number(s.free_shipping_threshold ?? 0),
    instapay_number: s.instapay_number || "",
  });
}
