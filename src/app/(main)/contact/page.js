import { MessageCircle, Instagram, Facebook, Clock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/legal";
import { whatsappLink } from "@/lib/whatsapp";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "تواصل معنا | سارة دولز",
  description:
    "تواصلي مع فريق سارة دولز عبر واتساب أو نموذج الاتصال. سعداء بمساعدتك دائمًا.",
};

export default function ContactPage() {
  const wa = whatsappLink("مرحبًا سارة دولز 🌸، عندي استفسار...");

  return (
    <main>
      <PageHeader
        emoji="💬"
        title="تواصلي معنا"
        subtitle="عندك سؤال أو استفسار؟ فريق سارة دولز سعيد بمساعدتك في أي وقت."
      />

      <div className="max-w-5xl mx-auto px-5 py-12 grid md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="space-y-5">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#25D366] text-white rounded-3xl p-5 shadow-soft hover:brightness-95 transition"
          >
            <div className="w-12 h-12 grid place-items-center rounded-2xl bg-white/20 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-lg">راسلينا على واتساب</p>
              <p className="text-white/85 font-semibold text-sm">
                أسرع طريقة للرد على استفساراتك
              </p>
            </div>
          </a>

          <div className="bg-white rounded-3xl p-6 border border-pastel-pink/40 shadow-soft-sm space-y-4">
            <InfoRow icon={Clock} title="مواعيد العمل">
              يوميًا من 10 صباحًا حتى 10 مساءً
            </InfoRow>
            <InfoRow icon={MapPin} title="الموقع">
              نشحن إلى جميع محافظات مصر الـ 27
            </InfoRow>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-pastel-pink/40 shadow-soft-sm">
            <p className="font-black text-warm-mocha mb-3">تابعينا</p>
            <div className="flex gap-3">
              <Social href="https://instagram.com" icon={Instagram} label="إنستجرام" />
              <Social href="https://facebook.com" icon={Facebook} label="فيسبوك" />
              <Social href={wa} icon={MessageCircle} label="واتساب" />
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-4xl p-6 md:p-8 border border-pastel-pink/40 shadow-soft">
          <h2 className="text-xl font-black text-warm-mocha mb-1">
            أرسلي لنا رسالة
          </h2>
          <p className="text-warm-mocha/60 font-semibold text-sm mb-6">
            املئي النموذج وسنرد عليك في أقرب وقت.
          </p>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}

function InfoRow({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 grid place-items-center rounded-xl bg-pastel-pink/30 text-soft-rose shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-black text-warm-mocha text-sm">{title}</p>
        <p className="text-warm-mocha/70 font-semibold text-sm">{children}</p>
      </div>
    </div>
  );
}

function Social({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 grid place-items-center rounded-2xl bg-pastel-pink/30 text-soft-rose hover:bg-soft-rose hover:text-white transition"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}
