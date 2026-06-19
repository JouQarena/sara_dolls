import { PageHeader } from "@/components/legal";
import { getCurrentUser } from "@/lib/auth";
import { getMyOrders, getMyCustomOrders, isDemoMode } from "@/lib/orders";
import MyOrdersTabs from "./MyOrdersTabs";

export const dynamic = "force-dynamic";

export const metadata = { title: "طلباتي | سارة دولز" };

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  const userId = user?.id || null;

  const [orders, customOrders] = await Promise.all([
    getMyOrders(userId),
    getMyCustomOrders(userId),
  ]);

  return (
    <main>
      <PageHeader emoji="📦" title="طلباتي" subtitle="تابعي حالة طلباتك العادية والخاصة." />
      <div className="max-w-3xl mx-auto px-5 py-8">
        {isDemoMode() && (
          <p className="text-xs font-bold text-amber-700 bg-amber-50 rounded-xl p-2.5 mb-4 text-center">
            وضع المعاينة: تُعرض بيانات تجريبية (لم تُضبط بيانات Supabase بعد).
          </p>
        )}
        <MyOrdersTabs orders={orders} customOrders={customOrders} />
      </div>
    </main>
  );
}
