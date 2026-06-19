import { adminGetSettings } from "@/lib/adminData";
import { AdminHeader } from "@/components/admin/ui";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await adminGetSettings();
  return (
    <div>
      <AdminHeader title="الإعدادات" subtitle="إعدادات المتجر العامة" />
      <SettingsForm settings={settings} />
    </div>
  );
}
