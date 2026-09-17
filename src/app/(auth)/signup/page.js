"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { signupAction } from "../actions";
import { Field, PasswordField, Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";
import { useGender } from "@/components/GenderProvider";

export default function SignupPage() {
  const [state, formAction] = useFormState(signupAction, {});
  const { t } = useGender();

  if (state?.success) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-3">📬</div>
        <h2 className="text-2xl font-black text-warm-mocha mb-2">
          {t("تحققي من بريدك", "تحقق من بريدك")}
        </h2>
        <Alert type="success">{state.success}</Alert>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link
            href="/login"
            className="inline-block bg-soft-rose text-white font-black px-6 py-3 rounded-2xl hover:bg-brand-dark transition"
          >
            الذهاب لتسجيل الدخول
          </Link>
          <Link
            href="/shop"
            className="inline-block bg-white border-2 border-pastel-pink text-warm-mocha font-black px-6 py-3 rounded-2xl hover:border-soft-rose transition"
          >
            {t("اطلبي بدون حساب 🌸", "اطلب بدون حساب 🌸")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-black text-warm-mocha mb-1">إنشاء حساب</h2>
      <p className="text-warm-mocha/60 font-semibold text-sm mb-3">
        {t("انضمي لعائلة سارة دولز 🧶", "انضم لعائلة سارة دولز 🧶")}
      </p>
      <div className="bg-pastel-pink/20 border border-pastel-pink/60 rounded-2xl px-4 py-3 text-sm font-bold text-warm-mocha mb-6">
        {t("🌸 مش حابة تعملي حساب؟", "🌸 مش حابب تعمل حساب؟")}{" "}
        <Link href="/shop" className="text-soft-rose underline underline-offset-2">
          {t("اطلبي مباشرة بدون تسجيل", "اطلب مباشرة بدون تسجيل")}
        </Link>{" "}
        — لا حاجة لإيميل.
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && <Alert type="error">{state.error}</Alert>}

        <Field
          label="الاسم بالكامل"
          name="full_name"
          placeholder="مثال: سارة أحمد"
          autoComplete="name"
          required
        />
        <Field
          label="البريد الإلكتروني"
          name="email"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          dir="ltr"
          required
        />
        <Field
          label="رقم الهاتف"
          name="phone_number"
          type="tel"
          placeholder="01012345678"
          autoComplete="tel"
          dir="ltr"
          hint="رقم مصري صحيح، مثال: 01012345678"
          required
        />
        {/* Gender — decides how the site addresses you (مؤنث / مذكر) */}
        <div>
          <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
            الجنس <span className="text-soft-rose">*</span>
          </span>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-center gap-2 rounded-2xl border-2 border-pastel-pink/60 bg-cream/60 px-4 py-3 font-black text-warm-mocha cursor-pointer transition has-[:checked]:border-soft-rose has-[:checked]:bg-pastel-pink/15">
              <input
                type="radio"
                name="gender"
                value="female"
                defaultChecked
                className="w-4 h-4 accent-soft-rose"
              />
              👩 أنثى
            </label>
            <label className="flex items-center justify-center gap-2 rounded-2xl border-2 border-pastel-pink/60 bg-cream/60 px-4 py-3 font-black text-warm-mocha cursor-pointer transition has-[:checked]:border-soft-rose has-[:checked]:bg-pastel-pink/15">
              <input
                type="radio"
                name="gender"
                value="male"
                className="w-4 h-4 accent-soft-rose"
              />
              👨 ذكر
            </label>
          </div>
          <span className="block text-xs text-warm-mocha/50 font-bold mt-1">
            عشان الموقع يكلّمك بالطريقة المناسبة 🌸
          </span>
        </div>
        <PasswordField
          label="كلمة المرور"
          name="password"
          placeholder="8 أحرف على الأقل"
          autoComplete="new-password"
          required
        />
        <PasswordField
          label="تأكيد كلمة المرور"
          name="confirm_password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            name="agreed_to_terms"
            className="mt-1 w-4 h-4 accent-soft-rose shrink-0"
          />
          <span className="text-sm font-bold text-warm-mocha/80 leading-relaxed">
            أوافق على{" "}
            <Link
              href="/اتفاقية-المستخدم"
              target="_blank"
              className="text-soft-rose underline underline-offset-2"
            >
              اتفاقية المستخدم
            </Link>{" "}
            وسياسة الخصوصية.
          </span>
        </label>

        <SubmitButton className="w-full bg-soft-rose text-white py-3.5 text-base hover:bg-brand-dark shadow-soft">
          إنشاء الحساب
        </SubmitButton>
      </form>

      <p className="text-center text-sm font-bold text-warm-mocha/70 mt-6">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="text-soft-rose hover:underline">
          {t("سجّلي الدخول", "سجّل الدخول")}
        </Link>
      </p>
    </>
  );
}
