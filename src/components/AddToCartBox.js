"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Heart, Check, FileText } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ToastProvider";

export default function AddToCartBox({ product }) {
  const { addToCart, toggleWishlist, inWishlist } = useCart();
  const { toast } = useToast();

  const isPattern = product.product_type === "pattern_pdf";
  const outOfStock = !isPattern && product.stock <= 0;
  const maxQty = isPattern ? 99 : Math.max(1, product.stock);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const wished = inWishlist(product.id);

  function handleAdd() {
    if (outOfStock) return;
    addToCart(product, qty);
    toast("تمت الإضافة إلى السلة 🛍️");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWishlist() {
    const nowIn = toggleWishlist(product.id);
    toast(nowIn ? "أُضيف إلى المفضلة 💖" : "أُزيل من المفضلة");
  }

  return (
    <div className="space-y-4">
      {!outOfStock && !isPattern && (
        <div className="flex items-center gap-3">
          <span className="font-bold text-warm-mocha/70 text-sm">الكمية:</span>
          <div className="flex items-center bg-cream rounded-2xl border border-pastel-pink/60">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="p-2.5 text-warm-mocha hover:text-soft-rose disabled:opacity-30"
              disabled={qty <= 1}
              aria-label="إنقاص"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-black text-warm-mocha">
              {qty.toLocaleString("ar-EG")}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="p-2.5 text-warm-mocha hover:text-soft-rose disabled:opacity-30"
              disabled={qty >= maxQty}
              aria-label="زيادة"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-bold text-warm-mocha/40">
            متبقّي {product.stock} قطعة
          </span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={`flex-1 flex items-center justify-center gap-2 font-black py-4 rounded-2xl transition ${
            outOfStock
              ? "bg-pastel-pink/40 text-warm-mocha/50 cursor-not-allowed"
              : added
              ? "bg-green-600 text-white"
              : "bg-soft-rose text-white hover:bg-brand-dark shadow-soft"
          }`}
        >
          {outOfStock ? (
            "نفد المخزون"
          ) : added ? (
            <>
              <Check className="w-5 h-5" /> تمت الإضافة
            </>
          ) : isPattern ? (
            <>
              <FileText className="w-5 h-5" /> أضيفي الباترون للسلة
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" /> أضيفي للسلة
            </>
          )}
        </button>

        <button
          onClick={handleWishlist}
          className={`w-14 grid place-items-center rounded-2xl border transition ${
            wished
              ? "bg-soft-rose text-white border-soft-rose"
              : "bg-white text-soft-rose border-pastel-pink/60 hover:border-soft-rose"
          }`}
          aria-label="المفضلة"
        >
          <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  );
}
