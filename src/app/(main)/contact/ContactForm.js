"use client";

import { useFormState } from "react-dom";
import { sendContactMessage } from "./actions";
import { Field, Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";

export default function ContactForm() {
  const [state, formAction] = useFormState(sendContactMessage, {});

  if (state?.success) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-3">💌</div>
        <Alert type="success">{state.success}</Alert>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <Alert type="error">{state.error}</Alert>}

      <Field label="الاسم" name="name" placeholder="اسمك بالكامل" required />
      <Field
        label="البريد الإلكتروني"
        name="email"
        type="email"
        placeholder="example@email.com"
        dir="ltr"
      />
      <Field
        label="رقم الهاتف"
        name="phone"
        type="tel"
        placeholder="01012345678"
        dir="ltr"
        hint="اختياري — رقم مصري"
      />
      <label className="block">
        <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
          رسالتك <span className="text-soft-rose">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="اكتبي رسالتك أو استفسارك هنا..."
          className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold placeholder:text-warm-mocha/40 outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow transition resize-none"
        />
      </label>

      <SubmitButton className="w-full bg-soft-rose text-white py-3.5 text-base hover:bg-brand-dark shadow-soft">
        إرسال الرسالة
      </SubmitButton>
    </form>
  );
}
