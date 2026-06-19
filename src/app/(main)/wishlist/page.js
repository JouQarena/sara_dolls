"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, FileText } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ToastProvider";
import { formatEGP } from "@/lib/constants";

export default function WishlistPage() {
  const { wishlist, ready, toggleWishlist, addToCart } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/products-by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: wishlist }),
    })
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ready, wishlist]);

  function remove(id) {
    toggleWishlist(id);
    setProducts((p) => p.filter((x) => x.id !== id));
    toast("أُزيل من المفضلة");
  }

  function add(product) {
    addToCart(product, 1);
    toast("تمت الإضافة إلى السلة 🛍️");
  }

  if (!ready || loading) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-20 text-center text-warm-mocha/50 font-bold">
        جارٍ التحميل…
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto text-pastel-pink mb-4" />
        <h1 className="text-2xl font-black text-warm-mocha mb-2">
          قائمة المفضلة فارغة
        </h1>
        <p className="text-warm-mocha/60 font-bold mb-6">
          أضيفي القطع التي تحبّينها لتجديها هنا 💖
        </p>
        <Link
          href="/shop"
          className="inline-block bg-soft-rose text-white font-black px-7 py-3.5 rounded-2xl hover:bg-brand-dark transition"
        >
          تصفّحي المتجر
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="text-2xl md:text-3xl font-black text-warm-mocha mb-6">
        المفضلة 💖
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => {
          const isPattern = p.product_type === "pattern_pdf";
          const outOfStock = !isPattern && p.stock <= 0;
          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl overflow-hidden border border-pastel-pink/40 shadow-soft-sm flex flex-col"
            >
              <Link
                href={`/product/${p.slug}`}
                className="relative aspect-square bg-cream block"
              >
                <Image
                  src={p.image_url || "/sara-avatar.jpg"}
                  alt={p.name_ar}
                  fill
                  className="object-cover"
                />
                {isPattern && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-warm-mocha text-cream text-[0.6rem] font-black px-2 py-0.5 rounded-full">
                    <FileText className="w-3 h-3" /> باترون
                  </span>
                )}
              </Link>
              <div className="p-3 flex flex-col flex-1">
                <Link
                  href={`/product/${p.slug}`}
                  className="font-black text-warm-mocha text-sm line-clamp-2 mb-1 hover:text-soft-rose"
                >
                  {p.name_ar}
                </Link>
                <span className="font-black text-soft-rose mb-2">
                  {formatEGP(p.price)}
                </span>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => add(p)}
                    disabled={outOfStock}
                    className={`flex-1 flex items-center justify-center gap-1 text-xs font-black py-2.5 rounded-xl transition ${
                      outOfStock
                        ? "bg-pastel-pink/40 text-warm-mocha/50"
                        : "bg-soft-rose text-white hover:bg-brand-dark"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {outOfStock ? "نفد" : "للسلة"}
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="w-9 grid place-items-center rounded-xl border border-pastel-pink/60 text-rose-500 hover:bg-rose-50"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
