"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Package, Heart, LogOut, ChevronDown, Shield } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

export default function AccountMenu({ name, isAdmin }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const firstName = (name || "حسابي").split(" ")[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-cream border border-pastel-pink/60 rounded-full pl-2 pr-3 py-1.5 font-black text-sm text-warm-mocha hover:border-soft-rose transition"
      >
        <span className="w-7 h-7 rounded-full bg-soft-rose text-white grid place-items-center text-xs">
          {firstName.charAt(0)}
        </span>
        <span className="hidden sm:inline max-w-[90px] truncate">{firstName}</span>
        <ChevronDown className="w-4 h-4 opacity-60" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-soft border border-pastel-pink/50 p-1.5 z-50 animate-fade-in">
          <MenuLink href="/profile" icon={User} onClick={() => setOpen(false)}>
            حسابي
          </MenuLink>
          <MenuLink href="/my-orders" icon={Package} onClick={() => setOpen(false)}>
            طلباتي
          </MenuLink>
          <MenuLink href="/wishlist" icon={Heart} onClick={() => setOpen(false)}>
            المفضلة
          </MenuLink>
          {isAdmin && (
            <MenuLink href="/admin" icon={Shield} onClick={() => setOpen(false)}>
              لوحة الإدارة
            </MenuLink>
          )}
          <div className="h-px bg-pastel-pink/40 my-1" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon: Icon, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-warm-mocha hover:bg-cream transition"
    >
      <Icon className="w-4 h-4 text-soft-rose" />
      {children}
    </Link>
  );
}
