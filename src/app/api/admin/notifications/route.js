import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth";
import { admin, adminConfigured } from "@/lib/admin";

export const dynamic = "force-dynamic";

async function guard() {
  if (!adminConfigured()) return false;
  return await isAdminUser();
}

// GET /api/admin/notifications?limit=20 → { unread, items }
export async function GET(request) {
  if (!(await guard())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    const limit = Math.min(
      100,
      Math.max(1, Number(request.nextUrl.searchParams.get("limit") || 20))
    );
    const sb = admin();
    const [{ data, error }, { count }] = await Promise.all([
      sb
        .from("notifications")
        .select("id, type, title_ar, body_ar, link, ref_number, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
      sb
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
    ]);
    if (error) throw error;
    return NextResponse.json({ unread: count || 0, items: data || [] });
  } catch (err) {
    console.error("[notifications] GET failed:", err?.message || err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

// PATCH /api/admin/notifications  { all: true } | { ids: [...] } → { ok }
export async function PATCH(request) {
  if (!(await guard())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const sb = admin();
    if (body?.all) {
      const { error } = await sb
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);
      if (error) throw error;
    } else if (Array.isArray(body?.ids) && body.ids.length) {
      const { error } = await sb
        .from("notifications")
        .update({ is_read: true })
        .in("id", body.ids.slice(0, 100));
      if (error) throw error;
    }
    const { count } = await sb
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    return NextResponse.json({ ok: true, unread: count || 0 });
  } catch (err) {
    console.error("[notifications] PATCH failed:", err?.message || err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
