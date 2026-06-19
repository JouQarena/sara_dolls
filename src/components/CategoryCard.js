import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

const CATEGORY_EMOJI = {
  dolls: "🧸",
  patterns: "🧶",
  "adult-gifts": "🎁",
  "kids-gifts": "🎈",
  custom: "✨",
};

export default function CategoryCard({ category }) {
  const special = category.is_special;
  const href = special ? "/طلب-خاص" : `/category/${category.slug}`;
  const emoji = CATEGORY_EMOJI[category.slug] || "🌸";

  if (special) {
    return (
      <Link
        href={href}
        className="group relative col-span-2 md:col-span-1 rounded-3xl p-6 bg-gradient-to-br from-soft-rose to-brand-dark text-white shadow-soft overflow-hidden hover:-translate-y-1 transition flex flex-col items-center text-center"
      >
        <span className="absolute top-3 left-3 text-[0.65rem] font-black bg-white/25 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> مميّز
        </span>
        <div className="text-5xl mb-3 group-hover:scale-110 transition">{emoji}</div>
        <h3 className="font-black text-lg mb-1">{category.name_ar}</h3>
        <p className="text-white/80 text-xs font-semibold leading-relaxed">
          {category.description_ar}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-black bg-white text-soft-rose px-4 py-2 rounded-full">
          اطلبي الآن <ArrowLeft className="w-4 h-4" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group rounded-3xl p-6 bg-white border border-pastel-pink/40 shadow-soft-sm hover:shadow-soft hover:-translate-y-1 transition flex flex-col items-center text-center"
    >
      <div className="text-5xl mb-3 group-hover:scale-110 transition">{emoji}</div>
      <h3 className="font-black text-warm-mocha mb-1">{category.name_ar}</h3>
      <p className="text-warm-mocha/60 text-xs font-semibold leading-relaxed line-clamp-2">
        {category.description_ar}
      </p>
    </Link>
  );
}
