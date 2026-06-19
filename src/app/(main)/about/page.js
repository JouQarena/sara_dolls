import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, ShieldCheck, Gift } from "lucide-react";
import { PageHeader } from "@/components/legal";

export const metadata = {
  title: "من نحن | سارة دولز",
  description:
    "قصة سارة دولز ورسالتنا: كروشيه يدوي مصنوع بحب من قلب مصر، كل دمية حكاية.",
};

const VALUES = [
  {
    icon: Heart,
    title: "مصنوع بحب",
    desc: "كل غرزة تُنسج بإتقان وشغف، لأننا نؤمن أن الحب يظهر في التفاصيل.",
  },
  {
    icon: ShieldCheck,
    title: "خامات آمنة",
    desc: "نختار خيوط قطنية ناعمة وآمنة، مناسبة للهدايا وللأطفال تحت إشراف الكبار.",
  },
  {
    icon: Sparkles,
    title: "قطع فريدة",
    desc: "لأنها يدوية، كل قطعة فريدة بذاتها ولا تتكرر تمامًا.",
  },
  {
    icon: Gift,
    title: "هدية لا تُنسى",
    desc: "تغليف أنيق ولمسة شخصية تجعل من كل قطعة هدية تبقى في الذاكرة.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        emoji="🌸"
        title="حكايتنا"
        subtitle="سارة دولز — كل دمية حكاية مصنوعة بحب من قلب مصر."
      />

      {/* Story */}
      <section className="max-w-4xl mx-auto px-5 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-2xl font-black text-warm-mocha mb-4">
            من فكرة بسيطة إلى شغف
          </h2>
          <div className="text-warm-mocha/80 font-semibold leading-loose space-y-4">
            <p>
              بدأت <strong>سارة دولز</strong> من حبّ صغير للكروشيه وخيوط القطن
              الملوّنة، وتحوّل هذا الحب إلى شغف بصناعة دمى وهدايا تحمل دفئًا
              لا تصنعه الآلات.
            </p>
            <p>
              نؤمن أن القطعة المصنوعة يدويًا تحمل روحًا خاصة؛ فكل ضفيرة، وكل
              ابتسامة مطرّزة، وكل تفصيلة صغيرة تُصنع بصبر ومحبة لتصل إليك قطعة
              تستحق أن تُهدى وتُحتفظ بها سنوات.
            </p>
            <p>
              من الدمى اليدوية، إلى الباترونات الجاهزة، إلى الهدايا للكبار
              والصغار، وحتى الطلبات الخاصة التي نصنعها حسب فكرتك أنتِ — هدفنا
              واحد: أن نزرع البهجة في كل بيت.
            </p>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-pastel-pink/40 rounded-[2.5rem] blur-2xl" />
            <Image
              src="/sara-avatar.jpg"
              alt="Sara Dolls"
              width={320}
              height={320}
              className="relative rounded-[2.5rem] border-4 border-white shadow-soft object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-cream border-y border-pastel-pink/40">
        <div className="max-w-3xl mx-auto px-5 py-12 text-center">
          <h2 className="text-2xl font-black text-warm-mocha mb-3">رسالتنا</h2>
          <p className="text-warm-mocha/80 font-bold leading-loose text-lg">
            أن نصنع قطعًا يدوية دافئة وآمنة، تحمل في طيّاتها حكاية وحبًا، وأن نجعل
            من كل هدية لحظة فرح لا تُنسى — مع الحفاظ على جودة الصنعة وصدق
            التعامل مع كل عميلة.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-5 py-12">
        <h2 className="text-2xl font-black text-warm-mocha text-center mb-8">
          ما يميّزنا
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-3xl p-6 text-center border border-pastel-pink/40 shadow-soft-sm hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 mx-auto grid place-items-center rounded-2xl bg-pastel-pink/30 text-soft-rose mb-4">
                <v.icon className="w-7 h-7" />
              </div>
              <h3 className="font-black text-warm-mocha mb-2">{v.title}</h3>
              <p className="text-sm text-warm-mocha/70 font-semibold leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-5 pb-16">
        <div className="rounded-[2rem] bg-gradient-to-l from-soft-rose to-brand-dark text-white p-8 text-center shadow-soft">
          <h2 className="text-2xl font-black mb-2">عندك فكرة في بالك؟</h2>
          <p className="text-white/85 font-bold mb-5">
            احكيلنا فكرتك وهنصنعها مخصوص لك بإيدينا 💝
          </p>
          <Link
            href="/طلب-خاص"
            className="inline-block bg-white text-soft-rose font-black px-7 py-3.5 rounded-2xl hover:bg-cream transition"
          >
            ✨ اطلبي تصميمك الخاص
          </Link>
        </div>
      </section>
    </main>
  );
}
