import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { PageHeader } from "@/components/legal";

export const dynamic = "force-dynamic";

const EMOJI = {
  dolls: "🧸",
  patterns: "🧶",
  "adult-gifts": "🎁",
  "kids-gifts": "🎈",
};

export async function generateMetadata({ params }) {
  const cat = await getCategoryBySlug(params.slug);
  return {
    title: cat ? `${cat.name_ar} | سارة دولز` : "التصنيف | سارة دولز",
    description: cat?.description_ar,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) notFound();
  if (cat.is_special) redirect(`/${encodeURIComponent("طلب-خاص")}`);

  const sort = searchParams?.sort || "featured";
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));

  const result = await getProducts({
    category: cat.slug,
    sort,
    page,
    pageSize: 12,
  });
  const { products, total, totalPages } = result;

  return (
    <main>
      <PageHeader
        emoji={EMOJI[cat.slug] || "📂"}
        title={cat.name_ar}
        subtitle={cat.description_ar}
      />

      {/* breadcrumb */}
      <div className="max-w-6xl mx-auto px-5 pt-5">
        <nav className="text-sm font-bold text-warm-mocha/50 flex items-center gap-1.5">
          <Link href="/" className="hover:text-soft-rose">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-soft-rose">المتجر</Link>
          <span>/</span>
          <span className="text-warm-mocha">{cat.name_ar}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6">
        <p className="text-sm font-bold text-warm-mocha/50 mb-4">
          {total.toLocaleString("ar-EG")} منتج
        </p>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <PackageOpen className="w-16 h-16 mx-auto text-pastel-pink mb-4" />
            <p className="text-xl font-black text-warm-mocha mb-1">
              لا توجد منتجات في هذا التصنيف بعد
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 bg-soft-rose text-white font-black px-6 py-3 rounded-2xl hover:bg-brand-dark transition"
            >
              تصفّحي كل المنتجات
            </Link>
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
              basePath={`/category/${cat.slug}`}
              searchParams={{ sort }}
            />
          </>
        )}
      </div>
    </main>
  );
}
