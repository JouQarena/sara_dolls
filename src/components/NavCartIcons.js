"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function NavCartIcons() {
  const { cartCount, wishlist, ready } = useCart();
  const wishCount = wishlist.length;

  return (
    <>
      <Link
        href="/wishlist"
        aria-label="المفضلة"
        className="relative p-2 rounded-full hover:bg-pastel-pink/30 text-warm-mocha transition"
      >
        <Heart className="w-5 h-5" />
        {ready && wishCount > 0 && (
          <Badge>{wishCount}</Badge>
        )}
      </Link>
      <Link
        href="/cart"
        aria-label="السلة"
        className="relative p-2 rounded-full hover:bg-pastel-pink/30 text-warm-mocha transition"
      >
        <ShoppingBag className="w-5 h-5" />
        {ready && cartCount > 0 && <Badge>{cartCount}</Badge>}
      </Link>
    </>
  );
}

function Badge({ children }) {
  return (
    <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-soft-rose text-white text-[0.6rem] font-black border-2 border-cream">
      {Number(children).toLocaleString("ar-EG")}
    </span>
  );
}
