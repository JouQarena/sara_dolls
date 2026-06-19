"use client";

import { useFormState } from "react-dom";
import { Mail } from "lucide-react";
import { subscribeNewsletter } from "@/app/(main)/newsletter-actions";
import SubmitButton from "@/components/SubmitButton";

export default function Newsletter() {
  const [state, formAction] = useFormState(subscribeNewsletter, {});

  return (
    <section className="max-w-4xl mx-auto px-5 py-12">
      <div className="rounded-[2rem] bg-gradient-to-l from-pastel-pink/60 to-cream border border-pastel-pink/50 p-8 md:p-10 text-center">
        <div className="w-14 h-14 mx-auto grid place-items-center rounded-2xl bg-soft-rose text-white mb-4">
          <Mail className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-warm-mocha mb-2">
          انضمي لنشرتنا البريدية
        </h2>
        <p className="text-warm-mocha/70 font-bold mb-6">
          كوني أول من يعرف عن المنتجات الجديدة والعروض الخاصة 💌
        </p>

        {state?.success ? (
          <p className="font-black text-green-700 bg-green-50 inline-block px-5 py-3 rounded-2xl">
            {state.success}
          </p>
        ) : (
          <form
            action={formAction}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              name="email"
              type="email"
              required
              dir="ltr"
              placeholder="بريدك الإلكتروني"
              className="flex-1 rounded-2xl border border-pastel-pink/60 bg-white px-4 py-3 text-warm-mocha font-semibold placeholder:text-warm-mocha/40 outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow transition text-center"
            />
            <SubmitButton className="bg-soft-rose text-white px-6 py-3 hover:bg-brand-dark shadow-soft-sm whitespace-nowrap">
              اشتراك
            </SubmitButton>
          </form>
        )}
        {state?.error && (
          <p className="text-rose-600 font-bold text-sm mt-3">{state.error}</p>
        )}
      </div>
    </section>
  );
}
