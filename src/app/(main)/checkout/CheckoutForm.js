"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Banknote,
  Smartphone,
  Upload,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useSettings, computeShippingClient } from "@/components/useSettings";
import { useToast } from "@/components/ToastProvider";
import { placeOrder } from "./actions";
import { regularOrderWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { formatEGP, EGYPT_GOVERNORATES } from "@/lib/constants";
import { Field, Alert } from "@/components/forms";

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, ready, cartSubtotal, clearCart } = useCart();
  const settings = useSettings();
  const { toast } = useToast();

  const [discount, setDiscount] = useState(null);
  const [payment, setPayment] = useState("cash_on_delivery");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const screenshotRef = useRef(null);
  const [screenshotName, setScreenshotName] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sara_checkout_discount");
      if (raw) setDiscount(JSON.parse(raw));
    } catch {}
  }, []);

  // Redirect to cart if empty (after hydration).
  useEffect(() => {
    if (ready && cart.length === 0 && !submitting) {
      router.replace("/cart");
    }
  }, [ready, cart.length, submitting, router]);

  const discountAmount = discount?.amount || 0;
  const afterDiscount = Math.max(0, cartSubtotal - discountAmount);
  const shipping = cart.length ? computeShippingClient(afterDiscount, settings) : 0;
  const total = afterDiscount + shipping;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("cart_json", JSON.stringify(cart));
    if (discount?.code) formData.set("discount_code", discount.code);

    // Capture the fields we need NOW (e.currentTarget becomes null after await).
    const orderInfo = {
      full_name: formData.get("full_name"),
      phone_number: formData.get("phone_number"),
      governorate: formData.get("governorate"),
      address: formData.get("address"),
    };

    try {
      const res = await placeOrder(formData);
      if (res?.error) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
      if (res?.success) {
        // Build WhatsApp message for confirmation page.
        const items = cart.map(
          (i) => `• ${i.name_ar} × ${i.quantity} = ${i.price * i.quantity} ج.م`
        );
        const msg = regularOrderWhatsappMessage({
          orderNumber: res.orderNumber,
          fullName: orderInfo.full_name,
          phone: orderInfo.phone_number,
          governorate: orderInfo.governorate,
          address: orderInfo.address,
          items,
          total: res.total,
          paymentMethod:
            payment === "instapay" ? "إنستاباي" : "الدفع عند الاستلام",
        });
        try {
          sessionStorage.setItem(
            "sara_order_confirmation",
            JSON.stringify({
              orderNumber: res.orderNumber,
              whatsapp: whatsappLink(msg),
              demo: res.demo || false,
              total: res.total,
            })
          );
          sessionStorage.removeItem("sara_checkout_discount");
        } catch {}
        clearCart();
        toast("تم تأكيد طلبك بنجاح! 🎉");
        router.push(`/order-confirmation/${res.id}`);
      }
    } catch {
      setError("حدث خطأ غير متوقع، حاولي مرة أخرى.");
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <div className="py-20 text-center text-warm-mocha/50 font-bold">
        جارٍ التحميل…
      </div>
    );
  }
  if (cart.length === 0) return null;

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
      {/* left: form */}
      <div className="lg:col-span-2 space-y-6">
        {error && <Alert type="error">{error}</Alert>}

        {/* shipping info */}
        <section className="bg-white rounded-3xl p-6 border border-pastel-pink/40">
          <h2 className="font-black text-warm-mocha text-lg mb-4">
            بيانات التوصيل 🚚
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="الاسم بالكامل" name="full_name" placeholder="اسمك" required />
              <Field
                label="رقم الهاتف"
                name="phone_number"
                type="tel"
                placeholder="01012345678"
                dir="ltr"
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
                  المحافظة <span className="text-soft-rose">*</span>
                </span>
                <select
                  name="governorate"
                  required
                  defaultValue=""
                  className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow"
                >
                  <option value="" disabled>
                    اختاري المحافظة
                  </option>
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g.slug} value={g.ar}>
                      {g.ar}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="المدينة / المنطقة" name="city" placeholder="مثال: مدينة نصر" />
            </div>
            <Field
              label="العنوان بالتفصيل"
              name="address"
              placeholder="الشارع، رقم المبنى، الشقة، علامة مميزة..."
              required
            />
            <label className="block">
              <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
                ملاحظات للطلب
              </span>
              <textarea
                name="notes"
                rows={2}
                placeholder="اختياري"
                className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold placeholder:text-warm-mocha/40 outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow resize-none"
              />
            </label>
          </div>
        </section>

        {/* payment */}
        <section className="bg-white rounded-3xl p-6 border border-pastel-pink/40">
          <h2 className="font-black text-warm-mocha text-lg mb-4">
            طريقة الدفع 💳
          </h2>
          <div className="space-y-3">
            <PayOption
              value="cash_on_delivery"
              current={payment}
              onChange={setPayment}
              icon={Banknote}
              title="الدفع عند الاستلام"
              desc="ادفعي نقدًا عند استلام طلبك."
            />
            <PayOption
              value="instapay"
              current={payment}
              onChange={setPayment}
              icon={Smartphone}
              title="إنستاباي (Instapay)"
              desc="حوّلي المبلغ وارفعي صورة الإيصال."
            />
            <input type="hidden" name="payment_method" value={payment} />

            {payment === "instapay" && (
              <div className="rounded-2xl bg-cream border border-pastel-pink/50 p-4 space-y-3">
                {settings.instapay_number ? (
                  <p className="text-sm font-bold text-warm-mocha">
                    حوّلي إلى:{" "}
                    <span className="text-soft-rose" dir="ltr">
                      {settings.instapay_number}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm font-bold text-warm-mocha/70">
                    سيتم تزويدك ببيانات التحويل عبر واتساب بعد الطلب.
                  </p>
                )}
                <label className="block">
                  <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
                    صورة إيصال التحويل <span className="text-soft-rose">*</span>
                  </span>
                  <input
                    ref={screenshotRef}
                    type="file"
                    name="instapay_screenshot"
                    accept="image/*"
                    onChange={(e) =>
                      setScreenshotName(e.target.files?.[0]?.name || "")
                    }
                    className="hidden"
                    id="instapay-file"
                  />
                  <label
                    htmlFor="instapay-file"
                    className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-pastel-pink/70 px-4 py-3 text-soft-rose font-bold text-sm hover:bg-pastel-pink/15"
                  >
                    <Upload className="w-4 h-4" />
                    {screenshotName || "اختاري صورة الإيصال"}
                  </label>
                </label>
              </div>
            )}
          </div>
        </section>

        {/* terms */}
        <label className="flex items-start gap-2.5 cursor-pointer select-none px-2">
          <input
            type="checkbox"
            name="agreed_to_terms"
            className="mt-1 w-4 h-4 accent-soft-rose shrink-0"
          />
          <span className="text-sm font-bold text-warm-mocha/80 leading-relaxed">
            أوافق على{" "}
            <Link href="/اتفاقية-المستخدم" target="_blank" className="text-soft-rose underline underline-offset-2">
              اتفاقية المستخدم
            </Link>{" "}
            و{" "}
            <Link href="/سياسة-الاسترجاع" target="_blank" className="text-soft-rose underline underline-offset-2">
              سياسة الاسترجاع
            </Link>
            .
          </span>
        </label>
      </div>

      {/* right: summary */}
      <aside className="lg:col-span-1">
        <div className="bg-cream rounded-3xl p-6 border border-pastel-pink/40 sticky top-24">
          <h2 className="font-black text-warm-mocha text-lg mb-4">طلبك</h2>

          <div className="space-y-3 max-h-60 overflow-auto mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                  <Image
                    src={item.image_url || "/sara-avatar.jpg"}
                    alt={item.name_ar}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute -top-1 -left-1 w-5 h-5 grid place-items-center rounded-full bg-soft-rose text-white text-[0.6rem] font-black">
                    {item.quantity.toLocaleString("ar-EG")}
                  </span>
                </div>
                <span className="flex-1 text-sm font-bold text-warm-mocha line-clamp-1">
                  {item.name_ar}
                </span>
                <span className="text-sm font-black text-warm-mocha whitespace-nowrap">
                  {formatEGP(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-sm font-bold border-t border-pastel-pink/40 pt-4">
            <Row label="المجموع الفرعي" value={formatEGP(cartSubtotal)} />
            {discountAmount > 0 && (
              <Row label="الخصم" value={`- ${formatEGP(discountAmount)}`} green />
            )}
            <Row
              label="الشحن"
              value={shipping === 0 ? "مجاني 🎉" : formatEGP(shipping)}
            />
            <div className="border-t border-pastel-pink/40 pt-3 flex items-center justify-between">
              <span className="font-black text-warm-mocha">الإجمالي</span>
              <span className="font-black text-soft-rose text-xl">
                {formatEGP(total)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-soft-rose text-white font-black py-4 rounded-2xl hover:bg-brand-dark shadow-soft transition disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> جارٍ التأكيد…
              </>
            ) : (
              "تأكيد الطلب"
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs font-bold text-warm-mocha/50 mt-3">
            <ShieldCheck className="w-4 h-4" /> طلبك آمن ومحمي
          </p>
        </div>
      </aside>
    </form>
  );
}

function PayOption({ value, current, onChange, icon: Icon, title, desc }) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-right transition ${
        active
          ? "border-soft-rose bg-pastel-pink/15"
          : "border-pastel-pink/40 hover:border-pastel-pink"
      }`}
    >
      <div
        className={`w-11 h-11 grid place-items-center rounded-xl shrink-0 ${
          active ? "bg-soft-rose text-white" : "bg-cream text-soft-rose"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-black text-warm-mocha">{title}</p>
        <p className="text-xs text-warm-mocha/60 font-semibold">{desc}</p>
      </div>
      <span
        className={`w-5 h-5 rounded-full border-2 grid place-items-center ${
          active ? "border-soft-rose" : "border-pastel-pink"
        }`}
      >
        {active && <span className="w-2.5 h-2.5 rounded-full bg-soft-rose" />}
      </span>
    </button>
  );
}

function Row({ label, value, green }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-warm-mocha/70">{label}</span>
      <span className={green ? "text-green-700" : "text-warm-mocha"}>{value}</span>
    </div>
  );
}
