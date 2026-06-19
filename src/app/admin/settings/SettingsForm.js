"use client";

import { useState } from "react";
import { saveSettings } from "../actions";

export default function SettingsForm({ settings }) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await saveSettings(new FormData(e.currentTarget));
    setSaving(false);
    setMsg(res?.error ? res.error : "تم حفظ الإعدادات 🌸");
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <Section title="المتجر">
        <Inp label="اسم المتجر (عربي)" name="store_name_ar" defaultValue={settings.store_name_ar} />
        <Inp label="نص شريط الإعلان" name="announcement_bar_text" defaultValue={settings.announcement_bar_text} />
        <Txt label="مقدمة الطلبات الخاصة" name="custom_order_intro_ar" defaultValue={settings.custom_order_intro_ar} />
      </Section>

      <Section title="التواصل والدفع">
        <Inp label="رقم واتساب (دولي بدون +)" name="whatsapp_number" defaultValue={settings.whatsapp_number} dir="ltr" placeholder="201001234567" />
        <Inp label="رقم/حساب إنستاباي" name="instapay_number" defaultValue={settings.instapay_number} dir="ltr" />
      </Section>

      <Section title="السوشيال ميديا">
        <Inp label="إنستجرام" name="instagram_url" defaultValue={settings.instagram_url} dir="ltr" />
        <Inp label="فيسبوك" name="facebook_url" defaultValue={settings.facebook_url} dir="ltr" />
        <Inp label="تيك توك" name="tiktok_url" defaultValue={settings.tiktok_url} dir="ltr" />
      </Section>

      <Section title="الشحن">
        <div className="grid grid-cols-2 gap-3">
          <Inp label="رسوم الشحن الثابتة (ج.م)" name="flat_shipping_fee" type="number" defaultValue={settings.flat_shipping_fee} />
          <Inp label="حد الشحن المجاني (ج.م)" name="free_shipping_threshold" type="number" defaultValue={settings.free_shipping_threshold} />
        </div>
      </Section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="bg-soft-rose text-white font-black px-8 py-3.5 rounded-2xl hover:bg-brand-dark disabled:opacity-60">
          {saving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
        </button>
        {msg && <span className="font-bold text-green-700">{msg}</span>}
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-3xl border border-pastel-pink/40 p-5">
      <h2 className="font-black text-warm-mocha mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Inp({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-warm-mocha mb-1">{label}</span>
      <input {...props} className="w-full rounded-xl border border-pastel-pink/60 bg-cream/60 px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose" />
    </label>
  );
}
function Txt({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-warm-mocha mb-1">{label}</span>
      <textarea rows={2} {...props} className="w-full rounded-xl border border-pastel-pink/60 bg-cream/60 px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose resize-none" />
    </label>
  );
}
