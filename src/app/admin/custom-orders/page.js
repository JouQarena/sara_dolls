import { adminGetCustomOrders } from "@/lib/adminData";
import { AdminHeader, TableWrap, EmptyRow } from "@/components/admin/ui";
import CustomOrderRow from "./CustomOrderRow";

export const dynamic = "force-dynamic";

export default async function AdminCustomOrdersPage() {
  const orders = await adminGetCustomOrders();
  const pending = orders.filter((o) => o.status === "pending_review").length;

  return (
    <div>
      <AdminHeader
        title="الطلبات الخاصة ✨"
        subtitle={`${orders.length.toLocaleString("ar-EG")} طلب · ${pending.toLocaleString("ar-EG")} بانتظار المراجعة`}
      />
      <TableWrap head={["رقم", "العميلة", "النوع", "عرض السعر", "الحالة", "التاريخ", ""]}>
        {orders.length === 0 ? (
          <EmptyRow>لا توجد طلبات خاصة بعد.</EmptyRow>
        ) : (
          orders.map((o) => <CustomOrderRow key={o.id} order={o} />)
        )}
      </TableWrap>
    </div>
  );
}
