import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  MessageCircle,
  Palette,
  PackageCheck,
} from "lucide-react";
import { getCategories, getFeaturedProducts } from "@/lib/products";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import Newsletter from "@/components/Newsletter";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: Heart, title: "كروشيه يدوي 100%", desc: "منسوجة بشغف وإتقان في كل غرزة." },
  { icon: ShieldCheck, title: "خامات آمنة", desc: "خيوط قطنية ناعمة ولطيفة." },
  { icon: Sparkles, title: "تصميم حسب الطلب", desc: "اطلبي قطعتك المخصّصة بإيدينا." },
  { icon: Truck, title: "توصيل لكل مصر", desc: "شحن لكل المحافظات الـ 27." },
];

const HOW_IT_WORKS = [
  { icon: MessageCircle, title: "احكيلنا فكرتك", desc: "املئي نموذج الطلب الخاص بوصف فكرتك وصور مرجعية." },
  { icon: Palette, title: "نصمّم ونصنع", desc: "نرسل لك عرض سعر، وبعد موافقتك نبدأ التنفيذ بحب." },
  { icon: PackageCheck, title: "يصلك طلبك", desc: "نغلّف قطعتك بعناية ونوصّلها إلى باب بيتك." },
];

const TESTIMONIALS = [
  { name: "منى", text: "الدمية تحفة فنية! الخامة ناعمة جدًا والتفاصيل دقيقة 😍", rating: 5 },
  { name: "هبة", text: "أجمل هدية أهديتها لبنتي، بتعشقها. شكرًا سارة دولز 🌸", rating: 5 },
  { name: "ندى", text: "طلبت تصميم خاص لشخصية بنتي المفضلة وطلع زي الحلم بالظبط ✨", rating: 5 },
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pastel-pink/45 to-cream">
        <div className="max-w-6xl mx-auto px-5 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-right">
            <span className="inline-block bg-white text-soft-rose font-black text-sm px-4 py-1.5 rounded-full shadow-soft-sm mb-5">
              مصنوعة يدويًا بكل حب 🧶
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-warm-mocha leading-tight mb-4">
              دمى كروشيه دافئة <br /> تروي حكايات مصنوعة بحب
            </h1>
            <p className="text-warm-mocha/70 font-bold text-lg leading-relaxed mb-7 max-w-lg mx-auto md:mx-0">
              كل قطعة من سارة دولز منسوجة يدويًا من أجود الخيوط، لتكون رفيقة العمر
              وهدية لا تُنسى لمن تحبّين.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-soft-rose text-white font-black px-7 py-3.5 rounded-2xl hover:bg-brand-dark shadow-soft transition"
              >
                تسوّقي المجموعة <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/طلب-خاص"
                className="inline-flex items-center gap-2 bg-white text-warm-mocha font-black px-7 py-3.5 rounded-2xl border border-pastel-pink/60 hover:border-soft-rose transition"
              >
                ✨ طلب خاص
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-soft-rose/30 rounded-full blur-3xl" />
              <Image
                src="/sara-avatar.jpg"
                alt="Sara Dolls"
                width={380}
                height={380}
                priority
                className="relative rounded-full border-8 border-white shadow-soft animate-float-slow object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-5 -mt-6 md:-mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl p-5 border border-pastel-pink/40 shadow-soft-sm text-center"
            >
              <div className="w-12 h-12 mx-auto grid place-items-center rounded-2xl bg-pastel-pink/30 text-soft-rose mb-3">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-black text-warm-mocha text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-warm-mocha/60 font-semibold">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="text-center mb-9">
          <h2 className="text-2xl md:text-3xl font-black text-warm-mocha mb-2">
            تسوّقي حسب التصنيف
          </h2>
          <p className="text-warm-mocha/60 font-bold">
            اختاري ما يناسبك من مجموعاتنا المصنوعة بحب
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="bg-cream border-y border-pastel-pink/40">
          <div className="max-w-6xl mx-auto px-5 py-14">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-warm-mocha mb-1">
                  منتجات مميّزة 🌟
                </h2>
                <p className="text-warm-mocha/60 font-bold">
                  أكثر القطع المحبوبة لدى عميلاتنا
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-1.5 text-soft-rose font-black hover:gap-2.5 transition-all"
              >
                عرض الكل <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CUSTOM ORDER CTA BANNER */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="rounded-[2rem] bg-gradient-to-l from-soft-rose to-brand-dark text-white p-8 md:p-12 shadow-soft relative overflow-hidden">
          <div className="absolute -top-8 -left-8 text-9xl opacity-15">✨</div>
          <div className="relative max-w-2xl">
            <span className="inline-block bg-white/25 font-black text-sm px-4 py-1.5 rounded-full mb-4">
              الطلبات الخاصة
            </span>
            <h2 className="text-2xl md:text-4xl font-black mb-3 leading-tight">
              عندك فكرة معيّنة في بالك؟
            </h2>
            <p className="text-white/85 font-bold text-lg mb-6 leading-relaxed">
              شخصية محبّبة؟ هدية مميّزة؟ احكيلنا وهنصنعها مخصوص لك بإيدينا 💝
            </p>
            <Link
              href="/طلب-خاص"
              className="inline-flex items-center gap-2 bg-white text-soft-rose font-black px-8 py-4 rounded-2xl hover:bg-cream transition text-lg"
            >
              ابدئي طلبك الخاص <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-cream border-y border-pastel-pink/40">
        <div className="max-w-5xl mx-auto px-5 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-warm-mocha mb-2">
              كيف يعمل الطلب الخاص؟
            </h2>
            <p className="text-warm-mocha/60 font-bold">
              ثلاث خطوات بسيطة لتحصلي على قطعتك المخصّصة
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.title} className="text-center relative">
                <div className="w-16 h-16 mx-auto grid place-items-center rounded-3xl bg-soft-rose text-white mb-4 shadow-soft relative">
                  <s.icon className="w-8 h-8" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 grid place-items-center rounded-full bg-white text-soft-rose text-sm font-black border-2 border-pastel-pink">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-black text-warm-mocha mb-1">{s.title}</h3>
                <p className="text-sm text-warm-mocha/65 font-semibold leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="text-center mb-9">
          <h2 className="text-2xl md:text-3xl font-black text-warm-mocha mb-2">
            ماذا قالت عميلاتنا 💕
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-3xl p-6 border border-pastel-pink/40 shadow-soft-sm"
            >
              <StarRating value={t.rating} />
              <p className="text-warm-mocha/80 font-semibold leading-relaxed my-4">
                ‟{t.text}”
              </p>
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-soft-rose text-white grid place-items-center font-black text-sm">
                  {t.name.charAt(0)}
                </span>
                <span className="font-black text-warm-mocha text-sm">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter />
    </main>
  );
}
