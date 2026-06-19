import { requireAdmin, adminConfigured } from "@/lib/admin";
import AdminSidebar from "./AdminSidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "لوحة الإدارة | سارة دولز",
  robots: { index: false },
};

export default async function AdminLayout({ children }) {
  // In demo (no service key), allow viewing so it can be previewed.
  if (adminConfigured()) {
    await requireAdmin();
  }

  return (
    <div className="flex min-h-screen bg-cream/50" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
        {!adminConfigured() && (
          <p className="text-xs font-bold text-amber-700 bg-amber-50 rounded-xl p-2.5 mb-4 text-center">
            وضع المعاينة: لوحة الإدارة تعرض بيانات تجريبية (لم تُضبط بيانات Supabase / مفتاح الخدمة بعد).
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
