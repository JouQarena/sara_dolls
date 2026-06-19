"use client";

import { useFormState } from "react-dom";
import { resetPasswordAction } from "../actions";
import { PasswordField, Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(resetPasswordAction, {});

  return (
    <>
      <h2 className="text-2xl font-black text-warm-mocha mb-1">
        كلمة مرور جديدة
      </h2>
      <p className="text-warm-mocha/60 font-semibold text-sm mb-6">
        اختاري كلمة مرور جديدة لحسابك.
      </p>

      <form action={formAction} className="space-y-4">
        {state?.error && <Alert type="error">{state.error}</Alert>}

        <PasswordField
          label="كلمة المرور الجديدة"
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

        <SubmitButton className="w-full bg-soft-rose text-white py-3.5 text-base hover:bg-brand-dark shadow-soft">
          حفظ كلمة المرور
        </SubmitButton>
      </form>
    </>
  );
}
