"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction } from "../actions";
import { Field, PasswordField, Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";

function LoginForm() {
  const [state, formAction] = useFormState(loginAction, {});
  const params = useSearchParams();
  const justReset = params.get("reset") === "1";
  const justRegistered = params.get("registered") === "1";
  const redirectTo = params.get("redirect") || "/";

  return (
    <>
      <h2 className="text-2xl font-black text-warm-mocha mb-1">تسجيل الدخول</h2>
      <p className="text-warm-mocha/60 font-semibold text-sm mb-6">
        أهلاً بعودتك إلى سارة دولز 🌸
      </p>

      {justReset && (
        <div className="mb-4">
          <Alert type="success">تم تحديث كلمة المرور. سجّلي الدخول الآن.</Alert>
        </div>
      )}
      {justRegistered && (
        <div className="mb-4">
          <Alert type="success">تم إنشاء حسابك! سجّلي الدخول الآن.</Alert>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {state?.error && <Alert type="error">{state.error}</Alert>}

        <input type="hidden" name="redirect" value={redirectTo} />

        <Field
          label="البريد الإلكتروني"
          name="email"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          dir="ltr"
          required
        />
        <PasswordField
          label="كلمة المرور"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-soft-rose hover:underline"
          >
            نسيتِ كلمة المرور؟
          </Link>
        </div>

        <SubmitButton className="w-full bg-soft-rose text-white py-3.5 text-base hover:bg-brand-dark shadow-soft">
          تسجيل الدخول
        </SubmitButton>
      </form>

      <p className="text-center text-sm font-bold text-warm-mocha/70 mt-6">
        ليس لديك حساب؟{" "}
        <Link href="/signup" className="text-soft-rose hover:underline">
          أنشئي حساباً
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
