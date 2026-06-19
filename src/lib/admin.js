import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth";

export function adminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Guard: call at the top of every admin server component/action.
// Redirects non-admins to the login page.
export async function requireAdmin() {
  const ok = await isAdminUser();
  if (!ok) redirect("/login?redirect=/admin");
  return true;
}

// Service-role client (bypasses RLS) — SERVER ONLY, admin pages/actions only.
export function admin() {
  return createAdminClient();
}

// ---- Dashboard stats ----
export async function getDashboardStats() {
  if (!adminConfigured()) return demoStats();
  try {
    const sb = admin();
    const [
      ordersRes,
      customRes,
      productsRes,
      pendingOrdersRes,
      pendingCustomRes,
      messagesRes,
      subsRes,
    ] = await Promise.all([
      sb.from("orders").select("total_price, status, created_at"),
      sb.from("custom_orders").select("status"),
      sb.from("products").select("id, stock, is_available"),
      sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      sb
        .from("custom_orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_review"),
      sb.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      sb.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    ]);

    const orders = ordersRes.data || [];
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.total_price || 0), 0);
    const products = productsRes.data || [];

    return {
      totalOrders: orders.length,
      totalCustomOrders: (customRes.data || []).length,
      revenue,
      pendingOrders: pendingOrdersRes.count || 0,
      pendingCustom: pendingCustomRes.count || 0,
      unreadMessages: messagesRes.count || 0,
      subscribers: subsRes.count || 0,
      totalProducts: products.length,
      lowStock: products.filter((p) => !p.is_available || p.stock <= 3).length,
      recentOrders: orders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5),
    };
  } catch {
    return demoStats();
  }
}

function demoStats() {
  return {
    totalOrders: 42,
    totalCustomOrders: 13,
    revenue: 18650,
    pendingOrders: 5,
    pendingCustom: 3,
    unreadMessages: 2,
    subscribers: 87,
    totalProducts: 8,
    lowStock: 1,
    recentOrders: [],
    demo: true,
  };
}
