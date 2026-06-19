import { Suspense } from "react";
import { PackageOpen } from "lucide-react";
import { getCategories, getProducts } from "@/lib/products";
import ShopControls from "@/components/ShopControls";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { PageHeader } from "@/components/legal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "المتجر | سارة دولز",
  description: "تصفّحي كل منتجات سارة دولز: دمى، باترونات، وهدايا مصنوعة يدويًا.",
};

export default async function ShopPage({ searchParams }) {
  const category = searchParams?.category || null;
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "featured";
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ category, search, sort, page, pageSize: 12 }),
  ]);

  const { products, total, totalPages } = result;

  return (
    <main>
      <PageHeader
        emoji="🛍️"
        title="متجر سارة دولز"
        subtitle="كل قطعة مصنوعة يدويًا بحب — اختاري ما يناسبك."
      />

      <div className="max-w-6xl mx-auto px-5 py-8">
        <Suspense fallback={<div className="h-24" />}>
          <ShopControls categories={categories} />
        </Suspense>

        <p className="text-sm font-bold text-warm-mocha/50 mt-5 mb-4">
          {total.toLocaleString("ar-EG")} منتج
        </p>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <PackageOpen className="w-16 h-16 mx-auto text-pastel-pink mb-4" />
            <p className="text-xl font-black text-warm-mocha mb-1">
              لا توجد منتجات
            </p>
            <p className="text-warm-mocha/60 font-bold">
              جرّبي تغيير الفلتر أو البحث بكلمة أخرى.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/shop"
              searchParams={{ category, search, sort }}
            />
          </>
        )}
      </div>
    </main>
  );
}
