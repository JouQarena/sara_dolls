import { NextResponse } from "next/server";
import { validateDiscount } from "@/app/(main)/checkout/actions";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();
    const result = await validateDiscount(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ valid: false, error: "تعذّر التحقق." });
  }
}
