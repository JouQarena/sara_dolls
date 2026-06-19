"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowLeft,
  Check,
  FileText,
} from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useSettings, computeShippingClient } from "@/components/useSettings";
import { formatEGP } from "@/lib/constants";

export default function CartPage() {
  const { cart, ready, updateQty, removeFromCart, cartSubtotal } = useCart();
  const settings = useSettings();

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(null); // {amount, code}
  const [codeError, setCodeError] = useState("");
  const [checking, setChecking] = useState(false);

  const discountAmount = discount?.amount || 0;
  const afterDiscount = Math.max(0, cartSubtotal - discountAmount);
  const shipping = cart.length ? computeShippingClient(afterDiscount, settings) : 0;
  const total = afterDiscount + shipping;

  async function applyCode(e) {
    e.preventDefault();
    setCodeError("");
    setChecking(true);
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount({ amount: data.amount, code: data.code });
        setCodeError("");
      } else {
        setDiscount(null);
        setCodeError(data.error || "كود الخصم غير صالح.");
      }
    } catch {
      setCodeError("تعذّر التحقق من الكود.");
    } finally {
      setChecking(false);
    }
  }

  // Persist applied discount to checkout via query/sessionStorage.
  function goToCheckout() {
    try {
      sessionStorage.setItem(
        "sara_checkout_discount",
        JSON.stringify(discount || null)
      );
    } catch {}
  }

  if (!ready) {
    return <div className="max-w-5xl mx-auto px-5 py-20 text-center text-warm-mocha/50 font-bold">جارٍ التحميل…</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-pastel-pink mb-4" />
        <h1 className="text-2xl font-black text-warm-mocha mb-2">سلتك فارغة</h1>
        <p className="text-warm-mocha/60 font-bold mb-6">
          لسه ما اخترتِش حاجة؟ تصفّحي مجموعتنا المصنوعة بحب 🌸
        </p>
        <Link
          href="/shop"
          className="inline-block bg-soft-rose text-white font-black px-7 py-3.5 rounded-2xl hover:bg-brand-dark transition"
        >
          ابدئي التسوّق
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="text-2xl md:text-3xl font-black text-warm-mocha mb-6">
        سلة التسوّق
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => {
            const isPattern = item.product_type === "pattern_pdf";
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-3 sm:p-4 border border-pastel-pink/40 flex gap-3 sm:gap-4"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-cream shrink-0"
                >
                  <Image
                    src={item.image_url || "/sara-avatar.jpg"}
                    alt={item.name_ar}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-black text-warm-mocha line-clamp-2 hover:text-soft-rose transition"
                  >
                    {item.name_ar}
                  </Link>
                  {isPattern && (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-warm-mocha/60 mt-1">
                      <FileText className="w-3 h-3" /> باترون رقمي
                    </span>
                  )}
                  <p className="text-soft-rose font-black mt-1">
                    {formatEGP(item.price)}
                  </p>

                  <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="flex items-center bg-cream rounded-xl border border-pastel-pink/60">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="p-2 text-warm-mocha hover:text-soft-rose disabled:opacity-30"
                        disabled={item.quantity <= 1}
                        aria-label="إنقاص"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-black text-warm-mocha text-sm">
                        {item.quantity.toLocaleString("ar-EG")}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="p-2 text-warm-mocha hover:text-soft-rose"
                        aria-label="زيادة"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1 text-rose-500 hover:text-rose-700 text-sm font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-soft-rose font-black mt-2 hover:gap-2.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" /> متابعة التسوّق
          </Link>
        </div>

        {/* summary */}
        <aside className="lg:col-span-1">
          <div className="bg-cream rounded-3xl p-6 border border-pastel-pink/40 sticky top-24">
            <h2 className="font-black text-warm-mocha text-lg mb-4">ملخّص الطلب</h2>

            {/* discount */}
            <form onSubmit={applyCode} className="mb-4">
              <label className="block text-sm font-extrabold text-warm-mocha mb-1.5">
                كود الخصم
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-warm-mocha/40" />
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="SARA10"
                    className="w-full rounded-xl border border-pastel-pink/60 bg-white pr-9 pl-3 py-2.5 text-warm-mocha font-bold text-sm outline-none focus:border-soft-rose"
                  />
                </div>
                <button
                  type="submit"
                  disabled={checking || !code}
                  className="bg-warm-mocha text-cream font-black px-4 py-2.5 rounded-xl text-sm disabled:opacity-50"
                >
                  تطبيق
                </button>
              </div>
              {codeError && (
                <p className="text-rose-600 text-xs font-bold mt-1.5">{codeError}</p>
              )}
              {discount && (
                <p className="text-green-700 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> تم تطبيق الكود «{discount.code}»
                </p>
              )}
            </form>

            <div className="space-y-2.5 text-sm font-bold border-t border-pastel-pink/40 pt-4">
              <Row label="المجموع الفرعي" value={formatEGP(cartSubtotal)} />
              {discountAmount > 0 && (
                <Row
                  label="الخصم"
                  value={`- ${formatEGP(discountAmount)}`}
                  green
                />
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

            <Link
              href="/checkout"
              onClick={goToCheckout}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-soft-rose text-white font-black py-3.5 rounded-2xl hover:bg-brand-dark shadow-soft transition"
            >
              إتمام الطلب <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </aside>
      </div>
    </main>
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
