"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { forgotPasswordAction } from "../actions";
import { Field, Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(forgotPasswordAction, {});

  return (
    <>
      <h2 className="text-2xl font-black text-warm-mocha mb-1">
        إعادة تعيين كلمة المرور
      </h2>
      <p className="text-warm-mocha/60 font-semibold text-sm mb-6">
        أدخلي بريدك وسنرسل لك رابطاً لإعادة التعيين.
      </p>

      <form action={formAction} className="space-y-4">
        {state?.error && <Alert type="error">{state.error}</Alert>}
        {state?.success && <Alert type="success">{state.success}</Alert>}

        <Field
          label="البريد الإلكتروني"
          name="email"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          dir="ltr"
          required
        />

        <SubmitButton className="w-full bg-soft-rose text-white py-3.5 text-base hover:bg-brand-dark shadow-soft">
          إرسال الرابط
        </SubmitButton>
      </form>

      <p className="text-center text-sm font-bold text-warm-mocha/70 mt-6">
        تذكّرتِ كلمة المرور؟{" "}
        <Link href="/login" className="text-soft-rose hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </>
  );
}
