import { adminGetCategories } from "@/lib/adminData";
import { AdminHeader } from "@/components/admin/ui";
import CategoriesManager from "./CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await adminGetCategories();
  return (
    <div>
      <AdminHeader title="التصنيفات" subtitle={`${categories.length.toLocaleString("ar-EG")} تصنيف`} />
      <CategoriesManager categories={categories} />
    </div>
  );
}
