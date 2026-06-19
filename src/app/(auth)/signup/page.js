"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { signupAction } from "../actions";
import { Field, PasswordField, Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";

export default function SignupPage() {
  const [state, formAction] = useFormState(signupAction, {});

  if (state?.success) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-3">📬</div>
        <h2 className="text-2xl font-black text-warm-mocha mb-2">
          تحققي من بريدك
        </h2>
        <Alert type="success">{state.success}</Alert>
        <Link
          href="/login"
          className="inline-block mt-6 bg-soft-rose text-white font-black px-6 py-3 rounded-2xl hover:bg-brand-dark transition"
        >
          الذهاب لتسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-black text-warm-mocha mb-1">إنشاء حساب</h2>
      <p className="text-warm-mocha/60 font-semibold text-sm mb-6">
        انضمي لعائلة سارة دولز 🧶
      </p>

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
          سجّلي الدخول
        </Link>
      </p>
    </>
  );
}
