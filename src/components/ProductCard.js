import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import StarRating from "@/components/StarRating";
import { formatEGP } from "@/lib/constants";

export default function ProductCard({ product }) {
  const {
    slug,
    name_ar,
    price,
    original_price,
    image_url,
    average_rating,
    review_count,
    stock,
    product_type,
    is_featured,
  } = product;

  const isPattern = product_type === "pattern_pdf";
  const outOfStock = !isPattern && stock <= 0;
  const hasDiscount = original_price && original_price > price;
  const discountPct = hasDiscount
    ? Math.round((1 - price / original_price) * 100)
    : 0;

  return (
    <Link
      href={`/product/${slug}`}
      className="group bg-white rounded-3xl overflow-hidden border border-pastel-pink/40 shadow-soft-sm hover:shadow-soft hover:-translate-y-1 transition flex flex-col"
    >
      <div className="relative aspect-square bg-cream overflow-hidden">
        <Image
          src={image_url || "/sara-avatar.jpg"}
          alt={name_ar}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        {/* badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          {is_featured && (
            <span className="bg-soft-rose text-white text-[0.65rem] font-black px-2.5 py-1 rounded-full shadow-sm">
              مميّز 🌟
            </span>
          )}
          {hasDiscount && (
            <span className="bg-amber-500 text-white text-[0.65rem] font-black px-2.5 py-1 rounded-full shadow-sm">
              خصم {discountPct}%
            </span>
          )}
        </div>

        {isPattern && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-warm-mocha text-cream text-[0.65rem] font-black px-2.5 py-1 rounded-full">
            <FileText className="w-3 h-3" /> باترون رقمي
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-warm-mocha/45 grid place-items-center">
            <span className="bg-white text-warm-mocha text-sm font-black px-4 py-1.5 rounded-full">
              نفد المخزون
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-warm-mocha leading-snug line-clamp-2 mb-2 min-h-[2.6em]">
          {name_ar}
        </h3>

        {review_count > 0 && (
          <div className="mb-2">
            <StarRating value={average_rating} count={review_count} />
          </div>
        )}

        <div className="mt-auto flex items-center gap-2">
          <span className="font-black text-soft-rose text-lg">
            {formatEGP(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm font-bold text-warm-mocha/40 line-through">
              {formatEGP(original_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
