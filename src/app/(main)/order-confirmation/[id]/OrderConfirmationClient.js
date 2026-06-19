"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Copy, Check } from "lucide-react";
import { formatEGP } from "@/lib/constants";

export default function OrderConfirmationClient({ id, orderNumber }) {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sara_order_confirmation");
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);

  const refNumber = data?.orderNumber || orderNumber;
  const refLabel = refNumber ? `#${refNumber}` : id;

  function copyRef() {
    try {
      navigator.clipboard.writeText(String(refNumber || id));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-14 text-center">
      <div className="w-20 h-20 mx-auto grid place-items-center rounded-full bg-green-100 text-green-600 mb-5">
        <CheckCircle2 className="w-11 h-11" />
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-warm-mocha mb-2">
        تم تأكيد طلبك! 🎉
      </h1>
      <p className="text-warm-mocha/70 font-bold leading-relaxed mb-6">
        شكرًا لتسوّقك من سارة دولز 🌸 سنبدأ تجهيز طلبك ونتواصل معك لتأكيد التوصيل.
      </p>

      <div className="bg-cream rounded-3xl p-5 border border-pastel-pink/40 mb-6">
        <p className="text-sm font-bold text-warm-mocha/60 mb-1">رقم طلبك</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-black text-soft-rose">{refLabel}</span>
          <button
            onClick={copyRef}
            className="p-1.5 rounded-lg hover:bg-pastel-pink/30 text-warm-mocha/60"
            aria-label="نسخ"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        {data?.total != null && (
          <p className="text-sm font-black text-warm-mocha mt-2">
            الإجمالي: {formatEGP(data.total)}
          </p>
        )}
      </div>

      {data?.demo && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 rounded-xl p-2.5 mb-5">
          وضع المعاينة: لم يتم الحفظ في قاعدة البيانات (لم تُضبط بيانات Supabase بعد).
        </p>
      )}

      {data?.whatsapp && (
        <a
          href={data.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-4 rounded-2xl hover:brightness-95 transition shadow-soft mb-3"
        >
          <MessageCircle className="w-5 h-5" /> أرسلي ملخّص طلبك عبر واتساب
        </a>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/my-orders"
          className="bg-soft-rose text-white font-black py-3.5 rounded-2xl hover:bg-brand-dark transition"
        >
          متابعة طلباتي
        </Link>
        <Link
          href="/shop"
          className="bg-white text-warm-mocha font-black py-3.5 rounded-2xl border border-pastel-pink/60 hover:border-soft-rose transition"
        >
          متابعة التسوّق
        </Link>
      </div>
    </div>
  );
}
