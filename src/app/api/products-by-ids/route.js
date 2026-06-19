import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids)) return NextResponse.json({ products: [] });
    const products = await getProductsByIds(ids.slice(0, 100));
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
