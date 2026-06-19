import { adminGetDiscounts } from "@/lib/adminData";
import { AdminHeader } from "@/components/admin/ui";
import DiscountsManager from "./DiscountsManager";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const discounts = await adminGetDiscounts();
  return (
    <div>
      <AdminHeader title="أكواد الخصم" subtitle={`${discounts.length.toLocaleString("ar-EG")} كود`} />
      <DiscountsManager discounts={discounts} />
    </div>
  );
}
