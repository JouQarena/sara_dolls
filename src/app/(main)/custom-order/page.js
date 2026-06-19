import Link from "next/link";
import { MessageCircle, Palette, PackageCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/legal";
import CustomOrderForm from "./CustomOrderForm";

export const metadata = {
  title: "اطلبي تصميمك الخاص ✨ | سارة دولز",
  description:
    "عندك فكرة في بالك؟ احكيلنا وهنصنعها مخصوص لك بإيدينا. اطلبي دمية أو هدية أو تصميم خاص من سارة دولز.",
};

const STEPS = [
  { icon: MessageCircle, title: "احكيلنا فكرتك", desc: "املئي النموذج بالتفاصيل والصور." },
  { icon: Palette, title: "نرسل عرض السعر", desc: "نراجع طلبك ونتواصل معك بالسعر والمدة." },
  { icon: PackageCheck, title: "نصنع ونوصّل", desc: "بعد موافقتك نبدأ التنفيذ ونوصّله لك." },
];

export default function CustomOrderPage() {
  return (
    <main>
      <PageHeader
        emoji="✨"
        title="اطلبي تصميمك الخاص"
        subtitle="عندك فكرة معيّنة في بالك؟ شخصية محبّبة؟ هدية مميّزة؟ احكيلنا وهنصنعها مخصوص لك بإيدينا."
      />

      {/* How it works mini */}
      <section className="max-w-4xl mx-auto px-5 pt-8">
        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="bg-cream rounded-3xl p-5 border border-pastel-pink/40 text-center"
            >
              <div className="w-12 h-12 mx-auto grid place-items-center rounded-2xl bg-soft-rose text-white mb-3 relative">
                <s.icon className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 grid place-items-center rounded-full bg-white text-soft-rose text-xs font-black border-2 border-pastel-pink">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-black text-warm-mocha text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-warm-mocha/60 font-semibold">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intro note */}
      <section className="max-w-3xl mx-auto px-5 pt-8">
        <div className="rounded-3xl bg-pastel-pink/25 border border-soft-rose/40 p-5 flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-soft-rose shrink-0 mt-0.5" />
          <p className="text-warm-mocha/85 font-bold leading-relaxed text-sm">
            كل طلب خاص هو قطعة فريدة تُصنع خصيصًا لكِ. بعد إرسال طلبك، سيراجعه فريقنا
            ويتواصل معك عبر واتساب لمناقشة التفاصيل وإرسال عرض السعر. لمعرفة شروط
            العربون ومدة التنفيذ، اطّلعي على{" "}
            <Link
              href="/سياسة-الطلبات-الخاصة"
              className="text-soft-rose underline underline-offset-2"
            >
              سياسة الطلبات الخاصة
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-5 py-10">
        <div className="bg-white rounded-4xl p-6 md:p-8 border border-pastel-pink/40 shadow-soft">
          <CustomOrderForm />
        </div>
      </section>
    </main>
  );
}
