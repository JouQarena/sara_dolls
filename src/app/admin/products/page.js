import { adminGetProducts, adminGetCategories } from "@/lib/adminData";
import { AdminHeader } from "@/components/admin/ui";
import ProductsManager from "./ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    adminGetProducts(),
    adminGetCategories(),
  ]);

  return (
    <div>
      <AdminHeader title="المنتجات" subtitle={`${products.length.toLocaleString("ar-EG")} منتج`} />
      <ProductsManager products={products} categories={categories} />
    </div>
  );
}
