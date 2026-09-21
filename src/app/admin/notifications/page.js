import Link from "next/link";
import { Bell, ShoppingBag, Sparkles } from "lucide-react";
import { admin, adminConfigured } from "@/lib/admin";
import { AdminHeader } from "@/components/admin/ui";
import MarkAllRead from "./MarkAllRead";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "التنبيهات | سارة دولز",
  robots: { index: false },
};

function formatDateTime(iso) {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default async function AdminNotificationsPage() {
  let items = [];
  let unread = 0;
  if (adminConfigured()) {
    try {
      const sb = admin();
      const [{ data }, { count }] = await Promise.all([
        sb
          .from("notifications")
          .select("id, type, title_ar, body_ar, link, ref_number, is_read, created_at")
          .order("created_at", { ascending: false })
          .limit(100),
        sb.from("notifications").select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);
      items = data || [];
      unread = count || 0;
    } catch {}
  }

  return (
    <div>
      <AdminHeader
        title="التنبيهات 🔔"
        subtitle={
          unread > 0
            ? `عندك ${unread.toLocaleString("ar-EG")} تنبيه غير مقروء`
            : "كل التنبيهات مقروءة 🌸"
        }
        action={<MarkAllRead />}
      />

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-pastel-pink/40 py-16 text-center">
          <Bell className="w-14 h-14 mx-auto text-pastel-pink mb-3" />
          <p className="font-black text-warm-mocha text-lg">لا توجد تنبيهات بعد</p>
          <p className="text-sm font-bold text-warm-mocha/50 mt-1">
            الطلبات الجديدة (العادية والخاصة) هتظهر هنا تلقائيًا 🌸
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Link
              key={n.id}
              href={n.link || "/admin"}
              className={`flex items-start gap-3 bg-white rounded-2xl border p-4 hover:shadow-soft-sm transition ${
                n.is_read ? "border-pastel-pink/40" : "border-soft-rose/60 bg-pastel-pink/10"
              }`}
            >
              <span
                className={`w-11 h-11 grid place-items-center rounded-2xl shrink-0 ${
                  n.type === "new_custom_order"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-pastel-pink/40 text-soft-rose"
                }`}
              >
                {n.type === "new_custom_order" ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <ShoppingBag className="w-5 h-5" />
                )}
              </span>
              <span className="flex-1 min-w-0">
                <span className="font-black text-warm-mocha flex items-center gap-2">
                  {!n.is_read && <span className="w-2 h-2 rounded-full bg-soft-rose shrink-0" />}
                  {n.title_ar}
                </span>
                {n.body_ar && (
                  <span className="block text-sm font-bold text-warm-mocha/60 mt-0.5">
                    {n.body_ar}
                  </span>
                )}
                <span className="block text-xs font-bold text-warm-mocha/40 mt-1">
                  {formatDateTime(n.created_at)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
