"use client";

import { useFormState } from "react-dom";
import { updateProfile, changePassword } from "./actions";
import { Field, PasswordField, Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";
import { EGYPT_GOVERNORATES } from "@/lib/constants";
import { useGender } from "@/components/GenderProvider";

export function ProfileInfoForm({ profile, email }) {
  const [state, formAction] = useFormState(updateProfile, {});
  const { t } = useGender();

  return (
    <section className="bg-white rounded-3xl p-6 border border-pastel-pink/40">
      <h2 className="font-black text-warm-mocha text-lg mb-4">البيانات الشخصية</h2>
      <form action={formAction} className="space-y-4">
        {state?.error && state.type !== "password" && (
          <Alert type="error">{state.error}</Alert>
        )}
        {state?.success && state.type === "profile" && (
          <Alert type="success">{state.success}</Alert>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="الاسم بالكامل"
            name="full_name"
            defaultValue={profile?.full_name || ""}
            required
          />
          <Field
            label="رقم الهاتف"
            name="phone_number"
            type="tel"
            dir="ltr"
            placeholder="01012345678"
            defaultValue={profile?.phone_number || ""}
          />
        </div>

        <label className="block">
          <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
            البريد الإلكتروني
          </span>
          <input
            value={email || ""}
            disabled
            dir="ltr"
            className="w-full rounded-2xl border border-pastel-pink/40 bg-cream/40 px-4 py-3 text-warm-mocha/50 font-semibold cursor-not-allowed text-left"
          />
        </label>

        {/* Gender — how the site addresses you */}
        <div>
          <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
            الجنس
          </span>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-center gap-2 rounded-2xl border-2 border-pastel-pink/60 bg-cream/60 px-4 py-2.5 font-black text-warm-mocha text-sm cursor-pointer transition has-[:checked]:border-soft-rose has-[:checked]:bg-pastel-pink/15">
              <input
                type="radio"
                name="gender"
                value="female"
                defaultChecked={profile?.gender !== "male"}
                className="w-4 h-4 accent-soft-rose"
              />
              👩 أنثى
            </label>
            <label className="flex items-center justify-center gap-2 rounded-2xl border-2 border-pastel-pink/60 bg-cream/60 px-4 py-2.5 font-black text-warm-mocha text-sm cursor-pointer transition has-[:checked]:border-soft-rose has-[:checked]:bg-pastel-pink/15">
              <input
                type="radio"
                name="gender"
                value="male"
                defaultChecked={profile?.gender === "male"}
                className="w-4 h-4 accent-soft-rose"
              />
              👨 ذكر
            </label>
          </div>
        </div>

        <div className="h-px bg-pastel-pink/30" />
        <p className="font-black text-warm-mocha text-sm">العنوان الافتراضي</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
              المحافظة
            </span>
            <select
              name="default_governorate"
              defaultValue={profile?.default_governorate || ""}
              className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow"
            >
              <option value="">{t("اختاري المحافظة", "اختار المحافظة")}</option>
              {EGYPT_GOVERNORATES.map((g) => (
                <option key={g.slug} value={g.ar}>
                  {g.ar}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="المدينة / المنطقة"
            name="default_city"
            defaultValue={profile?.default_city || ""}
          />
        </div>
        <Field
          label="العنوان بالتفصيل"
          name="default_address"
          defaultValue={profile?.default_address || ""}
        />

        <SubmitButton className="bg-soft-rose text-white px-7 py-3 hover:bg-brand-dark shadow-soft-sm">
          حفظ التغييرات
        </SubmitButton>
      </form>
    </section>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useFormState(changePassword, {});

  return (
    <section className="bg-white rounded-3xl p-6 border border-pastel-pink/40">
      <h2 className="font-black text-warm-mocha text-lg mb-4">تغيير كلمة المرور</h2>
      <form action={formAction} className="space-y-4">
        {state?.error && state.type === "password" && (
          <Alert type="error">{state.error}</Alert>
        )}
        {state?.success && state.type === "password" && (
          <Alert type="success">{state.success}</Alert>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
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
        </div>

        <SubmitButton className="bg-warm-mocha text-cream px-7 py-3 hover:opacity-90 shadow-soft-sm">
          تغيير كلمة المرور
        </SubmitButton>
      </form>
    </section>
  );
}
