import { adminGetOrders, adminInstapaySignedUrl } from "@/lib/adminData";
import { AdminHeader, TableWrap, EmptyRow } from "@/components/admin/ui";
import OrderRow from "./OrderRow";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await adminGetOrders();

  // Pre-sign instapay screenshots.
  const signed = {};
  await Promise.all(
    orders
      .filter((o) => o.payment_method === "instapay" && o.instapay_screenshot_url)
      .map(async (o) => {
        signed[o.id] = await adminInstapaySignedUrl(o.instapay_screenshot_url);
      })
  );

  return (
    <div>
      <AdminHeader title="الطلبات" subtitle={`${orders.length.toLocaleString("ar-EG")} طلب`} />
      <TableWrap head={["رقم", "العميلة", "الهاتف", "الإجمالي", "الحالة", "التاريخ", ""]}>
        {orders.length === 0 ? (
          <EmptyRow>لا توجد طلبات بعد.</EmptyRow>
        ) : (
          orders.map((o) => <OrderRow key={o.id} order={o} signedScreenshot={signed[o.id]} />)
        )}
      </TableWrap>
    </div>
  );
}
