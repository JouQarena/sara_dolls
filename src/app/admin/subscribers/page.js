import { adminGetSubscribers } from "@/lib/adminData";
import { AdminHeader } from "@/components/admin/ui";
import SubscribersList from "./SubscribersList";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await adminGetSubscribers();
  return (
    <div>
      <AdminHeader title="المشتركون" subtitle={`${subscribers.length.toLocaleString("ar-EG")} مشترك`} />
      <SubscribersList subscribers={subscribers} />
    </div>
  );
}
