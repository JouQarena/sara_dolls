import {
  ShoppingBag,
  Sparkles,
  Banknote,
  Clock,
  Package,
  Mail,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { getDashboardStats } from "@/lib/admin";
import { AdminHeader, StatCard } from "@/components/admin/ui";
import { formatEGP } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const s = await getDashboardStats();

  return (
    <div>
      <AdminHeader title="لوحة التحكم 🌸" subtitle="نظرة عامة على متجر سارة دولز" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Banknote} tone="green" label="إجمالي الإيرادات" value={formatEGP(s.revenue)} />
        <StatCard icon={ShoppingBag} label="إجمالي الطلبات" value={s.totalOrders.toLocaleString("ar-EG")} href="/admin/orders" />
        <StatCard icon={Sparkles} tone="rose" label="الطلبات الخاصة" value={s.totalCustomOrders.toLocaleString("ar-EG")} href="/admin/custom-orders" />
        <StatCard icon={Package} tone="blue" label="المنتجات" value={s.totalProducts.toLocaleString("ar-EG")} href="/admin/products" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Clock} tone="amber" label="طلبات قيد الانتظار" value={s.pendingOrders.toLocaleString("ar-EG")} href="/admin/orders" />
        <StatCard icon={Sparkles} tone="amber" label="طلبات خاصة للمراجعة" value={s.pendingCustom.toLocaleString("ar-EG")} href="/admin/custom-orders" />
        <StatCard icon={MessageSquare} tone="rose" label="رسائل غير مقروءة" value={s.unreadMessages.toLocaleString("ar-EG")} href="/admin/messages" />
        <StatCard icon={Mail} tone="blue" label="المشتركون" value={s.subscribers.toLocaleString("ar-EG")} href="/admin/subscribers" />
      </div>

      {s.lowStock > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          <p className="font-bold text-amber-800">
            يوجد {s.lowStock.toLocaleString("ar-EG")} منتج بمخزون منخفض أو غير متاح — راجعي{" "}
            <a href="/admin/products" className="underline">المنتجات</a>.
          </p>
        </div>
      )}
    </div>
  );
}
