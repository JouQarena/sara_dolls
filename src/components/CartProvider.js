"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const CartContext = createContext(null);

const CART_KEY = "sara_cart";
const WISH_KEY = "sara_wishlist";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]); // array of product ids
  const [ready, setReady] = useState(false);

  // Load from localStorage on mount.
  useEffect(() => {
    setCart(readJSON(CART_KEY, []));
    setWishlist(readJSON(WISH_KEY, []));
    setReady(true);
  }, []);

  // Persist + broadcast.
  const persistCart = useCallback((next) => {
    setCart(next);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const persistWish = useCallback((next) => {
    setWishlist(next);
    try {
      localStorage.setItem(WISH_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  // Sync across tabs / other components dispatching events.
  useEffect(() => {
    function onCart() {
      setCart(readJSON(CART_KEY, []));
    }
    function onWish() {
      setWishlist(readJSON(WISH_KEY, []));
    }
    window.addEventListener("sara-cart-updated", onCart);
    window.addEventListener("sara-wishlist-updated", onWish);
    window.addEventListener("storage", (e) => {
      if (e.key === CART_KEY) onCart();
      if (e.key === WISH_KEY) onWish();
    });
    return () => {
      window.removeEventListener("sara-cart-updated", onCart);
      window.removeEventListener("sara-wishlist-updated", onWish);
    };
  }, []);

  // ---- cart actions ----
  const addToCart = useCallback(
    (product, qty = 1) => {
      const current = readJSON(CART_KEY, []);
      const existing = current.find((i) => i.id === product.id);
      let next;
      if (existing) {
        next = current.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      } else {
        next = [
          ...current,
          {
            id: product.id,
            slug: product.slug,
            name_ar: product.name_ar,
            price: product.price,
            image_url: product.image_url,
            product_type: product.product_type,
            stock: product.stock,
            quantity: qty,
          },
        ];
      }
      persistCart(next);
    },
    [persistCart]
  );

  const updateQty = useCallback(
    (id, qty) => {
      const current = readJSON(CART_KEY, []);
      const next = current
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))
        .filter((i) => i.quantity > 0);
      persistCart(next);
    },
    [persistCart]
  );

  const removeFromCart = useCallback(
    (id) => {
      const current = readJSON(CART_KEY, []);
      persistCart(current.filter((i) => i.id !== id));
    },
    [persistCart]
  );

  const clearCart = useCallback(() => persistCart([]), [persistCart]);

  // ---- wishlist actions ----
  const toggleWishlist = useCallback(
    (productId) => {
      const current = readJSON(WISH_KEY, []);
      const next = current.includes(productId)
        ? current.filter((x) => x !== productId)
        : [...current, productId];
      persistWish(next);
      return next.includes(productId);
    },
    [persistWish]
  );

  const inWishlist = useCallback(
    (productId) => wishlist.includes(productId),
    [wishlist]
  );

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ready,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        inWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
