import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, ShieldCheck, Truck, Heart } from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  getCategoryBySlug,
} from "@/lib/products";
import { formatEGP } from "@/lib/constants";
import ProductGallery from "@/components/ProductGallery";
import AddToCartBox from "@/components/AddToCartBox";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "المنتج غير موجود | سارة دولز" };
  return {
    title: `${product.name_ar} | سارة دولز`,
    description: product.description_ar?.slice(0, 160),
    openGraph: {
      title: product.name_ar,
      description: product.description_ar?.slice(0, 160),
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    product.category_slug ? getCategoryBySlug(product.category_slug) : null,
    getRelatedProducts(product, 4),
  ]);

  const isPattern = product.product_type === "pattern_pdf";
  const outOfStock = !isPattern && product.stock <= 0;
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;
  const reviews = product.reviews || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_ar,
    description: product.description_ar,
    image: product.image_url ? [product.image_url] : [],
    brand: { "@type": "Brand", name: "Sara Dolls" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EGP",
      price: Number(product.price),
      availability: outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
    ...(product.review_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.average_rating,
            reviewCount: product.review_count,
          },
        }
      : {}),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* breadcrumb */}
        <nav className="text-sm font-bold text-warm-mocha/50 flex items-center gap-1.5 mb-6 flex-wrap">
          <Link href="/" className="hover:text-soft-rose">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-soft-rose">المتجر</Link>
          {category && (
            <>
              <span>/</span>
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-soft-rose"
              >
                {category.name_ar}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-warm-mocha line-clamp-1">{product.name_ar}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* gallery */}
          <ProductGallery
            images={product.images_gallery?.length ? product.images_gallery : [product.image_url]}
            alt={product.name_ar}
            isPattern={isPattern}
            discountPct={discountPct}
          />

          {/* info */}
          <div>
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="inline-block text-soft-rose font-black text-sm mb-2 hover:underline"
              >
                {category.name_ar}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-black text-warm-mocha leading-tight mb-3">
              {product.name_ar}
            </h1>

            {product.review_count > 0 && (
              <div className="mb-4">
                <StarRating
                  value={product.average_rating}
                  count={product.review_count}
                  size="lg"
                />
              </div>
            )}

            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-black text-soft-rose">
                {formatEGP(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg font-bold text-warm-mocha/40 line-through">
                  {formatEGP(product.original_price)}
                </span>
              )}
            </div>

            {/* stock badge */}
            <div className="mb-5">
              {isPattern ? (
                <span className="inline-flex items-center gap-1.5 bg-warm-mocha/10 text-warm-mocha text-sm font-black px-3 py-1.5 rounded-full">
                  <FileText className="w-4 h-4" /> منتج رقمي — يصلك فور الشراء
                </span>
              ) : outOfStock ? (
                <span className="inline-block bg-rose-100 text-rose-600 text-sm font-black px-3 py-1.5 rounded-full">
                  نفد المخزون
                </span>
              ) : (
                <span className="inline-block bg-green-100 text-green-700 text-sm font-black px-3 py-1.5 rounded-full">
                  متوفّر ✓
                </span>
              )}
            </div>

            <p className="text-warm-mocha/80 font-semibold leading-loose mb-6">
              {product.description_ar}
            </p>

            <AddToCartBox product={product} />

            {/* trust badges */}
            <div className="grid grid-cols-3 gap-2 mt-7">
              <TrustBadge icon={Heart} text="مصنوع يدويًا" />
              <TrustBadge icon={ShieldCheck} text="خامات آمنة" />
              <TrustBadge icon={Truck} text="شحن لكل مصر" />
            </div>

            {isPattern && (
              <div className="mt-6 rounded-2xl bg-cream border border-pastel-pink/50 p-4">
                <p className="font-black text-warm-mocha text-sm mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-soft-rose" /> عن الباترون الرقمي
                </p>
                <p className="text-sm text-warm-mocha/70 font-semibold leading-relaxed">
                  ملف PDF بخطوات مصوّرة وواضحة، يصلك فور إتمام الطلب. مخصّص للاستخدام
                  الشخصي فقط وغير قابل للإرجاع بعد التحميل.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* description + reviews */}
        <section className="mt-14 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black text-warm-mocha mb-4">
              التقييمات ({reviews.length.toLocaleString("ar-EG")})
            </h2>
            {reviews.length === 0 ? (
              <p className="text-warm-mocha/60 font-bold bg-cream rounded-2xl p-6 text-center">
                لا توجد تقييمات بعد — كوني أول من يقيّم هذا المنتج 🌸
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl p-5 border border-pastel-pink/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-soft-rose text-white grid place-items-center text-xs font-black">
                          {(r.author || "ع").charAt(0)}
                        </span>
                        <span className="font-black text-warm-mocha text-sm">
                          {r.author || "عميلة"}
                        </span>
                      </div>
                      <StarRating value={r.rating} />
                    </div>
                    <p className="text-warm-mocha/75 font-semibold leading-relaxed">
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="bg-cream rounded-3xl p-6 border border-pastel-pink/40 h-fit">
            <p className="font-black text-warm-mocha mb-2">✨ تحبّي تصميم مخصّص؟</p>
            <p className="text-sm text-warm-mocha/70 font-semibold leading-relaxed mb-4">
              لو عايزة قطعة بمواصفات خاصة، احكيلنا فكرتك وهنصنعها مخصوص لك.
            </p>
            <Link
              href="/طلب-خاص"
              className="block text-center bg-soft-rose text-white font-black py-3 rounded-2xl hover:bg-brand-dark transition"
            >
              اطلبي تصميمك الخاص
            </Link>
          </aside>
        </section>

        {/* related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-black text-warm-mocha mb-5">
              قد يعجبك أيضًا
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function TrustBadge({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center gap-1.5 bg-cream rounded-2xl p-3 text-center">
      <Icon className="w-5 h-5 text-soft-rose" />
      <span className="text-[0.7rem] font-black text-warm-mocha">{text}</span>
    </div>
  );
}
